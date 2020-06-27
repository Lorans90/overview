import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { wording } from 'src/app/core/wording';
import { LogType } from 'src/app/shared/models/log.model';
import { AuthService } from 'src/app/shared/services/auth.service';
// import { customersGridConfig } from 'src/app/shared/config/customers.config';
import { Language, SettingsService } from 'src/app/shared/services/settings.service';
import { customers } from 'src/data/customers';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent implements OnInit, OnDestroy {

  customers = customers;

  isCollapsed = false;
  Language = Language;
  wording = wording;
  time = new BehaviorSubject<Date>(new Date());
  timer: any;
  LogType = LogType;

  constructor(
    public settingsService: SettingsService,
    private authService: AuthService
  ) { }

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
