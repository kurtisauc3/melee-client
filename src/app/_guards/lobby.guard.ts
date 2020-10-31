import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class LobbyGuard implements CanActivate
{
    constructor(private api: ApiService, private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    {
        return this.api.CreateLobby(route.params.id)
    }
}
