import { app, ipcMain, BrowserWindow, screen, Menu, shell } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as authService from './auth-service';
import { Titlebar, Color } from 'custom-electron-titlebar';
import * as gca from 'gca-js';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { debounce, debounceTime, filter, map, throttleTime } from 'rxjs/operators';
import { GamecubeController } from './src/app/_models/common';
import { GamecubeInput } from './src/app/_models/enums';

function createAppWindow()
{
    const args = process.argv.slice(1);
    const serve = args.some(val => val === '--serve');

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    let win = new BrowserWindow({
        width: 1000,
        height: 600,
        resizable: false,
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            contextIsolation: false,
            enableRemoteModule: true
        },
    });

    if (serve)
    {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200');
    }
    else
    {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    win.on('closed', () =>
    {
        win = null;
    });

    addGca(win);
}

function createAuthWindow()
{
    let win = null;

    function destroyAuthWin()
    {
        if (!win) return;
        win.close();
        win = null;
    }

    destroyAuthWin();

    win = new BrowserWindow({
        width: 1000,
        height: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false
        }
    });

    win.loadURL(
        authService.getAuthenticationURL(),
        {
            userAgent: 'Chrome'
        }
    );

    const { session: { webRequest } } = win.webContents;

    const filter = {
        urls: [
            'http://localhost/callback*'
        ]
    };

    webRequest.onBeforeRequest(filter, async ({ url }) =>
    {
        await authService.loadTokens(url);
        createAppWindow();
        return destroyAuthWin();
    });

    win.on('authenticated', () =>
    {
        destroyAuthWin();
    });

    win.on('closed', () =>
    {
        win = null;
    });
}

async function showWindow()
{
    try
    {
        await authService.refreshTokens();
        return createAppWindow();
    }
    catch (err)
    {
        createAuthWindow();
    }
}

function addGca(win: BrowserWindow)
{
    try
    {
        const gc_controller = new BehaviorSubject<GamecubeController>(null);
        gc_controller.pipe(map(data =>
            {
                for (let key in data?.buttons)
                {
                    if (data?.buttons[key])
                    {
                        switch (key)
                        {
                            case "buttonA":
                                return GamecubeInput.A;
                            case "buttonB":
                                return GamecubeInput.B;
                            case "buttonX":
                                return GamecubeInput.X;
                            case "buttonY":
                                return GamecubeInput.Y;
                            case "padUp":
                                return GamecubeInput.UP;
                            case "padDown":
                                return GamecubeInput.DOWN;
                            case "padRight":
                                return GamecubeInput.RIGHT;
                            case "padLeft":
                                return GamecubeInput.LEFT;
                            case "buttonStart":
                                return GamecubeInput.START;
                            case "buttonZ":
                                return GamecubeInput.Z;
                            case "buttonL":
                                return GamecubeInput.L;
                            case "buttonR":
                                return GamecubeInput.R;
                        }
                    }
                }
                if (data?.axes?.mainStickHorizontal > 0.5) return GamecubeInput.RIGHT;
                else if (data?.axes?.mainStickHorizontal < -0.5) return GamecubeInput.LEFT;
                else if (data?.axes?.mainStickVertical > 0.5) return GamecubeInput.UP;
                else if (data?.axes?.mainStickVertical < -0.5) return GamecubeInput.DOWN;
                else if (data?.axes?.cStickHorizontal > 0.5) return GamecubeInput.CSTICK_RIGHT;
                else if (data?.axes?.cStickHorizontal < -0.5) return GamecubeInput.CSTICK_LEFT;
                else if (data?.axes?.cStickVertical > 0.5) return GamecubeInput.CSTICK_UP;
                else if (data?.axes?.cStickVertical < -0.5) return GamecubeInput.CSTICK_DOWN;
                else return null;
            }), filter(data => data !== null), throttleTime(200)).subscribe(data => win.webContents.send("gc_input", data));
        const adapter = gca.getAdaptersList()[0];
        gca.startAdapter(adapter);
        gca.pollData(adapter,(data) => gc_controller.next(gca.objectData(data)[0]));
    }
    catch (error)
    {
        console.log("gc_controller_error", error);
    }
}

try
{
    app.allowRendererProcessReuse = false;
    app.on('ready', () => setTimeout(showWindow, 400));
    app.on('window-all-closed', () =>
    {
        if (process.platform !== 'darwin')
        {
            app.quit();
        }
    });

} catch (e)
{
    // Catch Error
    // throw e;
}



ipcMain.on("logout", () =>
{
    const logoutWindow = new BrowserWindow({
        show: false,
    });

    logoutWindow.loadURL(authService.getLogOutUrl());

    logoutWindow.on('ready-to-show', async () =>
    {
        logoutWindow.close();
        await authService.logout();
        showWindow();
    });
});
