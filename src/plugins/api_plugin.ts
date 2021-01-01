import 'phaser';
import { bc_response, authenticate_response } from '../models';
import env from '../../env-variables.json';
import { http_status_code } from '../models/status';
const { app_id, app_secret, app_version } = env;

export class ApiPlugin extends Phaser.Plugins.BasePlugin
{
	private wrapper;

	constructor (pluginManager)
    {
		super(pluginManager);
		this.initialize();
	}

	convert_to_promise(func: Function, ...args): Promise<any>
	{
		return new Promise((resolve, reject) =>
		{
			func(...args, (response: bc_response) =>
			{
				if (response.status === http_status_code.OK)
				{
					resolve(response.data);
				}
				else
				{
					reject(response);
				}
			})
		})
	}

	initialize()
	{
		const bc = require("braincloud");
		this.wrapper = new bc.BrainCloudWrapper("_wrapper");
		this.wrapper.initialize(app_id, app_secret, app_version);
	}

	get logged_in(): boolean
	{
		return this.get_stored_profile_id().length > 0;
	}

	authenticate_email_password(email: string, password: string): Promise<authenticate_response>
	{
		const force_create = true;
		return this.convert_to_promise(this.wrapper.authenticateEmailPassword, email, password, force_create)
	}

	update_user_name(username: string): Promise<any>
	{
		return this.convert_to_promise(this.wrapper.playerState.updateUserName, username)
	}

	reconnect() : Promise<authenticate_response>
	{
		return this.convert_to_promise(this.wrapper.reconnect);
	}

	get_stored_profile_id(): string
	{
		return this.wrapper.getStoredProfileId();
	}

	reset_stored_profile_id(): void
	{
		return this.wrapper.resetStoredProfileId();
	}

	get_global_file_list(): Promise<any>
	{
		const folder_path = "";
		const recurse = true;
		return this.convert_to_promise(this.wrapper.globalFile.getGlobalFileList, folder_path, recurse)
	}

	list_friends(): Promise<any>
	{
		const friend_platform = this.wrapper.friend.friendPlatform.All;
		const include_summary_data = true;
		return this.convert_to_promise(this.wrapper.friend.listFriends, friend_platform, include_summary_data);
	}

}
