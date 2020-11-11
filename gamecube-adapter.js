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
exports.GamecubeAdapter = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var usb = require("usb");
var enums_1 = require("./src/app/_models/enums");
var GamecubeAdapter = /** @class */ (function () {
    function GamecubeAdapter() {
        this.ENDPOINT_IN = 0x81;
        this.ENDPOINT_OUT = 0x02;
        this.IS_OPEN = false;
        this.WORKING = false;
        this.setup_input();
    }
    GamecubeAdapter.prototype.start_adapter = function () {
        var _this = this;
        if (this.IS_OPEN || this.WORKING)
            return;
        this.WORKING = true;
        try {
            this.get_adapter().open();
        }
        catch (error) {
            console.log("gamecube adapter either not installed or in use by dolphin");
            this.WORKING = false;
            return;
        }
        this.get_iface().claim();
        this.get_outpoint().transfer([0x13], function (err) {
            _this.get_inpoint().startPoll(1, 37);
            _this.get_inpoint().on('data', function (data) { return _this.gamecube_controller.next(_this.get_port1_data(data)); });
            _this.IS_OPEN = true;
            _this.WORKING = false;
        });
    };
    GamecubeAdapter.prototype.stop_adapter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.IS_OPEN || this.WORKING)
                    return [2 /*return*/];
                this.WORKING = true;
                this.get_inpoint().stopPoll(function () {
                    _this.get_outpoint().transfer([0x14], function (err) {
                        _this.get_iface().release([_this.ENDPOINT_IN, _this.ENDPOINT_OUT], function (err) {
                            _this.get_adapter().close();
                            _this.IS_OPEN = false;
                            _this.WORKING = false;
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    GamecubeAdapter.prototype.read_data = function () {
        this.get_inpoint().transfer(37);
    };
    GamecubeAdapter.prototype.check_rumble = function (controllers) {
        var data = [0x11];
        for (var port = 0; port < 4; port++) {
            data[port + 1] = controllers[port].rumble;
        }
        this.get_outpoint().transfer(data);
    };
    GamecubeAdapter.prototype.get_adapter = function () {
        return usb.getDeviceList().find(function (device) { return device.deviceDescriptor.idVendor === 1406 && device.deviceDescriptor.idProduct === 823; });
    };
    GamecubeAdapter.prototype.get_iface = function () {
        return this.get_adapter().interface(0);
    };
    GamecubeAdapter.prototype.get_inpoint = function () {
        return this.get_iface().endpoint(this.ENDPOINT_IN);
    };
    GamecubeAdapter.prototype.get_outpoint = function () {
        return this.get_iface().endpoint(this.ENDPOINT_OUT);
    };
    GamecubeAdapter.prototype.setup_input = function () {
        var _this = this;
        this.gamecube_input = new rxjs_1.BehaviorSubject(null);
        this.gamecube_controller = new rxjs_1.BehaviorSubject(null);
        this.gamecube_controller.pipe(operators_1.map(function (data) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            for (var key in data === null || data === void 0 ? void 0 : data.buttons) {
                if (data === null || data === void 0 ? void 0 : data.buttons[key]) {
                    switch (key) {
                        case "buttonA":
                            return enums_1.GamecubeInput.A;
                        case "buttonB":
                            return enums_1.GamecubeInput.B;
                        case "buttonX":
                            return enums_1.GamecubeInput.X;
                        case "buttonY":
                            return enums_1.GamecubeInput.Y;
                        case "padUp":
                            return enums_1.GamecubeInput.UP;
                        case "padDown":
                            return enums_1.GamecubeInput.DOWN;
                        case "padRight":
                            return enums_1.GamecubeInput.RIGHT;
                        case "padLeft":
                            return enums_1.GamecubeInput.LEFT;
                        case "buttonStart":
                            return enums_1.GamecubeInput.START;
                        case "buttonZ":
                            return enums_1.GamecubeInput.Z;
                        case "buttonL":
                            return enums_1.GamecubeInput.L;
                        case "buttonR":
                            return enums_1.GamecubeInput.R;
                    }
                }
            }
            if (((_a = data === null || data === void 0 ? void 0 : data.axes) === null || _a === void 0 ? void 0 : _a.mainStickHorizontal) > 0.5)
                return enums_1.GamecubeInput.RIGHT;
            else if (((_b = data === null || data === void 0 ? void 0 : data.axes) === null || _b === void 0 ? void 0 : _b.mainStickHorizontal) < -0.5)
                return enums_1.GamecubeInput.LEFT;
            else if (((_c = data === null || data === void 0 ? void 0 : data.axes) === null || _c === void 0 ? void 0 : _c.mainStickVertical) > 0.5)
                return enums_1.GamecubeInput.UP;
            else if (((_d = data === null || data === void 0 ? void 0 : data.axes) === null || _d === void 0 ? void 0 : _d.mainStickVertical) < -0.5)
                return enums_1.GamecubeInput.DOWN;
            else if (((_e = data === null || data === void 0 ? void 0 : data.axes) === null || _e === void 0 ? void 0 : _e.cStickHorizontal) > 0.5)
                return enums_1.GamecubeInput.CSTICK_RIGHT;
            else if (((_f = data === null || data === void 0 ? void 0 : data.axes) === null || _f === void 0 ? void 0 : _f.cStickHorizontal) < -0.5)
                return enums_1.GamecubeInput.CSTICK_LEFT;
            else if (((_g = data === null || data === void 0 ? void 0 : data.axes) === null || _g === void 0 ? void 0 : _g.cStickVertical) > 0.5)
                return enums_1.GamecubeInput.CSTICK_UP;
            else if (((_h = data === null || data === void 0 ? void 0 : data.axes) === null || _h === void 0 ? void 0 : _h.cStickVertical) < -0.5)
                return enums_1.GamecubeInput.CSTICK_DOWN;
            else
                return null;
        }), operators_1.filter(function (data) { return data !== null; }), operators_1.throttleTime(200)).subscribe(function (data) { return _this.gamecube_input.next(data); });
    };
    GamecubeAdapter.prototype.raw_data = function (data) {
        var arr = [];
        var results = data.slice(1);
        for (var i = 0; i < 36; i++) {
            arr[i] = '';
            for (var j = 0; j < 8; j++) {
                arr[i] += (results[i] >> j) & 1;
            }
        }
        return arr;
    };
    GamecubeAdapter.prototype.get_port1_data = function (rawData) {
        var data = this.raw_data(rawData);
        var result = [];
        for (var port = 0; port < 4; port++) {
            result[port] = {
                'port': port + 1,
                'connected': 1 == data[0 + 9 * port][4],
                'buttons': {
                    'buttonA': 1 == data[1 + 9 * port][0],
                    'buttonB': 1 == data[1 + 9 * port][1],
                    'buttonX': 1 == data[1 + 9 * port][2],
                    'buttonY': 1 == data[1 + 9 * port][3],
                    'padUp': 1 == data[1 + 9 * port][7],
                    'padDown': 1 == data[1 + 9 * port][6],
                    'padLeft': 1 == data[1 + 9 * port][4],
                    'padRight': 1 == data[1 + 9 * port][5],
                    'buttonStart': 1 == data[2 + 9 * port][0],
                    'buttonZ': 1 == data[2 + 9 * port][1],
                    'buttonL': 1 == data[2 + 9 * port][3],
                    'buttonR': 1 == data[2 + 9 * port][2]
                },
                'axes': {
                    'mainStickHorizontal': (rawData[4 + 9 * port] / 128) - 1,
                    'mainStickVertical': (rawData[5 + 9 * port] / 128) - 1,
                    'cStickHorizontal': (rawData[6 + 9 * port] / 128) - 1,
                    'cStickVertical': (rawData[7 + 9 * port] / 128) - 1,
                    'triggerL': (rawData[8 + 9 * port] / 128) - 1,
                    'triggerR': (rawData[9 + 9 * port] / 128) - 1
                },
                'rumble': false
            };
        }
        return result[0];
    };
    return GamecubeAdapter;
}());
exports.GamecubeAdapter = GamecubeAdapter;
//# sourceMappingURL=gamecube-adapter.js.map