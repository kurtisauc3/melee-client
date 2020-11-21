import { GamecubeControllerButton } from "./gamecube";

export class MenuData
{
	select: Function;
	gamecube_button_binding?: GamecubeControllerButton;
	// add any data here we might need, sounds maybe?
}
export enum SceneKey
{
	Friends = "FriendsScene",
	Lobby = "LobbyScene",
	Main = "MainScene",
	MatchHistory = "MatchHistoryScene",
	Profile = "ProfileScene",
	SelectGame = "SelectGameScene",
	Teams = "TeamsScene"
}
