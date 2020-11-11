import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, share, first, scan, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElectronService } from './electron.service';
import { CacheService } from './cache.service';
import { ApiResponse, Game, Lobby, User, DeleteResult } from '../_models/responses';
import { CreateLobbyRequest, JoinLobbyRequest } from '../_models/requests';

@Injectable()
export class ApiService
{
    public API_ENDPOINT: string = "http://localhost:3000";

    public DATA_CACHE_KEY: string = "api";
    public data_cache: { [key: string]: any } = {};
    public data_cache$: { [key: string]: Observable<any> } = {};

    constructor(
        private http: HttpClient,
        private electron: ElectronService,
        private cache: CacheService
    ) {}

    public get authentication_headers(): HttpHeaders
    {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.electron.bearer_token}`
        });
    }

    private get(controller): Observable<any>
    {
        if (this.data_cache[controller]) return of(this.data_cache[controller]);
        else if (this.data_cache$[controller]) return this.data_cache$[controller];
        else
        {
            this.data_cache$[controller] = this.http.get<ApiResponse>(`${this.API_ENDPOINT}${controller}`, { headers: this.authentication_headers })
                .pipe(filter(data => data?.SUCCESS), map(data =>
                {
                    const mapped_data = data?.DATA;
                    this.data_cache$[controller] = null;
                    this.data_cache[controller] = mapped_data;
                    this.cache.set(mapped_data, controller);
                    return mapped_data;
                }), share());
            return this.data_cache$[controller];
        }
    }

    private post(controller, req): Observable<any>
    {
        if (this.data_cache$[controller]) return this.data_cache$[controller];
        else
        {
            this.data_cache$[controller] = this.http.post<ApiResponse>(`${this.API_ENDPOINT}${controller}`, req, { headers: this.authentication_headers })
                .pipe(filter(data => data?.SUCCESS), map(data =>
                    {
                        const mapped_data = data?.DATA;
                        this.data_cache$[controller] = null;
                        return mapped_data;
                    }), share());
            return this.data_cache$[controller];
        }
    }

    public get get_game_all_route(): string
    {
        return '/api/game/all';
    }

    public get_user_route(user_id: string): string
    {
        return `/api/user/${user_id}`;
    }

    public get_lobby_route(lobby_id: string): string
    {
        return `/api/lobby/${lobby_id}`;
    }

    public get_lobby_users_route(lobby_id: string): string
    {
        return `/api/lobby/users/${lobby_id}`;
    }

    public get_user(user_id: string): Observable<User>
    {
        return this.get(this.get_user_route(user_id));
    }

    public clear_get_user(user_id: string)
    {
        this.cache.remove(this.get_user_route(user_id));
        this.data_cache[this.get_user_route(user_id)] = null;
    }

    public get_game_all(): Observable<Game[]>
    {
        return this.get(this.get_game_all_route).pipe(map(data => data?.filter(game => !game.disabled)));
    }

    public clear_get_game_all()
    {
        this.cache.remove(this.get_game_all_route);
        this.data_cache[this.get_game_all_route] = null;
    }

    public get_lobby(lobby_id: string): Observable<Lobby>
    {
        return this.get(this.get_lobby_route(lobby_id));
    }

    public clear_get_lobby(lobby_id: string)
    {
        this.cache.remove(this.get_lobby_route(lobby_id));
        this.data_cache[this.get_lobby_route(lobby_id)] = null;
    }

    public get_lobby_users(lobby_id: string): Observable<User[]>
    {
        return this.get(this.get_lobby_users_route(lobby_id));
    }

    public create_lobby(request: CreateLobbyRequest): Observable<Lobby>
    {
        return this.post(`/api/lobby`, request);
    }

    public join_lobby(request: JoinLobbyRequest): Observable<Lobby>
    {
        return this.post('/api/lobby/join', request);
    }

    public leave_lobby(): Observable<DeleteResult>
    {
        return this.post('/api/lobby/leave', {});
    }
}
