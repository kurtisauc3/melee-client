import 'phaser';
import { ipcRenderer } from 'electron';
import axios, { AxiosRequestConfig } from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer, retryAdapterEnhancer } from 'axios-extensions';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { SocketEvent } from '../models/response';

export class ApiPlugin extends Phaser.Plugins.BasePlugin
{
	private socket;

	API_ENDPOINT = "http://localhost:3000";
	constructor (pluginManager)
    {
		super(pluginManager);
		axios.interceptors.response.use(response => response?.data?.DATA);
		// retry twice, throttle requests by 1000ms, and cache responses
		axios.defaults.adapter = retryAdapterEnhancer(throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter)));
		axios.defaults.baseURL = this.API_ENDPOINT;
		axios.defaults.headers.common['Content-Type'] = 'application/json';
		axios.defaults.headers.common['Authorization'] = `Bearer ${ipcRenderer.sendSync('access_token')}`;
		this.initialize();
	}

	get user_id(): string
	{
		return ipcRenderer.sendSync('user_id');
	}

	initialize()
	{
		this.socket = io(this.API_ENDPOINT,
		{
			query: { user_id: this.user_id }
		});
		// this.on_event(SocketEvent.connect).subscribe(() => console.log('connected'));
        // this.on_event(SocketEvent.disconnect).subscribe(() => console.log('disconnected'));
        // this.on_event(SocketEvent.user_updated).subscribe(() => console.log('user updated'));
        // this.on_event(SocketEvent.lobby_updated).subscribe(() => console.log('lobby updated'));
	}

	public on_event(event: SocketEvent): Observable<any>
    {
        return new Observable<SocketEvent>(observer => this.socket.on(event, () => observer.next()));
    }

}
