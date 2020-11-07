import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from './_services/electron.service';
import { SocketService } from './_services/socket.service';
import { ApiService } from './_services/api.service';
import { Observable } from 'rxjs';
import { User } from './_models/responses';
import { SocketEvent } from './_models/enums';

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
        private socket: SocketService
    )
    {
        this.translate.setDefaultLang('en');
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
        this.socket.on_user_updated().subscribe(() => this.load_user());
        this.socket.on_event(SocketEvent.connect).subscribe(() => console.log('connected'));
        this.socket.on_event(SocketEvent.disconnect).subscribe(() => console.log('disconnected'));
    }

    logout()
    {
        this.electron.logout();
    }


}
