import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Log, LogType } from '../models/log.model';
import { Wording } from '../models/wording.model';


export const logs: Log[] = [
  {
    message: {
      en: 'Lorem ipsum',
      de: 'Lorem ipsum'
    },
    subject: 'lorem ipsum',
    date: new Date(),
    unseen: true,
    id: 0,
    type: LogType.error
  },
  {
    message: {
      en: 'Aenean commodo',
      de: 'Aenean commodo'
    },
    subject: 'Aenean commodo ',
    date: new Date(),
    unseen: true,
    id: 2,
    type: LogType.warning
  },
  {
    message: {
      en: 'consectetuer adipiscing elit.',
      de: 'consectetuer adipiscing elit.'
    },
    subject: 'consectetuer elit.',
    date: new Date(),
    unseen: true,
    id: 3,
    type: LogType.notification

  }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationLogsService {
  public logsSubject = new BehaviorSubject<Log[]>(logs);
  public logs$: Observable<Log[]> = this.logsSubject.asObservable();

  constructor(
  ) { }

  private get logs() {
    return this.logsSubject.value;
  }

  private publishLogs = (newLogs: Log[]): void => {
    this.logsSubject.next(newLogs);
  }

  public addLog(logsInfo: { message: Wording, subject: string, type: LogType }): void {
    const log: Log = {
      message: logsInfo.message,
      subject: logsInfo.subject,
      date: new Date(),
      unseen: true,
      id: this.logs.length + 1,
      type: logsInfo.type
    };
    this.publishLogs([log, ...this.logs]);
  }

  public markAsSeen = (type: LogType): void => {
    this.publishLogs(
      this.logs.map(log => log.type === type ? ({ ...log, unseen: false }) : log)
    );
  }
}
