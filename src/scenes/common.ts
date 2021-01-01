import 'phaser';
import { ipcRenderer } from 'electron';
import { ApiPlugin, TranslatePlugin } from '../plugins';
import { SceneKey, GamecubeControllerButton, MenuData } from '../models';

export class CommonScene extends Phaser.Scene
{
	api: ApiPlugin;
	translate: TranslatePlugin;

	MARGIN: number;
	LEFT: number;
	RIGHT: number;
	TOP: number;
	BOTTOM: number;
	LIGHT: string;
	ACCENT: string;
	DARK: string;

	main_camera: Phaser.Cameras.Scene2D.Camera;

	main_container: Phaser.GameObjects.Container;
	main_container_menu_containers: {[column: number]: Phaser.GameObjects.Container};

	selected_row: number;
	selected_column: number;

	constructor(config: string | Phaser.Types.Scenes.SettingsConfig)
	{
		super(config);
		ipcRenderer.on("gc_button", (event, button: GamecubeControllerButton) =>
		{
			if (this.scene.isActive())
			{
				switch (button)
				{
					case GamecubeControllerButton.UP:
						this.select_option(this.selected_row - 1, this.selected_column);
						break;
					case GamecubeControllerButton.DOWN:
						this.select_option(this.selected_row + 1, this.selected_column);
						break;
					case GamecubeControllerButton.LEFT:
						this.select_option(this.selected_row, this.selected_column - 1);
						break;
					case GamecubeControllerButton.RIGHT:
						this.select_option(this.selected_row, this.selected_column + 1);
						break;
					case GamecubeControllerButton.A:
						this.confirm_selection();
					case GamecubeControllerButton.B:
						this.confirm_selection_by_button(button);
						break;
				}
			}
		});
	}

	init()
	{
		// intitialize plugins
		this.api = this.plugins.get("api_plugin") as ApiPlugin;
		this.translate = this.plugins.get("translate_plugin") as TranslatePlugin;

		this.MARGIN = 0;
		this.LEFT = 0 + this.MARGIN;
		this.RIGHT = this.sys.game.canvas.width - this.MARGIN;
		this.TOP = 30 + this.MARGIN;
		this.BOTTOM = this.sys.game.canvas.height - this.MARGIN;
		this.LIGHT = "#FFFFFF";
		this.ACCENT = "#DDA01D";
		this.DARK = "#000000";
		this.selected_row = 0;
		this.selected_column = 0;
	}

	preload()
	{
		this.main_camera = this.cameras.main;
		this.main_camera.backgroundColor = Phaser.Display.Color.HexStringToColor(this.DARK);
	}

	create()
	{
		// add containers
		this.main_container = this.add.container(this.LEFT, this.TOP).setSize(this.RIGHT - this.MARGIN, this.BOTTOM - this.TOP);
		this.main_container_menu_containers = {};
	}

	update()
	{

	}

	add_menu_option(text: string, data: MenuData, column = 0, width = 100, height = 20)
	{
		// add text item (can use images)
		let y = 0;
		let container = this.main_container_menu_containers[column];
		if (!container)
		{
			container = this.add.container(width * column, 0);
			this.main_container_menu_containers[column] = container;
			this.main_container.add(container);
		}
		const row = container.length;
		if (row)
		{
			const first_item = container.getAt(0) as Phaser.GameObjects.Text;
			y = row * first_item.displayHeight;
		}
		let option = this.add.text(0, y, text);
		option.setStyle({
			color: this.get_color(row,column),
			backgroundColor: this.get_background_color(row,column),
			fontFamily: 'sans-serif',
			fixedWidth: width,
			fixedHeight: height
		});
		if (column < 0)
		{
			option.setAlpha(0);
		}

		// add data to game object
		option.setDataEnabled();
		for (let key in data)
		{
			option.setData(key, data[key]);
		}

		// add to menu container
		container.add(option);

		// default select first item
		if (column === 0 && container.length === 1)
		{
			this.select_option();
		}
	}

	select_option(row = 0, column = 0)
	{
		if (row < 0 || column < 0) return;
		if (this.main_container_menu_containers[column]?.getAt(row))
		{
			if (row !== this.selected_row) this.selected_row = row;
			if (column !== this.selected_column) this.selected_column = column;
			for (let column in this.main_container_menu_containers)
			{
				this.main_container_menu_containers[column].getAll().forEach((option: Phaser.GameObjects.Text, r) => option.setStyle({
					color: this.get_color(r,parseInt(column)),
					backgroundColor: this.get_background_color(r,parseInt(column))
				}));
			}
		}
	}

	confirm_selection()
	{
		const menu_option = this.main_container_menu_containers[this.selected_column]?.getAt(this.selected_row);
		if (menu_option) this.select_by_option(menu_option)
	}

	confirm_selection_by_button(button: GamecubeControllerButton)
	{
		for (let column in this.main_container_menu_containers)
		{
			const menu_option = this.main_container_menu_containers[column].getAll().find(option => option.getData("gamecube_button_binding") === button);
			if (menu_option) this.select_by_option(menu_option);
		}
	}

	select_by_option(menu_option: Phaser.GameObjects.GameObject)
	{
		const select = menu_option.getData("select");
		if (typeof select === "function")
		{
			select();
		}
	}

	switch_scene(key: string, data: any = {})
	{
		this.scene.stop().start(key, data);
	}

	get_is_selected(row, column): boolean
	{
		return (row === this.selected_row && column === this.selected_column)
	}

	get_color(row, column)
	{
		return this.get_is_selected(row,column) ? this.DARK : this.LIGHT;
	}

	get_background_color(row, column)
	{
		return this.get_is_selected(row,column) ? this.ACCENT : this.DARK;
	}

}
