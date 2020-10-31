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
        }
    }

    get bearerToken(): string
    {
        if (this.isElectron) return this.remote.require('./auth-service').getAccessToken();
        return null
    }

}
