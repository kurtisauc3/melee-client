import 'phaser';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { ApiPlugin, GcPlugin, TranslatePlugin } from './plugins';
import { MainScene, FriendsScene, SelectGameScene, TeamsScene, ProfileScene, MatchHistoryScene, LobbyScene } from './scenes';

const titlebar = new Titlebar({
	backgroundColor: Color.fromHex('#2F3642'),
	maximizable: false
});

const config: GameConfig = {
	type: Phaser.AUTO,
	width: 960,
	height: 720,
	scene: [
		MainScene,
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
				plugin: GcPlugin,
				key: "gc_plugin",
				start: true
			},
			{
				plugin: ApiPlugin,
				key: "api_plugin",
				start: true
			},
			{
				plugin: TranslatePlugin,
				key: "translate_plugin",
				start: true
			},
		]
	}
};

const game = new Phaser.Game(config);
