import { Injectable } from '@angular/core';

@Injectable()
export class CacheService
{
    constructor() {}

    public get(key: string)
    {
        return JSON.parse(localStorage.getItem(key));
    }
    public set(item: any, key: string)
    {
        localStorage.setItem(key, JSON.stringify(item))
    }

    public remove(key: string)
    {
        localStorage.removeItem(key);
    }

    public clear()
    {
        localStorage.clear();
    }

}
