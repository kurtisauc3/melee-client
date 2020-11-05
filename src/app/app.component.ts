import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from './_services/electron.service';
import { SocketService } from './_services/socket.service';
import { ApiService } from './_services/api.service';
import { Observable } from 'rxjs';
import { User } from './_models/responses';
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
    profile$: Observable<User>;
    ioConnection;

    constructor(private electron: ElectronService,  private translate: TranslateService, private api: ApiService, private router: Router, private socket: SocketService)
    {
        this.translate.setDefaultLang('en');
        this.api.initializeApiService();
    }

    ngOnInit()
    {
        this.initializeIoConnection();
    }

    initializeIoConnection()
    {
        this.socket.initializeSocketService();
        this.socket.onUserUpdated().pipe(filter(id => id === this.electron.user_id)).subscribe(async (user_id: string) =>
        {
            this.updateProfile();
        });
        this.socket.onEvent(SocketEvent.CONNECT).subscribe(() =>
        {
            console.log('connected');
        });

        this.socket.onEvent(SocketEvent.DISCONNECT).subscribe(() =>
        {
            console.log('disconnected');
        });
        this.updateProfile();
    }

    private async updateProfile()
    {
        this.profile$ = this.api.GetProfile().pipe(map(data => data?.DATA));
        const user_data = await this.profile$.toPromise();
        this.play(user_data?.lobby_id);
    }

    play(lobby_id: String)
    {
        if (lobby_id)
        {
            this.router.navigate(['lobby', lobby_id]);
        }
        else
        {
            this.router.navigate(['select-game-mode']);
        }
    }

}
