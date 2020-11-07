import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MatchHistoryComponent } from './match-history/match-history.component';
import { ProfileComponent } from './profile/profile.component';
import { SelectGameComponent } from './select-game/select-game.component';
import { TeamManagerComponent } from './team-manager/team-manager.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
    },
    {
        path: 'lobby/null',
        redirectTo: 'select-game',
        pathMatch: 'full'
    },
    {
        path: 'lobby/:id',
        component: LobbyComponent,
        pathMatch: 'full'
    },
    {
        path: 'match-history',
        component: MatchHistoryComponent,
        pathMatch: 'full'
    },
    {
        path: 'profile',
        component: ProfileComponent,
        pathMatch: 'full'
    },
    {
        path: 'select-game',
        component: SelectGameComponent,
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
