import 'phaser';
import { GamecubeControllerButton, SceneKey } from '../models';
import { CommonScene } from './common';

export class ProfileScene extends CommonScene
{
	constructor()
	{
		super({ key: SceneKey.Profile });
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
		this.add_menu_option(this.translate_plugin.translate("back"), { select: () => this.switch_scene("MainScene"), gamecube_button_binding: GamecubeControllerButton.B});
	}
}
