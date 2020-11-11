import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { SelectGameComponent } from './select-game/select-game.component';
import { LobbyComponent } from './lobby/lobby.component';
import { TeamManagerComponent } from './team-manager/team-manager.component';
import { MatchHistoryComponent } from './match-history/match-history.component';
import { MatchAcceptedComponent } from './match-accepted/match-accepted.component';
import { MatchInProgressComponent } from './match-in-progress/match-in-progress.component';
import { MatchCompleteComponent } from './match-complete/match-complete.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApiService } from './_services/api.service';
import { CacheService } from './_services/cache.service';
import { ElectronService } from './_services/electron.service';
import { ProfileComponent } from './profile/profile.component';
import { SocketService } from './_services/socket.service';
import { OnFocusDirective } from './_directives/focus.directive';
import { AutofocusFixModule } from 'ngx-autofocus-fix';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader
{
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        SelectGameComponent,
        LobbyComponent,
        TeamManagerComponent,
        MatchHistoryComponent,
        MatchAcceptedComponent,
        MatchInProgressComponent,
        MatchCompleteComponent,
        DashboardComponent,
        ProfileComponent,
        OnFocusDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        AutofocusFixModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        CacheService,
        ElectronService,
        ApiService,
        SocketService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
