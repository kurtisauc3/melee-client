import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, throttleTime } from 'rxjs/operators';
import * as usb from 'usb';
import { promisify } from 'util';
import { GamecubeController } from './src/app/_models/common';
import { GamecubeInput } from './src/app/_models/enums';

export class GamecubeAdapter
{
    ENDPOINT_IN = 0x81;
    ENDPOINT_OUT = 0x02;

    private IS_OPEN = false;
    private WORKING = false;

    public gamecube_controller: BehaviorSubject<GamecubeController>;
    public gamecube_input: BehaviorSubject<GamecubeInput>;

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
        catch(error)
        {
            console.log("gamecube adapter either not installed or in use by dolphin");
            this.WORKING = false;
            return;
        }
        this.get_iface().claim();
        this.get_outpoint().transfer([0x13], (err) =>
        {
            this.get_inpoint().startPoll(1,37);
            this.get_inpoint().on('data', (data) => this.gamecube_controller.next(this.get_port1_data(data)));
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
                this.get_iface().release([this.ENDPOINT_IN,this.ENDPOINT_OUT], (err) =>
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
        for(var port=0;port<4;port++)
        {
            data[port+1] = controllers[port].rumble;
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
        this.gamecube_input = new BehaviorSubject(null);
        this.gamecube_controller = new BehaviorSubject(null);
        this.gamecube_controller.pipe(map(data =>
            {
                for (let key in data?.buttons)
                {
                    if (data?.buttons[key])
                    {
                        switch (key)
                        {
                            case "buttonA":
                                return GamecubeInput.A;
                            case "buttonB":
                                return GamecubeInput.B;
                            case "buttonX":
                                return GamecubeInput.X;
                            case "buttonY":
                                return GamecubeInput.Y;
                            case "padUp":
                                return GamecubeInput.UP;
                            case "padDown":
                                return GamecubeInput.DOWN;
                            case "padRight":
                                return GamecubeInput.RIGHT;
                            case "padLeft":
                                return GamecubeInput.LEFT;
                            case "buttonStart":
                                return GamecubeInput.START;
                            case "buttonZ":
                                return GamecubeInput.Z;
                            case "buttonL":
                                return GamecubeInput.L;
                            case "buttonR":
                                return GamecubeInput.R;
                        }
                    }
                }
                if (data?.axes?.mainStickHorizontal > 0.5) return GamecubeInput.RIGHT;
                else if (data?.axes?.mainStickHorizontal < -0.5) return GamecubeInput.LEFT;
                else if (data?.axes?.mainStickVertical > 0.5) return GamecubeInput.UP;
                else if (data?.axes?.mainStickVertical < -0.5) return GamecubeInput.DOWN;
                else if (data?.axes?.cStickHorizontal > 0.5) return GamecubeInput.CSTICK_RIGHT;
                else if (data?.axes?.cStickHorizontal < -0.5) return GamecubeInput.CSTICK_LEFT;
                else if (data?.axes?.cStickVertical > 0.5) return GamecubeInput.CSTICK_UP;
                else if (data?.axes?.cStickVertical < -0.5) return GamecubeInput.CSTICK_DOWN;
                else return null;
            }), filter(data => data !== null), throttleTime(200)).subscribe(data => this.gamecube_input.next(data));
    }

    raw_data(data)
    {
        let arr = [];
        let results = data.slice(1);
        for(var i=0;i<36;i++)
        {
            arr[i]='';
            for(var j=0;j<8;j++)
            {
                arr[i] += (results[i]>>j) & 1;
            }
        }
        return arr;
    }

    get_port1_data(rawData): GamecubeController
    {
        var data = this.raw_data(rawData);
        let result: GamecubeController[] = [];
        for(var port=0;port<4;port++)
        {
            result[port] = {
                'port': port+1,
                'connected': 1 == data[0+9*port][4],
                'buttons': {
                    'buttonA': 1 == data[1+9*port][0],
                    'buttonB': 1 == data[1+9*port][1],
                    'buttonX': 1 == data[1+9*port][2],
                    'buttonY': 1 == data[1+9*port][3],
                    'padUp': 1 ==  data[1+9*port][7],
                    'padDown': 1 == data[1+9*port][6],
                    'padLeft': 1 == data[1+9*port][4],
                    'padRight': 1 == data[1+9*port][5],
                    'buttonStart': 1 == data[2+9*port][0],
                    'buttonZ': 1 == data[2+9*port][1],
                    'buttonL': 1 == data[2+9*port][3],
                    'buttonR': 1 == data[2+9*port][2]
                },
                'axes': {
                    'mainStickHorizontal': (rawData[4+9*port]/128)-1,
                    'mainStickVertical': (rawData[5+9*port]/128)-1,
                    'cStickHorizontal': (rawData[6+9*port]/128)-1,
                    'cStickVertical': (rawData[7+9*port]/128)-1,
                    'triggerL': (rawData[8+9*port]/128)-1,
                    'triggerR': (rawData[9+9*port]/128)-1
                },
                'rumble': false
            }
        }
        return result[0];
    }

}
