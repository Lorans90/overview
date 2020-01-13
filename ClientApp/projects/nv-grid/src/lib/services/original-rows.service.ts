import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class OriginalRowsService {
    public originalRows: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
}
