
import { Injectable } from '@angular/core';
import { SocketEvent } from 'app/_models/enums';
import { Observable } from 'rxjs';
import * as socket_io from 'socket.io-client';
import { ApiService } from './api.service';
import { ElectronService } from './electron.service';

@Injectable()
export class SocketService
{
    private socket;

    constructor(private api: ApiService, private electron: ElectronService) {}

    public initialize_socket_service()
    {
        this.socket = socket_io(this.api.API_ENDPOINT,
        {
            query: { user_id: this.electron.user_id }
        });
    }

    public on_lobby_updated(): Observable<string>
    {
        return new Observable<string>(observer => this.socket.on(SocketEvent.lobby_updated, async (lobby_id: string) =>
        {
            this.api.clear_get_lobby(lobby_id);
            observer.next(lobby_id);
        }));
    }

    public on_user_updated(): Observable<string>
    {
        return new Observable<string>(observer => this.socket.on(SocketEvent.user_updated, async (user_id: string) =>
        {
            this.api.clear_get_user(user_id);
            observer.next(user_id);
        }));
    }

    public on_event(event: SocketEvent): Observable<any>
    {
        return new Observable<SocketEvent>(observer => this.socket.on(event, () => observer.next()));
    }

}
