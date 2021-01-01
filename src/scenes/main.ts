import 'phaser';
import { CommonScene } from './common';
import { SceneKey } from '../models';
import { remote } from 'electron';
import { http_status_code } from '../models/status';
import { Scene } from 'phaser';

export class MainScene extends CommonScene
{

	constructor()
	{
		super({ key: SceneKey.Main });
	}

	init()
	{
		super.init();
	}

	preload()
	{
		super.preload();
	}

	create()
	{
		super.create();
		this.try_reconnect();
	}

	update()
	{
		super.update();
	}

	async try_reconnect()
	{
		if (this.api.logged_in)
		{
			try
			{
				const response = await this.api.reconnect();
				if (response.playerName.length > 0)
				{
					this.add_menu()
				}
				else
				{
					this.switch_scene(SceneKey.UserName)
				}
			}
			catch (error)
			{
				console.log(error);
			}
		}
		else
		{
			this.switch_scene(SceneKey.Login);
		}
	}

	add_menu()
	{
		this.add_menu_option(this.translate.translate("play"), { select: () => this.switch_scene(SceneKey.SelectGame)});
		this.add_menu_option(this.translate.translate("profile"), { select: () => this.switch_scene(SceneKey.Profile)});
		this.add_menu_option(this.translate.translate("friends"), { select: () => this.switch_scene(SceneKey.Friends)});
		this.add_menu_option(this.translate.translate("match_history"), { select: () => this.switch_scene(SceneKey.MatchHistory)});
		this.add_menu_option(this.translate.translate("teams"), { select: () => this.switch_scene(SceneKey.Teams)});
		this.add_menu_option(this.translate.translate("logout"), { select: () => this.logout()});
		this.add_menu_option(this.translate.translate("exit"), { select: () => this.exit()});
	}

	logout()
	{
		this.api.reset_stored_profile_id();
		this.switch_scene(SceneKey.Login);
	}

	exit()
	{
		const win = remote.getCurrentWindow()
		win.webContents.closeDevTools(); // dev only
		win.close();
	}

}
