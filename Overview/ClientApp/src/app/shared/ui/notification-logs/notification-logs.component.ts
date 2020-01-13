import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Wording } from '../../models/wording';
import { NotificationLogsService } from '../../services/notification-logs.service';
import { wording } from 'src/app/core/wording';

export interface LogInfo {
  message: Wording;
  subject: string;
}
export interface Log {
  message: Wording;
  date: Date;
  subject: string;
  unseen?: boolean;
  id: number;
}

@Component({
  selector: 'app-notification-logs',
  templateUrl: './notification-logs.component.html',
  styleUrls: ['./notification-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationLogsComponent implements OnInit {
  public logs: Observable<Log[]> = this.notificationLogsService.logs$;
  public unseenCountSubject = new BehaviorSubject<number>(0);
  public unseenCount$: Observable<number> = this.unseenCountSubject.asObservable();
  public visible: boolean;
  public wording = wording;

  constructor(private notificationLogsService: NotificationLogsService) { }

  ngOnInit(): void {
    this.notificationLogsService
      .logs$
      .subscribe(activityLogs => this.unseenCountSubject.next(
        activityLogs.filter(log => log.unseen).length
      ));

  }

  public popoverVisibilityChanged(isOpened: boolean): void {
    if (!isOpened) {
      this.notificationLogsService.markAsSeen();
    }
  }

  public navigateToTarget(log: Log): void {
    this.visible = false;
  }
}
