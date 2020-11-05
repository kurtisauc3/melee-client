import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, share, first, scan, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElectronService } from './electron.service';
import { CacheService } from './cache.service';
import { ApiResponse } from '../_models/responses';

@Injectable()
export class ApiService
{
    public API_CACHE_KEY: string = "api";
    public API_ENDPOINT: string = "http://localhost:3000";

    public dataCache$: { [key: string]: Observable<any> } = {};

    constructor(private http: HttpClient, private electron: ElectronService, private cache: CacheService)
    {

    }

    public initializeApiService()
    {
    }

    public get authenticationHeaders(): HttpHeaders
    {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.electron.bearerToken}`
        });
    }

    private get(controller): Observable<ApiResponse>
    {
        if (this.dataCache$[controller]) return this.dataCache$[controller];
        else
        {
            this.dataCache$[controller] = this.http.get<ApiResponse>(`${this.API_ENDPOINT}${controller}`, { headers: this.authenticationHeaders })
                .pipe(filter(data => data?.SUCCESS), map(data =>
                {
                    this.dataCache$[controller] = null;
                    return data;
                }), share());
            return this.dataCache$[controller];
        }
    }

    private post(controller, req): Observable<ApiResponse>
    {
        if (this.dataCache$[controller]) return this.dataCache$[controller];
        else
        {
            this.dataCache$[controller] = this.http.post<ApiResponse>(`${this.API_ENDPOINT}${controller}`, req, { headers: this.authenticationHeaders })
                .pipe(filter(data => data?.SUCCESS), map(data =>
                    {
                        this.dataCache$[controller] = null;
                        return data;
                    }), share());
            return this.dataCache$[controller];
        }
    }

    public GetProfile(): Observable<ApiResponse>
    {
        return this.get(`/api/user/${this.electron.user_id}`);
    }

    public GetGames(): Observable<ApiResponse>
    {
        return this.get('/api/game');
    }

    public GetLobby(lobbyId: string): Observable<ApiResponse>
    {
        return this.get(`/api/lobby/${lobbyId}`);
    }

    public CreateLobby(request): Observable<ApiResponse>
    {
        return this.post(`/api/lobby`, request);
    }

    public JoinLobby(request): Observable<ApiResponse>
    {
        return this.post(`/api/lobby/${request.id}`, request);
    }

    public LeaveLobby(): Observable<ApiResponse>
    {
        return this.post('/api/lobby/leave', {});
    }
}
