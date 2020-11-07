import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameFormat, GameType } from 'app/_models/enums';
import { Game, Lobby } from 'app/_models/responses';
import { LobbyView } from 'app/_models/views';
import { ApiService } from 'app/_services/api.service';
import { SocketService } from 'app/_services/socket.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy
{
    lobby_id: string;
    view$: Observable<LobbyView>;
    sub: Subscription;

    constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private socket: SocketService) { }

    ngOnInit()
    {
        this.lobby_id = this.route.snapshot.params.id;
        this.load_lobby_view();
        this.sub = this.socket.on_lobby_updated().subscribe(() => this.load_lobby_view());
    }

    ngOnDestroy()
    {
        this.sub?.unsubscribe();
    }

    load_lobby_view()
    {
        this.view$ = forkJoin([
            this.api.get_game_all(),
            this.api.get_lobby(this.lobby_id),
            this.api.get_lobby_users(this.lobby_id)
        ]).pipe(map(data => {
            return {
                game: data[0]?.find(game => game._id === data[1].game_id) ?? new Game(),
                lobby: data[1] ?? new Lobby(),
                users: data[2] ?? []
            };
        }));
    }
    async leave_lobby()
    {
        try
        {
            await this.api.leave_lobby().toPromise();
            this.router.navigate([""]);
        }
        catch (error)
        {
            console.log(error);
        }
    }

}
