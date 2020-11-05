import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ElectronService
{

    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    remote: typeof remote;
    childProcess: typeof childProcess;
    fs: typeof fs;
    authService;

    get isElectron(): boolean
    {
        return !!(window && window.process && window.process.type);
    }

    constructor(private http: HttpClient)
    {
        if (this.isElectron)
        {
            this.remote = window.require('electron').remote;
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;
            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
            this.authService = this.remote.require('./auth-service');
        }
    }

    get auth0Domain(): string
    {
        return this.authService.getAuth0Domain();
    }

    get bearerToken(): string
    {
        return this.authService.getAccessToken();
    }


    get userProfile()
    {
        return this.authService.getProfile();
    }

    get user_id(): string
    {
        if (this.userProfile?.sub?.split('|')[0] === 'auth0')
        {
            return this.userProfile.sub.split('|')[1];
        }
        return null;
    }

}
