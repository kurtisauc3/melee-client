export enum SocketEvent
{
    connect = 'connect',
    disconnect = 'disconnect',
    user_updated = 'user_updated',
    lobby_updated = 'lobby_updated'
}
export enum GameFormat
{
    SINGLES = 1,
    DOUBLES = 2
}
export enum GameType
{
    QUICKPLAY = 1,
    CUSTOM = 2,
    RANKED = 3
}
export enum GamecubeInput
{
    UP,
    DOWN,
    LEFT,
    RIGHT,
    CSTICK_UP,
    CSTICK_DOWN,
    CSTICK_LEFT,
    CSTICK_RIGHT,
    A,
    B,
    X,
    Y,
    START,
    Z,
    L,
    R,
}
