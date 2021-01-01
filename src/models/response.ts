import {  http_status_code } from './status';
export enum bc_reason_code
{
	MISSING_IDENTITY_ERROR = 40206,
	SWITCHING_PROFILES = 40207,
	MISSING_PROFILE_ERROR = 40208,
	UNKNOWN_AUTH_ERROR = 40217,
	TOKEN_DOES_NOT_MATCH_USER = 40307
}
export class bc_response
{
	status: http_status_code;
	reason_code?: bc_reason_code;
	status_message?: string;
	data?: any;
}
export class authenticate_response
{
	playerName: string;
}
