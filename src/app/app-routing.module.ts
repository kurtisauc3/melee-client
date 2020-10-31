import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MatchAcceptedComponent } from './match-accepted/match-accepted.component';
import { MatchCompleteComponent } from './match-complete/match-complete.component';
import { MatchHistoryComponent } from './match-history/match-history.component';
import { MatchInProgressComponent } from './match-in-progress/match-in-progress.component';
import { SelectGameModeComponent } from './select-game-mode/select-game-mode.component';
import { TeamManagerComponent } from './team-manager/team-manager.component';
import { LobbyGuard } from './_guards/lobby.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
    },
    {
        path: 'lobby/:id',
        canActivate: [LobbyGuard],
        component: LobbyComponent,
        pathMatch: 'full'
    },
    {
        path: 'match-accepted',
        component: MatchAcceptedComponent,
        pathMatch: 'full'
    },
    {
        path: 'match-complete',
        component: MatchCompleteComponent,
        pathMatch: 'full'
    },
    {
        path: 'match-history',
        component: MatchHistoryComponent,
        pathMatch: 'full'
    },
    {
        path: 'match-in-progress',
        component: MatchInProgressComponent,
        pathMatch: 'full'
    },
    {
        path: 'select-game-mode',
        component: SelectGameModeComponent,
        pathMatch: 'full'
    },
    {
        path: 'team-manager',
        component: TeamManagerComponent,
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
