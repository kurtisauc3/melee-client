import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from './_services/electron.service';
import { SocketService } from './_services/socket.service';
import { ApiService } from './_services/api.service';
import { Observable } from 'rxjs';
import { User } from './_models/responses';
import { GamecubeInput, SocketEvent } from './_models/enums';
import { debounceTime, filter, map, pairwise } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router, RoutesRecognized } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    user$: Observable<User>;

    constructor(
        private electron: ElectronService,
        private translate: TranslateService,
        private api: ApiService,
        private socket: SocketService,
        private router: Router,
        private location: Location
    )
    {
        this.translate.setDefaultLang('en');
        this.initialize_socket_connection();
    }

    ngOnInit()
    {
        this.initialize_gca();
        this.load_user();
    }

    async load_user()
    {
        this.user$ = this.api.get_user(this.electron.user_id);
        await this.user$.toPromise();
    }

    initialize_socket_connection()
    {
        this.socket.initialize_socket_service();
        this.socket.on_user_updated().subscribe(() => this.load_user());
        this.socket.on_event(SocketEvent.connect).subscribe(() => console.log('connected'));
        this.socket.on_event(SocketEvent.disconnect).subscribe(() => console.log('disconnected'));
    }

    initialize_gca()
    {
        this.electron.initializeGamecubeAdapter();
        this.electron.on_gc_input.subscribe((input) => this.gca_input(input));
    }

    gca_input(input: GamecubeInput)
    {
        switch (input)
        {
            case GamecubeInput.A:
                $('.select-button')?.click();
                break;
            case GamecubeInput.B:
                $('.back-button')?.click();
                break;
            case GamecubeInput.UP:
            case GamecubeInput.DOWN:
                const current_tab_index = parseInt($('.select-button')?.attr('tabIndex'));
                const next_index = input === GamecubeInput.UP ? current_tab_index - 1 : current_tab_index + 1;
                $(`button[tabindex=${next_index}]`)?.focus();
                break;
            default:
                console.log(input);
                break;
        }
    }


    logout()
    {
        this.electron.logout();
    }


}
