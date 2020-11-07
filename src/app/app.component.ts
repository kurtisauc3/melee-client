import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from './_services/electron.service';
import { SocketService } from './_services/socket.service';
import { ApiService } from './_services/api.service';
import { Observable, Subscription } from 'rxjs';
import { Lobby, User } from './_models/responses';
import { SocketEvent } from './_models/enums';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    user$: Observable<User>;

    constructor(private electron: ElectronService,  private translate: TranslateService, private api: ApiService, private router: Router, private socket: SocketService)
    {
        this.translate.setDefaultLang('en');
        this.api.initialize_api_service();
        this.initialize_socket_connection();

    }

    ngOnInit()
    {
        this.load_user();
    }

    load_user()
    {
        this.user$ = this.api.get_user(this.electron.user_id);
    }

    initialize_socket_connection()
    {
        this.socket.initialize_socket_service();
        this.socket.on_user_updated().subscribe((lobby_id) => this.load_user());
        this.socket.on_event(SocketEvent.connect).subscribe(() => console.log('connected'));
        this.socket.on_event(SocketEvent.disconnect).subscribe(() => console.log('disconnected'));
    }

}
