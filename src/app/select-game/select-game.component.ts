import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/operators';
import { Lobby } from 'app/_models/responses';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-game-mode',
  templateUrl: './select-game.component.html',
  styleUrls: ['./select-game.component.scss']
})
export class SelectGameComponent implements OnInit {

    games$: Observable<any[]>;

    constructor(private api: ApiService, private router: Router) {}

    ngOnInit(): void
    {
        this.load_games();
    }

    load_games()
    {
        this.games$ = this.api.get_game_all();
    }

    async create_lobby(game_id: String)
    {
        try
        {
            const lobby_data: Lobby = await this.api.create_lobby({game_id: game_id}).toPromise();
            this.router.navigate(["/lobby", lobby_data._id]);
        }
        catch (error)
        {
            console.log(error);
        }
    }

}
