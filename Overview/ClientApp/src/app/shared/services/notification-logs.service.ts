import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { Log } from '../ui/notification-logs/notification-logs.component';


export const logs: Log[] = [
  {
    message: {
      en: 'Lorem ipsum',
      de: 'Lorem ipsum'
    },
    subject: 'lorem ipsum',
    // user: {
    //   id: 1,
    //   _type: 'User',
    //   isActive: true,
    //   firstName: 'Felix',
    //   lastName: 'Küppers',
    //   displayName: 'Felix Küppers',
    //   tel: '333444',
    //   language: Language.EN,
    //   email: 'kueppers@avetiq.de',
    //   username: 'Admin',
    //   isSuperAdmin: false,
    //   isAdmin: false,
    // },
    date: new Date(),
    unseen: true,
    id: 0,
  },
  {
    message: {
      en: 'Aenean commodo',
      de: 'Aenean commodo'
    },
    subject: 'Aenean commodo ',
    // user: {
    //   id: 1,
    //   _type: 'User',
    //   isActive: true,
    //   firstName: 'Felix',
    //   lastName: 'Küppers',
    //   displayName: 'Felix Küppers',
    //   tel: '333444',
    //   language: Language.EN,
    //   email: 'kueppers@avetiq.de',
    //   username: 'Admin',
    //   isSuperAdmin: false,
    //   isAdmin: false,
    // },
    date: new Date(),
    unseen: true,
    id: 2,
  },
  {
    message: {
      en: 'consectetuer adipiscing elit.',
      de: 'consectetuer adipiscing elit.'
    },
    subject: 'consectetuer elit.',
    // user: {
    //   id: 1,
    //   _type: 'User',
    //   isActive: true,
    //   firstName: 'Felix',
    //   lastName: 'Küppers',
    //   displayName: 'Felix Küppers',
    //   language: Language.EN,
    //   tel: '333444',
    //   email: 'kueppers@avetiq.de',
    //   username: 'Admin',
    //   isSuperAdmin: false,
    //   isAdmin: false,
    // },
    date: new Date(),
    unseen: true,
    id: 3,
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

  public addLog(logsInfo: any): void {
    const log: Log = {
      message: logsInfo.message,
      subject: logsInfo.subject,
      // user: logsInfo.user ? logsInfo.user : this.authService.getUser(),
      date: new Date(),
      unseen: true,
      id: this.logs.length + 1,
      // _type: 'log'
    };
    this.publishLogs([log, ...this.logs]);
  }

  public markAsSeen = (): void => {
    this.publishLogs(this.logs.map(log => ({ ...log, unseen: false })));
  }
}
