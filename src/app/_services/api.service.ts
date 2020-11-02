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

    public dataCache: { [key: string]: any } = {};
    public dataCache$: { [key: string]: Observable<any> } = {};

    constructor(private http: HttpClient, private electron: ElectronService, private cache: CacheService)
    {

    }

    public initializeApiService()
    {
        this.dataCache = this.cache.get(this.API_CACHE_KEY) ?? {};
    }

    public get authenticationHeaders(): HttpHeaders
    {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.electron.bearerToken}`
        });
    }

    public GetGameModes(): Observable<ApiResponse>
    {
        const controller = '/api/game';
        if (this.dataCache[controller]) return of(this.dataCache[controller]);
        else if (this.dataCache$[controller]) return this.dataCache$[controller];
        else
        {
            this.dataCache$[controller] = this.get(controller);
            return this.dataCache$[controller];
        }
    }

    public CreateLobby(gameModeId: number): Observable<boolean>
    {
        return of(false);
        //return this.http.post<boolean>(`${this.API_ENDPOINT}/createLobby`, gameModeId, { headers: this.authenticationHeaders });
    }

    private get(controller): Observable<ApiResponse>
    {
        return this.http.get<ApiResponse>(`${this.API_ENDPOINT}${controller}`, { headers: this.authenticationHeaders }).pipe(
            filter(data => data?.SUCCESS),
            map(data =>
            {
                this.dataCache$[controller] = null;
                this.dataCache[controller] = data;
                this.cache.set(this.dataCache, this.API_CACHE_KEY);
                return data;
            }))
    }
}
