import 'phaser';
import logo_png from '../assets/logo.png';
import { CommonScene } from './common';
import { ipcRenderer, remote } from 'electron';
import { DataAll, SceneKey } from '../models';

export class MainScene extends CommonScene
{
	logo: Phaser.GameObjects.Image;

	constructor()
	{
		super({ key: SceneKey.Main });
	}

	init()
	{
		super.init();
	}

	async preload()
	{
		super.preload();
		this.load.image('logo', logo_png);
		try
		{
			const response: DataAll = await this.axios.get("/api/data/all");
			this.cache.json.add("data_all", response);
		}
		catch (error)
		{
			this.api_down_error();
		}
	}

	create()
	{
		super.create();
		this.add_menu_option(this.translate_plugin.translate("play"), { select: () => this.switch_scene("SelectGameScene")});
		this.add_menu_option(this.translate_plugin.translate("profile"), { select: () => this.switch_scene("ProfileScene")});
		this.add_menu_option(this.translate_plugin.translate("friends"), { select: () => this.switch_scene("FriendsScene")});
		this.add_menu_option(this.translate_plugin.translate("match_history"), { select: () => this.switch_scene("MatchHistoryScene")});
		this.add_menu_option(this.translate_plugin.translate("teams"), { select: () => this.switch_scene("TeamsScene")});
		this.add_menu_option(this.translate_plugin.translate("logout"), { select: () => this.logout()});
		this.main_container.add(this.add.image(this.main_container.width - 100, this.main_container.height - 100, 'logo').setScale(0.5).setOrigin(1,1));
	}

	logout()
	{
		ipcRenderer.send("logout");
		this.close_window();
	}

	close_window()
	{
		const win = remote.getCurrentWindow()
		win.webContents.closeDevTools();
		win.close();
	}
}
