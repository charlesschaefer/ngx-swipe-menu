import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DIRECTION_LEFT } from 'hammerjs';
import { provideSwipeMenu } from './ngx-swipe-menu.config';

export interface SwipeMenuActions {
  name: string;
  label?: string;
  icon?: string;
  class?: string;
  data?: any;
  onClick: (event: Event, data: any) => void;

}

@Component({
  selector: 'ngx-swipe-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngx-swipe-menu.component.html',
  styleUrl: './ngx-swipe-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideSwipeMenu()
  ]
})
export class NgxSwipeMenuComponent {
  @Input() actions: SwipeMenuActions[] | undefined;
  @Input() minSwipeDistance = 50;

  @Output() actionDone: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Output() menuOpenned = new EventEmitter();
  @Output() menuClosed = new EventEmitter();

  @ContentChild('actions', { descendants: false }) actionsTemplate: TemplateRef<any> | null = null;

  actionsContainerElement?: HTMLElement;
  contentElement?: HTMLElement;

  constructor(private el: ElementRef) {
    this.menuClosed.subscribe(() => this.el.nativeElement.querySelector(".ngx-swipe-menu").classList.remove('open'));
    this.menuOpenned.subscribe(() => this.el.nativeElement.querySelector(".ngx-swipe-menu").classList.add('open'));
  }

  buttonAction(event: MouseEvent) {
    this.reset();
    this.actionDone?.emit(event);
    this.menuOpenned.emit(this.el.nativeElement);
  }


  onPanStart(_event: any) {
    // resets the position of all menu containers
    document.querySelectorAll<HTMLElement>('.ngx-swipe-menu').forEach(element => {
      this.reset(element);
    });

    this.actionsContainerElement = this.el.nativeElement.querySelector(".ng-swipe-actions-container");
    this.contentElement = this.el.nativeElement.querySelector(".ngx-swipe-menu-content");

    void (this.actionsContainerElement ? this.actionsContainerElement.style.visibility = 'visible' : null);

    this.contentElement?.classList.add('active');
  }

  onPanMove(event: any) {
    const element = this.contentElement ?? event.target;
    if (event.direction == DIRECTION_LEFT && event.deltaX < 0 && event.deltaX < -this.minSwipeDistance) {
      const distance = Math.min(Math.abs(event.deltaX), this.actionsContainerElement?.getBoundingClientRect().width || this.minSwipeDistance + 10);
      element.style.transform = `translateX(-${distance}px)`;
    }
  }

  onPanEnd(event: any) {
    event.preventDefault();

    const element = this.contentElement ?? event.target;

    const actionContainer = this.actionsContainerElement ?? this.el.nativeElement.querySelector(".ng-swipe-actions-container");

    if (-event.deltaX >= this.minSwipeDistance) {
      const distance = this.actionsContainerElement?.getBoundingClientRect().width || this.minSwipeDistance + 10;
      element.style.transform = `translateX(-${distance}px)`;
      actionContainer.style.visibility = 'visible';

      // setup a listener to close the menu when clicking somewhere in the page
      const listener = (event: Event) => {
        const doc = element;
        if (doc !== this.el.nativeElement) {
          document.removeEventListener('click', listener);
          this.reset();
          this.menuClosed.emit(this.el.nativeElement);
        }
      };
      setTimeout(() => document.addEventListener('click', listener), 50);

      this.menuOpenned.emit(this.el.nativeElement);
    }
  }

  reset(element?: HTMLElement) {
    element = element ?? this.el.nativeElement as HTMLElement;

    if (!element) {
      return;
    }
    const content = element.querySelector<HTMLElement>('.ngx-swipe-menu-content');
    void (content ? content.style.transform = '' : null);

    this.contentElement?.classList.remove('active');

  }
}
