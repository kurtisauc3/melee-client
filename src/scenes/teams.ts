import 'phaser';
import { GamecubeControllerButton, SceneKey } from '../models';
import { CommonScene } from './common';

export class TeamsScene extends CommonScene
{
	constructor()
	{
		super({ key: SceneKey.Teams });
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
		this.add_menu_option(this.translate_plugin.translate("back"), { select: () => this.switch_scene(SceneKey.Main), gamecube_button_binding: GamecubeControllerButton.B});
	}
}
