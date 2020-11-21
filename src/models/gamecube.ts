export class GamecubeController
{
	port: number;
	connected: boolean;
	buttons: GamecubeControllerButtons;
	axes: GamecubeControllerAxes;
	rumble: boolean;
}

export enum GamecubeControllerButton
{
	A = 'button_a',
	B = 'button_b',
	X = 'button_x',
	Y = 'button_y',
	UP = 'pad_up',
	DOWN = 'pad_down',
	LEFT = 'pad_left',
	RIGHT = 'pad_right',
	START = 'button_start',
	Z = 'button_z',
	L = 'button_l',
	R = 'button_r'
}

export class GamecubeControllerButtons
{
	button_a: boolean;
	button_b: boolean;
	button_x: boolean;
	button_y: boolean;
	pad_up: boolean;
	pad_down: boolean;
	pad_left: boolean;
	pad_right: boolean;
	button_start: boolean;
	button_z: boolean;
	button_l: boolean;
	button_r: boolean;
}

export class GamecubeControllerAxes
{
	main_stick_horizontal: number;
	main_stick_vertical: number;
	c_stick_horizontal: number;
	c_stick_vertical: number;
	trigger_l: number;
	trigger_r: number;
}
