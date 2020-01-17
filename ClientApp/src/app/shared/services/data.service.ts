import { Injectable, Inject } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { APP_CONFIG, IAppConfig } from 'src/app/core';
import { NotificationLogsService } from './notification-logs.service';
import { LogType } from '../models/log.model';
import { LoremIpsum } from 'lorem-ipsum';
export interface Data {
    machine1: number;
    machine2: number;
    machine3: number;
    machine4: number;
}

export const emptyData = {
    machine1: 0,
    machine2: 0,
    machine3: 0,
    machine4: 0
};

export const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});
@Injectable({
    providedIn: 'root'
})
export class DataService {
    hubConnection: signalR.HubConnection;
    dataSubject = new BehaviorSubject<Data>(emptyData);
    data$ = this.dataSubject.asObservable();

    constructor(
        private notificationLogsService: NotificationLogsService,
        @Inject(APP_CONFIG) private appConfig: IAppConfig) {

        // this.startConnection();
        this.addTransferChartDataListener();
        this.publishNewLogs();
    }
    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`/realtime`)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err));
    }

    public addTransferChartDataListener = () => {
        setInterval(() => {
            const data = {
                machine1: this.random(20, 100),
                machine2: this.random(75, 85),
                machine3: this.random(20, 42),
                machine4: this.random(90, 100)
            };

            this.dataSubject.next(data);
        }, 1000);

        // this.hubConnection.on('BroadcastMessage', (data: Data) => {
        //     this.dataSubject.next(data);
        // });
    }

    public stopConnection = () => {
        // this.hubConnection
        //     .stop()
        //     .then(() => console.log('Connection ended'))
        //     .catch(err => console.log('Error while stopping connection: ' + err));
    }


    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + 0);
    }

    publishNewLogs() {
        setInterval(() => {
            this.notificationLogsService.addLog({
                message: {
                    en: lorem.generateSentences(1), de: lorem.generateSentences(1)
                },
                subject: 'Erfolgreich',
                type: this.random(0, 2)
            });
        }, 5000);
    }
}
