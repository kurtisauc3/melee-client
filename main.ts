import { app, ipcMain, BrowserWindow, screen, Menu, shell } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as authService from './auth-service';

function setupMenu()
{
    const isMac = process.platform === 'darwin';
    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                { role: isMac ? 'close' : 'quit' },
                {
                    label: "Exit and Logout",
                    click: () =>
                    {
                        createLogoutWindow();
                    }
                }
            ]
        },
        { role: 'viewMenu' }
    ])
    Menu.setApplicationMenu(menu)
}

function createAppWindow()
{
    const args = process.argv.slice(1);
    const serve = args.some(val => val === '--serve');

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    let win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
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

function createLogoutWindow()
{
    const logoutWindow = new BrowserWindow({
        show: false,
    });

    logoutWindow.loadURL(authService.getLogOutUrl());

    logoutWindow.on('ready-to-show', async () =>
    {
        logoutWindow.close();
        await authService.logout();
        app.quit();
    });
}

async function showWindow()
{
    setupMenu();
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
