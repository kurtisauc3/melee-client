import { GameFormat, GameType } from './enums';
import {Game, Lobby, User} from './responses';

export class LobbyView
{
    users: User[];
    game: Game;
    lobby: Lobby;
    lobby_owner: boolean;
}

export class GameView
{
    GameTypes: GameType[];
    GameFormats: GameFormat[];
}

export class SortedGame
{
    GameType: GameType;
    Game: Game[];
}
