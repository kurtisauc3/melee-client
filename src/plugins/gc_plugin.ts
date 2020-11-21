import 'phaser';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { GamecubeController, GamecubeControllerButton } from '../models/gamecube';

export class GcPlugin extends Phaser.Plugins.BasePlugin
{
	constructor (pluginManager)
    {
        super(pluginManager);
	}

	on_gc(): Observable<GamecubeController>
	{
		return new Observable<GamecubeController>(observer =>
		{
			ipcRenderer.on("gc", (event, data) => observer.next(data));
		});
	}

	on_gc_button(): Observable<GamecubeControllerButton>
	{
		return new Observable<GamecubeControllerButton>(observer =>
		{
			ipcRenderer.on("gc_button", (event, data) => observer.next(data));
		});
	}
}
