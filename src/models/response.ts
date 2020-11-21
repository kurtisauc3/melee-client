export enum ResponseStatusCodes {
    success = 200,
    bad_request = 400,
    internal_server_error = 500,
    not_implemented = 501
}
export enum SocketEvent
{
    connect = 'connect',
    disconnect = 'disconnect',
    user_updated = 'user_updated',
    lobby_updated = 'lobby_updated'
}

export class DataAll
{
    games: MeleeGame[];
    characters: MeleeCharacter[];
	stages: MeleeStage[];
}

export enum MeleeGameFormat
{
    SINGLES = 1,
    DOUBLES = 2
}
export enum MeleeGameType
{
    QUICKPLAY = 1,
    CUSTOM = 2,
    RANKED = 3
}
export class MeleeGame
{
    _id: string;
    format: MeleeGameFormat;
    type: MeleeGameType;
    disabled: boolean;
}
export class MeleeCharacter
{
    _id: string;
    color_count: number;
}
export class MeleeStage
{
    _id: string;
    singles_neutral? = false;
    singles_counterpick? = false;
    doubles_neutral? = false;
    doubles_counterpick? = false;
}
export class MeleeLobby
{
    _id?: string;
    game_id: string;
    owner_id: string;
}
export class MeleeUser
{
    _id?: string;
    email: string;
    username: string;
    request_language: string;
	lobby_id?: string;
}
