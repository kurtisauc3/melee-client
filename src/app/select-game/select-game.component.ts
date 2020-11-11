import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { Observable } from 'rxjs';
import { Game, Lobby } from 'app/_models/responses';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-select-game-mode',
  templateUrl: './select-game.component.html',
  styleUrls: ['./select-game.component.scss']
})
export class SelectGameComponent implements OnInit
{
    games$: Observable<Game[]>;

    constructor(
        private api: ApiService,
        private router: Router
    ) {}

    ngOnInit()
    {
        this.load_view();
    }

    load_view()
    {
        this.games$ = this.api.get_game_all();
    }

    async create_lobby(game: Game)
    {
        try
        {
            const lobby_data: Lobby = await this.api.create_lobby({game_id: game._id}).toPromise();
            this.router.navigate(["/lobby", lobby_data._id]);
        }
        catch (error)
        {
            console.log(error);
        }
    }

}
