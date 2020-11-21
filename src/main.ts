import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { GamecubeAdapter } from './gamecube-adapter';
import { AuthService } from './auth-service';
import { takeUntil, takeWhile } from 'rxjs/operators';

let adapter: GamecubeAdapter = new GamecubeAdapter();
let auth_service: AuthService = new AuthService();
let app_window, auth_window, logout_window;

if (process.env.ELECTRON_DEBUG === 'true' || process.env.ELECTRON_DEBUG === 'vscode')
{
	require('electron-reload')(__dirname);
}

async function create_window()
{
	try
    {
        await auth_service.refresh_tokens();
        return create_app_window();
    }
    catch (err)
    {
        return create_auth_window();
    }
}

function create_app_window()
{
	app_window = new BrowserWindow({
		width: 960,
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
	app_window.loadFile(path.join(__dirname, 'index.html'));
	app_window.on('closed', () =>
	{
		app_window = null;
	});
	return app_window;
}

function create_auth_window()
{
    function destroy_auth_win()
    {
        auth_window?.close();
        auth_window = null;
    }
    destroy_auth_win();
    auth_window = new BrowserWindow({
        width: 960,
        height: 720,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false
        }
    });
    auth_window.loadURL(auth_service.authentication_url, { userAgent: 'Chrome' });
    const { session: { webRequest } } = auth_window.webContents;
    const filter = { urls: ['http://localhost/callback*'] };
    webRequest.onBeforeRequest(filter, async ({ url }) =>
    {
        await auth_service.load_tokens(url);
        create_app_window();
        return destroy_auth_win();
    });
    auth_window.on('authenticated', () => destroy_auth_win());
	auth_window.on('closed', () => auth_window = null);
	return auth_window;
}

function create_logout_window()
{
    logout_window = new BrowserWindow({ show: false });
    logout_window.loadURL(auth_service.logout_url);
    logout_window.on('ready-to-show', () =>
    {
        create_auth_window();
        logout_window.close();
        auth_service.logout();
	});
	return logout_window;
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
ipcMain.on("access_token", (event, arg) =>
{
	event.returnValue = auth_service.access_token;
});
ipcMain.on("user_id", (event, arg) =>
{
	event.returnValue = auth_service.user_id;
});
ipcMain.on("logout", (event, arg) =>
{
	create_logout_window();
});
