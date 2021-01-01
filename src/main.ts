import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { GamecubeAdapter } from './gamecube-adapter';

let adapter: GamecubeAdapter = new GamecubeAdapter();
let app_window: BrowserWindow;

if (process.env.ELECTRON_DEBUG === 'true' || process.env.ELECTRON_DEBUG === 'vscode')
{
	require('electron-reload')(__dirname);
}

function create_window()
{
	app_window = new BrowserWindow({
		width: 1280,
        height: 720,
		resizable: false,
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
	});
	app_window.webContents.openDevTools();
	app_window.loadFile(path.join(__dirname, 'index.html'));
	app_window.on('closed', () =>
	{
		app_window = null;
	});
	return app_window;
}

app.allowRendererProcessReuse = false;
app.on('ready', () =>
{
	create_window();
	adapter.gc.subscribe(data => app_window?.webContents?.send("gc", data));
	adapter.gc_button.subscribe(data => app_window?.webContents?.send("gc_button", data));
});
app.on('browser-window-focus', () => adapter.start_adapter());
app.on('browser-window-blur', () => adapter.stop_adapter());
app.on('window-all-closed', () =>
{
	if (process.platform !== 'darwin')
	{
		app.quit();
	}
});
app.on('activate', () =>
{
	if (app_window === null)
	{
		create_window();
	}
});
