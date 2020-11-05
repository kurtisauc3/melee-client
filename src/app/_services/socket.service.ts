
import { Injectable } from '@angular/core';
import { SocketEvent } from 'app/_models/enums';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { ApiService } from './api.service';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService
{
    private socket;

    constructor(private api: ApiService, private electron: ElectronService) {}

    public initializeSocketService()
    {
        this.socket = socketIo(this.api.API_ENDPOINT);
    }

    public onUserUpdated(): Observable<string>
    {
        return new Observable<string>(observer =>
        {
            this.socket.on('user_updated', (data: string) => observer.next(data));
        });
    }

    public onEvent(event: SocketEvent): Observable<any>
    {
        return new Observable<SocketEvent>(observer =>
        {
            this.socket.on(event, () => observer.next());
        });
    }

}
