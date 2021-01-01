import 'phaser';
import { remote } from 'electron';
import { CommonScene } from './common';
import { SceneKey } from '../models';
import validator from 'validator';

export class LoginScene extends CommonScene
{
	login_page: Phaser.GameObjects.DOMElement;
	login_form: HTMLFormElement;

	constructor()
	{
		super({ key: SceneKey.Login });
	}

	init()
	{
		super.init();
	}

	preload()
	{
		super.preload();
		this.load.html('loginpage', 'login.html');
	}

	create()
	{
		super.create();
		this.login_page = this.add.dom(0,0).createFromCache('loginpage').setOrigin(0,0);
		this.login_form = this.login_page.getChildByID("login_form") as HTMLFormElement;
		this.login_form.onsubmit = (event) =>
		{
			event.preventDefault();
			this.try_login();
			return false;
		}
	}

	update()
	{
		super.update();
	}

	async try_login()
	{
		const form_data = new FormData(this.login_form)
		const email = form_data.get("email") as string;
		const password = form_data.get("password") as string;
		if (validator.isStrongPassword(password))
		{
			try
			{
				await this.api.authenticate_email_password(email, password);
				this.switch_scene(SceneKey.Main);
			}
			catch (error)
			{
				switch (error.reason_code)
				{
					case 40307:
						this.wrong_password_error();
						break;
				}
			}
		}
		else
		{
			this.weak_password_error();
		}

	}

	wrong_password_error()
	{
		remote.dialog.showMessageBox({
			type: "error",
			title: this.translate.translate("wrong_password_title"),
			message: this.translate.translate("wrong_password_message")
		});
	}

	weak_password_error()
	{
		remote.dialog.showMessageBox({
			type: "error",
			title: this.translate.translate("weak_password_title"),
			message: this.translate.translate("weak_password_message")
		});
	}

}
