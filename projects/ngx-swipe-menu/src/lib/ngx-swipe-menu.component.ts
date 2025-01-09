import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DIRECTION_LEFT } from 'hammerjs';

export interface SwipeMenuActions {
  name: string;
  label: string;
  class: string;
  data: any;
  onClick: (event: Event, data: any) => void;

}

@Component({
  selector: 'lib-ngx-swipe-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngx-swipe-menu.component.html',
  styleUrl: './ngx-swipe-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxSwipeMenuComponent {
  @Input() actions: SwipeMenuActions[] | undefined;
  @Input() minSwipeDistance = 50;

  @Output() actionDone: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @ContentChild('actions', { descendants: false }) actionsTemplate: TemplateRef<any> | null = null;

  constructor(private el: ElementRef) { }

  buttonAction(event: MouseEvent) {
    this.reset();
    this.actionDone?.emit(event);
  }

  swipeLeft(event: any) {
    console.log("Swipe Left", event);
  }

  onPanStart(_event: any) {
    document.querySelectorAll<HTMLElement>('.ngx-swipe-menu').forEach(element => {
      this.reset(element);
    });

    this.el.nativeElement.querySelector(".ng-swipe-actions-container").style.visibility = 'visible';
  }

  onPanMove(event: any) {
    console.log("Movendo o elemento: ", event);
    if (event.direction == DIRECTION_LEFT && event.deltaX < 0) {
      event.target.style.left = `${event.deltaX}px`;
    }
  }

  onPanEnd(event: any) {
    event.preventDefault();

    event.target.style.left = '';
    const actionContainer = this.el.nativeElement.querySelector(".ng-swipe-actions-container");
    actionContainer.style.visibility = 'hidden';

    if (-event.deltaX >= this.minSwipeDistance) {
      event.target.style.left = `-${this.minSwipeDistance + 10}px`;
      actionContainer.style.visibility = 'visible';
      const listener = (event: Event) => {
        console.log(event);
        const doc = event.target;
        if (doc !== this.el.nativeElement) {
          document.removeEventListener('click', listener);
          console.log("uai, foi?")
          this.reset();
        }
      };
      setTimeout(() => document.addEventListener('click', listener), 50);
    }

    console.warn("Evento parou: ", event, "Elemento: ", this.el.nativeElement)

  }

  reset(element?: HTMLElement) {
    element = element ?? this.el.nativeElement as HTMLElement;

    if (!element) {
      return;
    }
    const content = element.querySelector<HTMLElement>('.ngx-swipe-menu-content');
    void (content ? content.style.left = '' : null);
    const container = element.querySelector<HTMLElement>(".ng-swipe-actions-container");
    void (container ? container.style.visibility = 'hidden' : null);

  }
}
