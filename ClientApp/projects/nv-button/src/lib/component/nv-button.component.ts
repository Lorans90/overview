import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export interface NvAction {
  action$: () => Observable<any>;
  subscribe: (res: any) => any;
}

@Component({
  selector: 'nv-button',
  templateUrl: './nv-button.component.html',
  styleUrls: ['./nv-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * This button triggers async code by calling and subscribing
 * to the passed in action(). This enables the button to keep
 * track of the state of the observable and show a loading spinner
 * while running.
 *
 * For that action() needs to return an observable.
 * The action-function, should not subscribe to that Observable,
 * but rather use .pipe(tap()) to react on next() complete() or error().
 */
export class NvButtonComponent {
  @Input() type = 'default';
  @Input() label = 'button';
  @Input() iconClass: string;
  @Input() size = 'small';
  @Input() shape: string;
  @Input() disabled = false;
  @Input() placement: string;
  @Input() title = '';
  @Input() iconType: string;
  @Input() ghost = false;
  @Input() block = false;
  @Input() action: NvAction | (() => any);

  private spinning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();


  click(): void {
    if (this.isNvAction(this.action)) {
      this.spinning.next(true);
      this.action
        .action$()
        .pipe(finalize(() => this.spinning.next(false)))
        .subscribe((response: any) =>
          (<NvAction>this.action).subscribe(response));
    } else {
      return this.action();
    }
  }

  private isNvAction(action: NvAction | (() => any)): action is NvAction {
    return (<NvAction>action).action$ !== undefined;
  }
}
