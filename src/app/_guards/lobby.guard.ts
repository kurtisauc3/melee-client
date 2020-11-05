import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LobbyGuard implements CanActivate
{
    constructor(private api: ApiService, private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    {
        return this.api.GetLobby(route.params.id)
            .pipe(map(data =>
            {
                const result = data?.SUCCESS;
                if (!result) this.router.navigate(['select-game-mode']);
                return result;
            }))
    }
}
