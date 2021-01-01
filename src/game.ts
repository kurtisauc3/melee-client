import 'phaser';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { ApiPlugin, TranslatePlugin } from './plugins';
import { LoginScene, MainScene, FriendsScene, SelectGameScene, TeamsScene, ProfileScene, MatchHistoryScene, LobbyScene, UserNameScene } from './scenes';
import { GamecubeController, GamecubeControllerButton } from './models';

const titlebar = new Titlebar({
	backgroundColor: Color.TRANSPARENT,
	maximizable: false,
	menu: null
});

const config: GameConfig = {
	height: window.innerHeight,
	width: window.innerWidth,
	type: Phaser.AUTO,
	parent: 'overlay',
    dom: {
        createContainer: true
    },
	scene: [
		MainScene,
		UserNameScene,
		LoginScene,
		SelectGameScene,
		ProfileScene,
		FriendsScene,
		MatchHistoryScene,
		TeamsScene,
		LobbyScene
	],
	plugins: {
		global: [
			{
				plugin: ApiPlugin,
				key: "api_plugin",
				start: true
			},
			{
				plugin: TranslatePlugin,
				key: "translate_plugin",
				start: true
			}
		]
	}
};

const game = new Phaser.Game(config);
