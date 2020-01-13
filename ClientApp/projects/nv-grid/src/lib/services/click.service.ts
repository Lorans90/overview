import { Injectable } from '@angular/core';
import {
  buffer,
  debounceTime,
  exhaustMap,
  last,
  map,
  startWith,
  take
} from 'rxjs/operators';
import { Observable, race, Subject } from 'rxjs';
import { NvRowSelection } from '../models/grid-config';


@Injectable({
  providedIn: 'root'
})
export class ClickService {

  public clickSubscribtion = (click: Subject<NvRowSelection>): Observable<NvRowSelection[]> => {
    return click.pipe(
      buffer(this.trigger(click)),
      map(list => list)
    );
  }

  private trigger = (click: Subject<NvRowSelection>) => race(click
    .pipe(
      exhaustMap(() => click
        .pipe(
          take(2),
          last(),
          startWith(0),
          debounceTime(200),
          take(1)
        )
      )
    )
  )
}
