import 'phaser';
import { SceneKey, GamecubeControllerButton } from '../models';
import { CommonScene } from './common';

export class MatchHistoryScene extends CommonScene
{
	constructor()
	{
		super({ key: SceneKey.MatchHistory });
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
