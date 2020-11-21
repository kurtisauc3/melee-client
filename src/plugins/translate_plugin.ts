import 'phaser';
import en_dictionary from '../assets/en-dictionary.json';

export class TranslatePlugin extends Phaser.Plugins.BasePlugin
{

	constructor (pluginManager)
    {
		super(pluginManager);
	}

	translate(key: string, wildcards: string[] = []): string
	{
		let value = en_dictionary[key];
		if (typeof value === 'string' && value?.length)
		{
			for (let i = 0; i <= wildcards.length; i++)
			{
				const sub_string = `{${i}}`;
				if (value.includes(sub_string))
				{
					value = value.replace(sub_string, wildcards[i]);
				}
			}
			return value;
		}
		return key;
	}

}
