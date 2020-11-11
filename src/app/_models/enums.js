"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamecubeInput = exports.GameType = exports.GameFormat = exports.SocketEvent = void 0;
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["connect"] = "connect";
    SocketEvent["disconnect"] = "disconnect";
    SocketEvent["user_updated"] = "user_updated";
    SocketEvent["lobby_updated"] = "lobby_updated";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
var GameFormat;
(function (GameFormat) {
    GameFormat[GameFormat["SINGLES"] = 1] = "SINGLES";
    GameFormat[GameFormat["DOUBLES"] = 2] = "DOUBLES";
})(GameFormat = exports.GameFormat || (exports.GameFormat = {}));
var GameType;
(function (GameType) {
    GameType[GameType["QUICKPLAY"] = 1] = "QUICKPLAY";
    GameType[GameType["CUSTOM"] = 2] = "CUSTOM";
    GameType[GameType["RANKED"] = 3] = "RANKED";
})(GameType = exports.GameType || (exports.GameType = {}));
var GamecubeInput;
(function (GamecubeInput) {
    GamecubeInput[GamecubeInput["UP"] = 0] = "UP";
    GamecubeInput[GamecubeInput["DOWN"] = 1] = "DOWN";
    GamecubeInput[GamecubeInput["LEFT"] = 2] = "LEFT";
    GamecubeInput[GamecubeInput["RIGHT"] = 3] = "RIGHT";
    GamecubeInput[GamecubeInput["CSTICK_UP"] = 4] = "CSTICK_UP";
    GamecubeInput[GamecubeInput["CSTICK_DOWN"] = 5] = "CSTICK_DOWN";
    GamecubeInput[GamecubeInput["CSTICK_LEFT"] = 6] = "CSTICK_LEFT";
    GamecubeInput[GamecubeInput["CSTICK_RIGHT"] = 7] = "CSTICK_RIGHT";
    GamecubeInput[GamecubeInput["A"] = 8] = "A";
    GamecubeInput[GamecubeInput["B"] = 9] = "B";
    GamecubeInput[GamecubeInput["X"] = 10] = "X";
    GamecubeInput[GamecubeInput["Y"] = 11] = "Y";
    GamecubeInput[GamecubeInput["START"] = 12] = "START";
    GamecubeInput[GamecubeInput["Z"] = 13] = "Z";
    GamecubeInput[GamecubeInput["L"] = 14] = "L";
    GamecubeInput[GamecubeInput["R"] = 15] = "R";
})(GamecubeInput = exports.GamecubeInput || (exports.GamecubeInput = {}));
//# sourceMappingURL=enums.js.map