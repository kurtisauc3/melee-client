import 'phaser';
import { CommonScene } from './common';
import { DataAll, GamecubeControllerButton, SceneKey, MeleeGame, MeleeLobby } from '../models';
import { CreateLobbyRequest } from 'src/models/request';

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
		const data_all: DataAll = this.cache.json.get("data_all");
		if (data_all?.games?.length)
		{
			data_all.games.forEach(game => this.add_menu_option(this.translate_plugin.translate(game._id), { select: () => this.create_lobby(game)}))
		}
		this.add_menu_option(this.translate_plugin.translate("back"), { select: () => this.switch_scene(SceneKey.Main), gamecube_button_binding: GamecubeControllerButton.B});
	}

	async create_lobby(game: MeleeGame)
	{
		try
		{
			const request: CreateLobbyRequest = { game_id: game._id };
			const response: MeleeLobby = await this.axios.post("/api/lobby", request);
			this.switch_scene(SceneKey.Lobby, response);
		}
		catch (error)
		{
			this.api_down_error();
		}
	}
}
