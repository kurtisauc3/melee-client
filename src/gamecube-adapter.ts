import { BehaviorSubject } from 'rxjs';
import { filter, map, throttleTime } from 'rxjs/operators';
import * as usb from 'usb';
import { GamecubeController, GamecubeControllerButton } from './models/gamecube';

export class GamecubeAdapter
{
	ENDPOINT_IN = 0x81;
	ENDPOINT_OUT = 0x02;

	private IS_OPEN = false;
	private WORKING = false;

	public gc: BehaviorSubject<GamecubeController>;
	public gc_button: BehaviorSubject<GamecubeControllerButton>;

	constructor()
	{
		this.setup_input();
	}

	start_adapter()
	{
		if (this.IS_OPEN || this.WORKING) return;
		this.WORKING = true;
		try
		{
			this.get_adapter().open();
		}
		catch (error)
		{
			console.log("gamecube adapter either not installed or in use by dolphin");
			this.WORKING = false;
			return;
		}
		this.get_iface().claim();
		this.get_outpoint().transfer([0x13], (err) =>
		{
			this.get_inpoint().startPoll(1, 37);
			this.get_inpoint().on('data', (data) => this.gc.next(this.get_port1_data(data)));

			this.IS_OPEN = true;
			this.WORKING = false;
		});
	}

	async stop_adapter()
	{
		if (!this.IS_OPEN || this.WORKING) return;
		this.WORKING = true;
		this.get_inpoint().stopPoll(() =>
		{
			this.get_outpoint().transfer([0x14], (err) =>
			{
				this.get_iface().release([this.ENDPOINT_IN, this.ENDPOINT_OUT], (err) =>
				{
					this.get_adapter().close();
					this.IS_OPEN = false;
					this.WORKING = false;
				});
			});
		});
	}

	read_data()
	{
		this.get_inpoint().transfer(37);
	}

	check_rumble(controllers)
	{
		let data = [0x11];
		for (var port = 0; port < 4; port++)
		{
			data[port + 1] = controllers[port].rumble;
		}
		this.get_outpoint().transfer(data);
	}

	private get_adapter()
	{
		return usb.getDeviceList().find(device => device.deviceDescriptor.idVendor === 1406 && device.deviceDescriptor.idProduct === 823);
	}
	private get_iface()
	{
		return this.get_adapter().interface(0);
	}

	private get_inpoint()
	{
		return this.get_iface().endpoint(this.ENDPOINT_IN);
	}

	private get_outpoint()
	{
		return this.get_iface().endpoint(this.ENDPOINT_OUT);
	}

	private setup_input()
	{
		this.gc = new BehaviorSubject(null);
		this.gc_button = new BehaviorSubject(null);
		this.gc.pipe(map(data =>
			{
				if (data?.buttons)
				{
					const buttonKey = Object.keys(data.buttons).find(key => data.buttons[key]) as GamecubeControllerButton;
					if (buttonKey) return buttonKey;
				}
				if (data?.axes)
				{
					const threshold = 0.5;
					for (let key in data.axes)
					{
						const value = data.axes[key];
						switch (key)
						{
							case "main_stick_vertical":
								if (value < -threshold) return GamecubeControllerButton.DOWN;
								else if (value > threshold) return GamecubeControllerButton.UP;
								break;
							case "main_stick_horizontal":
								if (value < -threshold) return GamecubeControllerButton.LEFT;
								else if (value > threshold) return GamecubeControllerButton.RIGHT;
								break;
						}
					}
				}
				return null;
			}), filter(data => data !== null), throttleTime(200)).subscribe(data => this.gc_button.next(data));
	}

	raw_data(data)
	{
		let arr = [];
		let results = data.slice(1);
		for (var i = 0; i < 36; i++)
		{
			arr[i] = '';
			for (var j = 0; j < 8; j++)
			{
				arr[i] += (results[i] >> j) & 1;
			}
		}
		return arr;
	}

	get_port1_data(rawData): GamecubeController
	{
		var data = this.raw_data(rawData);
		let result: GamecubeController[] = [];
		for (var port = 0; port < 4; port++)
		{
			result[port] = {
				port: port + 1,
				connected: 1 == data[0 + 9 * port][4],
				buttons: {
					button_a: 1 == data[1 + 9 * port][0],
					button_b: 1 == data[1 + 9 * port][1],
					button_x: 1 == data[1 + 9 * port][2],
					button_y: 1 == data[1 + 9 * port][3],
					pad_up: 1 == data[1 + 9 * port][7],
					pad_down: 1 == data[1 + 9 * port][6],
					pad_left: 1 == data[1 + 9 * port][4],
					pad_right: 1 == data[1 + 9 * port][5],
					button_start: 1 == data[2 + 9 * port][0],
					button_z: 1 == data[2 + 9 * port][1],
					button_l: 1 == data[2 + 9 * port][3],
					button_r: 1 == data[2 + 9 * port][2]
				},
				axes: {
					main_stick_horizontal: (rawData[4 + 9 * port] / 128) - 1,
					main_stick_vertical: (rawData[5 + 9 * port] / 128) - 1,
					c_stick_horizontal: (rawData[6 + 9 * port] / 128) - 1,
					c_stick_vertical: (rawData[7 + 9 * port] / 128) - 1,
					trigger_l: (rawData[8 + 9 * port] / 128) - 1,
					trigger_r: (rawData[9 + 9 * port] / 128) - 1
				},
				rumble: false
			}
		}
		return result[0];
	}

}
