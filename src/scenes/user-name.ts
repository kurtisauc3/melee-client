import 'phaser';
import { remote } from 'electron';
import { CommonScene } from './common';
import { SceneKey } from '../models';
import validator from 'validator';

export class UserNameScene extends CommonScene
{
	user_name_page: Phaser.GameObjects.DOMElement;
	user_name_form: HTMLFormElement;
	min = 3;
	max = 16;

	constructor()
	{
		super({ key: SceneKey.UserName });
	}

	init()
	{
		super.init();
	}

	preload()
	{
		super.preload();
		this.load.html('usernamepage', 'user-name.html');
	}

	create()
	{
		super.create();
		this.user_name_page = this.add.dom(0,0).createFromCache('usernamepage').setOrigin(0,0);
		this.user_name_form = this.user_name_page.getChildByID("user_name_form") as HTMLFormElement;
		this.user_name_form.onsubmit = (event) =>
		{
			event.preventDefault();
			this.try_update_user_name();
			return false;
		}
	}

	update()
	{
		super.update();
	}

	async try_update_user_name()
	{
		try
		{
			const form_data = new FormData(this.user_name_form)
			const user_name = form_data.get("user_name") as string;
			if (validator.isLength(user_name, {min: this.min, max: this.max}))
			{
				await this.api.update_user_name(user_name);
				this.switch_scene(SceneKey.Main);
			}
			else
			{
				this.invalid_username_error();
			}
		}
		catch (error)
		{
			console.log(error);
		}
	}

	invalid_username_error()
	{
		remote.dialog.showMessageBox({
			type: "error",
			title: this.translate.translate("invalid_player_name_title"),
			message: this.translate.translate("invalid_player_name_message", [this.min.toString(), this.max.toString()])
		});
	}

}
