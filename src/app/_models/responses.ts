import { GameFormat, GameType } from "./enums";

export class ApiResponse
{
    SUCCESS: boolean;
    MESSAGE: string;
    DATA: any;
}
export class User
{
    _id?: String;
    email: String;
    username: String;
    request_language: String;
    lobby_id?: String;
}
export class Lobby
{
    _id?: String;
    game_id: String;
    owner_id: String;
}
export class Game
{
    _id?: String;
    format: GameFormat;
    type: GameType;
}
export class DeleteResult
{
    acknowledged: boolean;
    deletedCount: number;
}
