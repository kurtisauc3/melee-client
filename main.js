"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var authService = require("./auth-service");
function createAppWindow() {
    var args = process.argv.slice(1);
    var serve = args.some(function (val) { return val === '--serve'; });
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    var win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            contextIsolation: false,
            enableRemoteModule: true
        },
    });
    if (serve) {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    win.on('closed', function () {
        win = null;
    });
}
function createAuthWindow() {
    var _this = this;
    var win = null;
    function destroyAuthWin() {
        if (!win)
            return;
        win.close();
        win = null;
    }
    destroyAuthWin();
    win = new electron_1.BrowserWindow({
        width: 1000,
        height: 600,
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false
        }
    });
    win.loadURL(authService.getAuthenticationURL(), {
        userAgent: 'Chrome'
    });
    var webRequest = win.webContents.session.webRequest;
    var filter = {
        urls: [
            'http://localhost/callback*'
        ]
    };
    webRequest.onBeforeRequest(filter, function (_a) {
        var url = _a.url;
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, authService.loadTokens(url)];
                    case 1:
                        _b.sent();
                        createAppWindow();
                        return [2 /*return*/, destroyAuthWin()];
                }
            });
        });
    });
    win.on('authenticated', function () {
        destroyAuthWin();
    });
    win.on('closed', function () {
        win = null;
    });
}
function createLogoutWindow() {
    var _this = this;
    var logoutWindow = new electron_1.BrowserWindow({
        show: false,
    });
    logoutWindow.loadURL(authService.getLogOutUrl());
    logoutWindow.on('ready-to-show', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logoutWindow.close();
                    return [4 /*yield*/, authService.logout()];
                case 1:
                    _a.sent();
                    electron_1.app.quit();
                    return [2 /*return*/];
            }
        });
    }); });
}
function showWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, authService.refreshTokens()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, createAppWindow()];
                case 2:
                    err_1 = _a.sent();
                    createAuthWindow();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
try {
    electron_1.app.on('ready', function () { return setTimeout(showWindow, 400); });
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map