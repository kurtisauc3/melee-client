import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../_services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-select-game-mode',
  templateUrl: './select-game-mode.component.html',
  styleUrls: ['./select-game-mode.component.scss']
})
export class SelectGameModeComponent implements OnInit {

    gameModes$: Observable<any[]>;

    constructor(private api: ApiService)
    {

    }

    ngOnInit(): void
    {
        this.gameModes$ = this.api.GetGameModes().pipe(map(data => data?.DATA));
    }

}
