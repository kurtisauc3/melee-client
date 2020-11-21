import 'phaser';
import { DataAll, GamecubeControllerButton, MeleeLobby, MeleeCharacter, SceneKey, MeleeUser, MenuData } from '../models';
import { CommonScene } from './common';

export class LobbyScene extends CommonScene
{
	main_container_lobby_users_container: Phaser.GameObjects.Container;
	lobby_data: MeleeLobby;
	lobby_users: MeleeUser[];

	constructor()
	{
		super({ key: SceneKey.Lobby });
	}

	init(data: MeleeLobby)
	{
		super.init();
		this.lobby_data = data;
	}

	async preload()
	{
		super.preload();
	}

	async create()
	{
		super.create();

		// add hidden menu items, bound to hotkeys
		this.add_menu_option(this.translate_plugin.translate("back"), { select: () => this.leave_lobby(), gamecube_button_binding: GamecubeControllerButton.B }, -1);

		// add melee character selection map
		const data_all: DataAll = this.cache.json.get("data_all");
		let index = 0;
		for (let column = 0; column < 9; column ++)
		{
			for (let row = 0; row < 3; row++)
			{
				const character = data_all.characters[index];
				if (character) this.add_menu_option(this.translate_plugin.translate(character._id), { select: () => this.select_character(character)}, column, this.main_container.displayWidth / 9, this.main_container.displayWidth / 9);
				index++;
			}
		}
		try
		{
			// get lobby users
			this.lobby_users = await this.axios.get(`/api/lobby/users/${this.lobby_data._id}`, { cache: false });
		}
		catch (error)
		{
			this.api_down_error();
		}

		this.main_container_lobby_users_container = this.add.container(0, this.main_container.displayHeight);
		this.main_container.add(this.main_container_lobby_users_container);

		// add lobby users
		for (let index = 0; index < 4; index++)
		{
			const lobby_user = this.lobby_users[index];
			this.add_lobby_user(lobby_user, { select: () => console.log('lobby user selected', lobby_user)});
		}
	}

	select_character(character: MeleeCharacter)
	{
		//todo
		console.log(character);
	}

	add_lobby_user(user_data: MeleeUser | null, menu_data: MenuData)
	{
		const width = this.main_container.displayWidth / 4;
		const height = 320;
		const column = this.main_container_lobby_users_container.length;
		let x = 0;
		if (column)
		{
			const last_item = this.main_container_lobby_users_container.getAt(column - 1) as Phaser.GameObjects.Text;
			x = column * last_item.displayWidth;
		}
		const text = [];
		if (user_data?.username)
		{
			text.push(user_data.username);
			if (this.is_lobby_owner) text.push(this.translate_plugin.translate("lobby_owner"));
		}
		else
		{
			text.push(this.translate_plugin.translate("not_applicable"));
		}
		let option = this.add.text(x, 0, text)
			.setOrigin(0,1)
			.setPadding(10,5,10,5)
			.setStyle({
				color: this.LIGHT,
				backgroundColor: this.DARK,
				fontSize: 12,
				fontFamily: 'sans-serif',
				fixedWidth: width,
				fixedHeight: height,
		});

		// add data to game object
		option.setDataEnabled();
		for (let key in menu_data)
		{
			option.setData(key, menu_data[key]);
		}

		// add to menu container
		this.main_container_lobby_users_container.add(option);
	}

	async leave_lobby()
    {
        try
        {
            await this.axios.post("/api/lobby/leave");
			this.switch_scene(SceneKey.SelectGame);
        }
        catch (error)
        {
			this.api_down_error();
        }
	}

	private get is_lobby_owner(): boolean
	{
		return this.lobby_data?.owner_id === this.api_plugin.user_id;
	}
}
