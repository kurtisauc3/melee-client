import { app, ipcMain, BrowserWindow, screen, Menu, shell } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as authService from './auth-service';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { GamecubeAdapter } from './gamecube-adapter';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { debounce, debounceTime, filter, map, throttleTime } from 'rxjs/operators';
import { GamecubeController } from './src/app/_models/common';
import { GamecubeInput } from './src/app/_models/enums';
import * as child_process from 'child_process';

let adapter: GamecubeAdapter = null;


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



    adapter = new GamecubeAdapter();
    adapter.gamecube_input.subscribe(data => win.webContents.send("gc_input", data));
    app.on('browser-window-focus', (event, win) =>
    {
        adapter.start_adapter();
    })
    app.on('browser-window-blur', (event, win) =>
    {
        adapter.stop_adapter();
    })

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

}
catch (error)
{
    //console.log(error)
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
