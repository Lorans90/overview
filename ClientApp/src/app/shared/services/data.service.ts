import { Injectable, Inject } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { APP_CONFIG, IAppConfig } from 'src/app/core';

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

@Injectable({
    providedIn: 'root'
})
export class DataService {
    hubConnection: signalR.HubConnection;
    dataSubject = new BehaviorSubject<Data>(emptyData);
    data$ = this.dataSubject.asObservable();

    constructor(
        @Inject(APP_CONFIG) private appConfig: IAppConfig) {

        this.startConnection();
        this.addTransferChartDataListener();
    }
    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`http://localhost:5000/realtime`)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err));
    }

    public addTransferChartDataListener = () => {
        this.hubConnection.on('BroadcastMessage', (data: Data) => {
            this.dataSubject.next(data);
        });
    }

    public stopConnection = () => {
        this.hubConnection
            .stop()
            .then(() => console.log('Connection ended'))
            .catch(err => console.log('Error while stopping connection: ' + err));
    }
}
