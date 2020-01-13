import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { NotificationLogsService } from '../../services/notification-logs.service';
import { wording } from 'src/app/core/wording';
import { Log, LogType } from '../../models/log.model';
import { SettingsService } from '../../services/settings.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notification-logs',
  templateUrl: './notification-logs.component.html',
  styleUrls: ['./notification-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationLogsComponent implements OnInit {
  public logs: Observable<Log[]>;
  public unseenCountSubject = new BehaviorSubject<number>(0);
  public unseenCount$: Observable<number> = this.unseenCountSubject.asObservable();
  public visible: boolean;
  public wording = wording;
  @Input() notificationColor = '#46bdca';
  @Input() icon: 'bell';
  @Input() title = 'Logs';
  @Input() logType: LogType;
  constructor(
    private notificationLogsService: NotificationLogsService,
    public settingsService: SettingsService
  ) { }

  ngOnInit(): void {


    this.logs = this.notificationLogsService.logs$.pipe(
      map(logs => logs.filter(log => log.type === this.logType)),
    );

    this.logs.subscribe((logs => this.unseenCountSubject.next(logs.filter(log => log.unseen).length)));
  }

  public popoverVisibilityChanged(isOpened: boolean): void {
    if (!isOpened) {
      this.notificationLogsService.markAsSeen(this.logType);
    }
  }

  public navigateToTarget(log: Log): void {
    this.visible = false;
  }
}
