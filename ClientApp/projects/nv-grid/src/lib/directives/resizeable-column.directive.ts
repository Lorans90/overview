import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NvColumnConfig } from '../models/grid-config';

@Directive({
  selector: '[nvResizeableColumn]'
})
export class ResizeableColumnDirective implements OnDestroy {

  @Input() public column: NvColumnConfig;

  element: HTMLElement;
  subscription: Subscription;
  newWidth: number;
  widthUntilMouseUp = 0;

  constructor(
    private currentElement: ElementRef,
    private renderer: Renderer2
  ) {
    this.element = currentElement.nativeElement;
  }

  @HostBinding('class.resizeable')
  get cssClass() {
    return this.column.resizeable ? 'resizeable' : '';
  }

  ngOnDestroy(): void {
    this._destroySubscription();
  }

  setWidth(width: number) {
    if (width <= this.column.minWidth) {
      width = this.column.minWidth;
    } else if (width >= this.column.maxWidth) {
      width = this.column.maxWidth;
    }
    this.widthUntilMouseUp = width;
    this.renderer.setStyle(this.currentElement.nativeElement, 'minWidth', `${width}px`);
    this.renderer.setStyle(this.currentElement.nativeElement, 'maxWidth', `${width}px`);
  }

  onMouseup(): void {
    if (this.subscription && !this.subscription.closed) {
      setTimeout(() => {
        this.element.classList.remove('resizing');
      }, 5);
      this._destroySubscription();
      this.column.width = this.widthUntilMouseUp;
    }
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  ontouchstart(mouseEvent: any): void {
    const isHandle = (<HTMLElement>(mouseEvent.target)).classList.contains('resize-handle');
    if (isHandle) {
      mouseEvent.stopPropagation();
      this.element.classList.add('resizing');
      const initialWidth = this.element.clientWidth;
      const mouseDownScreenX = mouseEvent.touches ? mouseEvent.touches[0].clientX : mouseEvent.clientX;
      this.newWidth = initialWidth;
      this.widthUntilMouseUp = initialWidth;
      const mouseup = mouseEvent.touches ? fromEvent(document, 'touchend') : fromEvent(document, 'mouseup');
      this.subscription = mouseup
        .subscribe(() => {
            this.onMouseup();
          }
        );

      const mouseMoveSub = (mouseEvent.touches ? fromEvent(document, 'touchmove') : fromEvent(document, 'mousemove'))
        .pipe(takeUntil(mouseup))
        .subscribe((e: any) => {
            this.move(e, initialWidth, mouseDownScreenX);
          }
        );

      this.subscription.add(mouseMoveSub);
    }
  }

  move(event, initialWidth: number, mouseDownScreenX: number): void {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const movementX = clientX - mouseDownScreenX;
    this.newWidth = initialWidth + movementX;

    const overMinWidth = !this.column.minWidth || this.newWidth >= this.column.minWidth;
    const underMaxWidth = !this.column.maxWidth || this.newWidth <= this.column.maxWidth;

    if (overMinWidth && underMaxWidth) {
      this.setWidth(this.newWidth);
    }
  }

  private _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
