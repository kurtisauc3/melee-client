import { GamecubeControllerButton } from "./gamecube";
export enum SceneKey
{
	Friends = "FriendsScene",
	Lobby = "LobbyScene",
	Main = "MainScene",
	MatchHistory = "MatchHistoryScene",
	Profile = "ProfileScene",
	SelectGame = "SelectGameScene",
	Teams = "TeamsScene",
	Login = "LoginScene",
	UserName = "UserNameScene"
}
export class MenuData
{
	select: Function;
	gamecube_button_binding?: GamecubeControllerButton;
	// add any data here we might need, sounds maybe?
}
