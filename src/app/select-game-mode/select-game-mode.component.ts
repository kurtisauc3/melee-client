import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../_services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-game-mode',
  templateUrl: './select-game-mode.component.html',
  styleUrls: ['./select-game-mode.component.scss']
})
export class SelectGameModeComponent implements OnInit {

    gameModes$: Observable<any[]>;

    constructor(private api: ApiService, private router: Router) {}

    ngOnInit(): void
    {
        this.gameModes$ = this.api.GetGames().pipe(map(data => data?.DATA));
    }

    createLobby(game_id: String)
    {
        this.api.CreateLobby({game_id: game_id}).pipe(filter(data => data?.SUCCESS)).toPromise()
            .then((data) => this.onLobbyCreated(data))
            .catch((err) => this.onLobbyCreatedError(err))
    }

    onLobbyCreated(data)
    {
        if (data) this.api.GetProfile().toPromise();
    }

    onLobbyCreatedError(err)
    {
        console.log(err)
    }

}
