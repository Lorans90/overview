import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ChangePassword } from '../models/change-password.model';
import { APP_CONFIG, IAppConfig } from '../../core';
import { Device } from '../models/device.model';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    constructor(
        private http: HttpClient,
        @Inject(APP_CONFIG) private appConfig: IAppConfig
    ) { }

    addDevice(device: Device): Observable<Device> {
        return this.http.post<Device>(`${this.appConfig.apiEndpoint}/devices}`, device);
    }

    updateDevice(device: Device): Observable<Device> {
        return this.http.put<Device>(`${this.appConfig.apiEndpoint}/devices/${device.id}`, device);
    }

    getDevice(deviceId: number): Observable<Device> {
        return this.http.get<Device>(`${this.appConfig.apiEndpoint}/devices/${deviceId}`);
    }

    deleteDevice(deviceId: number): Observable<Device> {
        return this.http.delete<Device>(`${this.appConfig.apiEndpoint}/devices/${deviceId}`);
    }
}
