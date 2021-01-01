import 'phaser';
import { CommonScene } from './common';
import { SceneKey, GamecubeControllerButton } from '../models';

export class SelectGameScene extends CommonScene
{
	constructor()
	{
		super({ key: SceneKey.SelectGame });
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
		this.add_menu_option(this.translate.translate("back"), { select: () => this.switch_scene(SceneKey.Main), gamecube_button_binding: GamecubeControllerButton.B});
	}

	update()
	{
		super.update();
	}
}
