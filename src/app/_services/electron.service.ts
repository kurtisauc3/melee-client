import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, remote } from 'electron';
import * as child_process from 'child_process';
import * as fs from 'fs';

@Injectable()
export class ElectronService
{

    ipc_renderer: typeof ipcRenderer;
    web_frame: typeof webFrame;
    remote: typeof remote;
    child_process: typeof child_process;
    fs: typeof fs;
    auth_service;

    get is_electron(): boolean
    {
        return !!(window && window.process && window.process.type);
    }

    constructor()
    {
        if (this.is_electron)
        {
            this.remote = window.require('electron').remote;
            this.ipc_renderer = window.require('electron').ipcRenderer;
            this.web_frame = window.require('electron').webFrame;
            this.child_process = window.require('child_process');
            this.fs = window.require('fs');
            this.auth_service = this.remote.require('./auth-service');
        }
    }

    get auth0_domain(): string
    {
        return this.auth_service.getAuth0Domain();
    }

    get bearer_token(): string
    {
        return this.auth_service.getAccessToken();
    }

    get user_profile()
    {
        return this.auth_service.getProfile();
    }

    get user_id(): string
    {
        if (this.user_profile?.sub?.split('|')[0] === 'auth0')
        {
            return this.user_profile.sub.split('|')[1];
        }
        return null;
    }

}
