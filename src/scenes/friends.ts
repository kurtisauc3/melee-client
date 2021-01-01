import 'phaser';
import { SceneKey, GamecubeControllerButton } from '../models';
import { CommonScene } from './common';

export class FriendsScene extends CommonScene
{
	add_friend_page: Phaser.GameObjects.DOMElement;
	add_friend_form: HTMLFormElement;

	constructor()
	{
		super({ key: SceneKey.Friends });
	}

	init()
	{
		super.init();
	}

	preload()
	{
		super.preload();
		this.load.html('addfriendpage', 'add-friend.html');
	}

	async create()
	{
		super.create();
		await this.try_list_friends();
		this.add_menu_option(this.translate.translate("add_friend"), { select: () => this.show_add_friend()});
		this.add_menu_option(this.translate.translate("back"), { select: () => this.switch_scene(SceneKey.Main), gamecube_button_binding: GamecubeControllerButton.B});
	}

	update()
	{
		super.update();
	}

	async try_list_friends()
	{
		try
		{
			const response = await this.api.list_friends();
			console.log(response);
		}
		catch (error)
		{
			console.log(error);
		}
	}

	show_add_friend()
	{
		this.add_friend_page = this.add.dom(this.RIGHT / 2, this.BOTTOM / 2).createFromCache('addfriendpage');
		this.add_friend_form = this.add_friend_page.getChildByID("add_friend_form") as HTMLFormElement;
		this.add_friend_form.onsubmit = (event) =>
		{
			event.preventDefault();
			this.try_add_friend();
			return false;
		}
	}

	async try_add_friend()
	{

	}
}
