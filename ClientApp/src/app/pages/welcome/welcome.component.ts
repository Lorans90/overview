import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { customers } from 'src/data/customers';
import { customersGridConfig } from 'src/app/shared/config/customers.config';
import { Language, SettingsService } from 'src/app/shared/services/settings.service';
import { wording } from 'src/app/core/wording';
import { NvGridI18nService } from 'nv-grid/src/public_api';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { LogType } from 'src/app/shared/models/log.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent implements OnInit, OnDestroy {

  customers = customers;
  config = customersGridConfig();

  isCollapsed = false;
  Language = Language;
  wording = wording;
  time = new BehaviorSubject<Date>(new Date());
  timer: any;
  LogType = LogType;

  constructor(
    public settingsService: SettingsService,
    private gridI18nService: NvGridI18nService,
    private authService: AuthService
  ) {
    this.settingsService.language.subscribe((language: Language) => this.updateNvGridConfig(language));
  }


  private updateNvGridConfig(language: Language) {
    this.gridI18nService.setConfiguration({
      gridLanguage: language,
      gridLocale: 'de-DE'
    });
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.time.next(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  logout() {
    this.authService.clear();
  }
}
