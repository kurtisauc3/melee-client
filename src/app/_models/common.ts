export class GamecubeController
{
    port: number;
    connected: boolean;
    buttons: GamecubeContrllerButtons;
    axes: GamecubeContrllerAxes;
    rumble: boolean;
}

export class GamecubeContrllerButtons
{
    buttonA: boolean;
    buttonB: boolean;
    buttonX: boolean;
    buttonY: boolean;
    padUp: boolean;
    padDown: boolean;
    padLeft: boolean;
    padRight: boolean;
    buttonStart: boolean;
    buttonZ: boolean;
    buttonL: boolean;
    buttonR: boolean;
}

export class GamecubeContrllerAxes
{
    mainStickHorizontal: number;
    mainStickVertical: number;
    cStickHorizontal: number;
    cStickVertical: number;
    triggerL:number;
    triggerR: number;
}

