import 'phaser';
import { SceneKey, GamecubeControllerButton } from '../models';
import { CommonScene } from './common';


export class LobbyScene extends CommonScene
{

	constructor()
	{
		super({ key: SceneKey.Lobby });
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
