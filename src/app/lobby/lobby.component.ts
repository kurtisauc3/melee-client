import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lobby } from 'app/_models/responses';
import { ApiService } from 'app/_services/api.service';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit
{
    lobby$: Observable<Lobby>;

    constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

    ngOnInit()
    {
        this.lobby$ = this.api.GetLobby(this.route.snapshot.params.id).pipe(map(data => data?.DATA));
    }

    leaveLobby()
    {
        this.api.LeaveLobby().pipe(map(data => data?.SUCCESS)).toPromise()
            .then(this.onLobbyLeft.bind(this))
            .catch(this.onLobbyLeftError.bind(this))
    }

    onLobbyLeft(data)
    {
        if (data) this.api.GetProfile().toPromise();
    }

    onLobbyLeftError(err)
    {
        console.log(err);
    }

}
