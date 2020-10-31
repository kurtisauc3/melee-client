import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from './_services/electron.service';
import { ApiService } from './_services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent
{

    constructor(private electron: ElectronService,  private translate: TranslateService, private api: ApiService)
    {
        this.translate.setDefaultLang('en');
        this.api.initializeApiService();
    }


}
