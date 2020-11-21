
import jwt_decode from "jwt-decode";
import axios, { AxiosRequestConfig } from "axios";
import * as url from "url";
import * as keytar from "keytar";
import * as os from "os";
import env from '../env-variables.json';

export class AuthService
{
	REDIRECT_URI: string;
	KEYTAR_SERVICE: string;
	KEYTAR_ACCOUNT: string;

	access_token: string;
	profile: any;
	refresh_token: string;

	constructor()
	{
		this.REDIRECT_URI = "http://localhost/callback";
		this.KEYTAR_SERVICE = "electron-openid-oauth";
		this.KEYTAR_ACCOUNT = os.userInfo().username;
		this.clear_data();
	}

	get authentication_url()
	{
		return `https://${env.auth0Domain}/authorize?audience=${env.apiIdentifier}&scope=openid profile offline_access email&response_type=code&client_id=${env.clientId}&redirect_uri=${this.REDIRECT_URI}`;
	}

	get logout_url()
	{
		return `https://${env.auth0Domain}/v2/logout`;
	}

	get user_id()
	{
		const sub_array = this.profile?.sub?.split('|');
		if (sub_array[0] === 'auth0')
        {
            return sub_array[1];
        }
        return null;
	}

	clear_data()
	{
		this.access_token = null;
		this.profile = null;
		this.refresh_token = null;
	}

	async refresh_tokens()
	{
		const refresh_token = await keytar.getPassword(this.KEYTAR_SERVICE, this.KEYTAR_ACCOUNT);
		if (refresh_token)
		{
			const refresh_options: AxiosRequestConfig = {
				method: "POST",
				url: `https://${env.auth0Domain}/oauth/token`,
				headers: { "content-type": "application/json" },
				data: {
					grant_type: "refresh_token",
					client_id: env.clientId,
					refresh_token: refresh_token,
				},
			};
			try
			{
				const response = await axios(refresh_options);
				this.access_token = response.data.access_token;
				this.profile = jwt_decode(response.data.id_token);
			}
			catch (error)
			{
				await this.logout();
				throw error;
			}
		}
		else
		{
			throw new Error("No available refresh token.");
		}
	}

	async load_tokens(callback_url)
	{
		const query = url.parse(callback_url, true).query;
		const options: AxiosRequestConfig = {
			method: "POST",
			url: `https://${env.auth0Domain}/oauth/token`,
			headers: {
				"content-type": "application/json",
			},
			data: JSON.stringify({
				grant_type: "authorization_code",
				client_id: env.clientId,
				code: query.code,
				redirect_uri: this.REDIRECT_URI,
			})
		};

		try
		{
			const response = await axios(options);
			this.access_token = response.data.access_token;
			this.profile = jwt_decode(response.data.id_token);
			this.refresh_token = response.data.refresh_token;
			if (this.refresh_token)
			{
				await keytar.setPassword(this.KEYTAR_SERVICE, this.KEYTAR_ACCOUNT, this.refresh_token);
			}
		}
		catch (error)
		{
			await this.logout();
			throw error;
		}
	}

	async logout()
	{
		await keytar.deletePassword(this.KEYTAR_SERVICE, this.KEYTAR_ACCOUNT);
		this.clear_data();
	}

}
