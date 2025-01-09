import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DIRECTION_LEFT } from 'hammerjs';
import { provideSwipeMenu } from './ngx-swipe-menu.config';

export interface SwipeMenuActions {
  name: string;
  /**
   * The label to be showed on the button
   */
  label?: string;
  /**
   * The classes to be used by the <i> tag inside the button, to show an icon
   */
  icon?: string;
  /**
   * The classes provided here will be inserted in the <div> container of the button
   */
  class?: string;
  /**
   * Use this if you need to provide data for this button that is different of the general item data
   */
  data?: any;
  /**
   * An event listener that will be called when the user clicks this button
   * @param event The click event
   * @param data The item data
   */
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
  /**
   * The minimum distance (in pixels) the user must move the content
   * to enable showing the menu itens.
   * @default 50
   */
  @Input() minSwipeDistance = 50;
  /**
   * The data provided here will be sent in the second argument of all the event listeners
   */
  @Input() data: any;
  /**
   * An event emitted when the swipe gesture is finished and the actions menu is openned.
   * The first argument passed to the listener function is the data provided for this item
   * @event
   */
  @Output() menuOpenned = new EventEmitter();
  /**
   * An event emitted when the actions menu is closed.
   * The first argument passed to the listener function is the data provided for this item
   * @event
   */
  @Output() menuClosed = new EventEmitter();


  /**
   * Defines if the menu actions buttons must be showed. If alse, when the user finishes
   * the swipe gesture we emit the defaultAction event
   * @default true
   */
  @Input() showSwipeActions = true;
  /**
   * A list of SwipeMenuActions structure to configure the menu actions that must be showed
   */
  @Input() swipeActions: SwipeMenuActions[] | undefined;
  /**
   * The label to be showed when action buttons are deactivated
   */
  @Input() swipeActionLabel?: string;
  /**
   * The classes to be applied when when action buttons are deactivated
   */
  @Input() swipeActionIcon?: string;
  /**
   * An event emitted when the user clicks the default button of the defined swipe
   * gesture, when showSwipeActions=true, or else when finished the default swipe gesture.
   * The first argument passed to the listener function is the data provided for this item
   * @event
   */
  @Output() defaultAction: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();


  /**
   * Defines if the swipeLeft gesture is enabled
   * @default true
   */
  @Input() enableSwipeLeft = true;
  /**
   * Defines if the menu actions buttons must be showed. If no, when the user finishes
   * the swipeLeft gesture we emit the defaultSwipeLeftAction event
   * @default true
   */
  @Input() showSwipeLeftActions = true;
  /**
   * A list of SwipeMenuActions structure to configure the menu actions that must be showed
   * when the user swipes left
   */
  @Input() swipeLeftActions: SwipeMenuActions[] | undefined;
  /**
   * The label to be showed when action buttons are deactivated for swipe left
   */
  @Input() swipeLeftActionLabel?: string;
  /**
   * The classes to be applied when when action buttons are deactivated for swipe left
   */
  @Input() swipeLeftActionIcon?: string;
  /**
   * An event emitted when the user clicks the default button of the swipeLeft
   * gesture, when showSwipeLeftActions=true, or else when finished the swipeLeft gesture.
   * The first argument passed to the listener function is the data provided for this item
   * @event
   */
  @Output() swipeLeftDefaultAction = new EventEmitter<MouseEvent>();


  /**
   * Defines if the swipeRight gesture is enabled
   * @default true
   */
  @Input() enableSwipeRight = false;
  /**
   * Defines if the menu actions buttons must be showed. If no, when the user finishes
   * the swipeRight gesture we emit the defaultSwipeRightAction event
   * @default true
   */
  @Input() showSwipeRightActions = false;
  /**
   * A list of SwipeMenuActions structure to configure the menu actions that must be showed
   * when the user swipes right
   */
  @Input() swipeRightActions: SwipeMenuActions[] | undefined;
  /**
   * The label to be showed when action buttons are deactivated for swipe right
   */
  @Input() swipeRightActionLabel?: string;
  /**
   * The classes to be applied when when action buttons are deactivated for swipe right
   */
  @Input() swipeRightActionIcon?: string;
  /**
   * An event emitted when the user clicks the default button of the swipeRight
   * gesture, when showSwipeLeftActions=true, or else when finished the swipeRight gesture.
   * The first argument passed to the listener function is the data provided for this item
   * @event
   */
  @Output() swipeRightDefaultAction = new EventEmitter<MouseEvent>();


  @ContentChild('actions', { descendants: false }) protected actionsTemplate: TemplateRef<any> | null = null;

  private actionsContainerElement?: HTMLElement;
  private contentElement?: HTMLElement;

  constructor(private el: ElementRef) {
    this.menuClosed.subscribe(() => this.el.nativeElement.querySelector(".ngx-swipe-menu").classList.remove('open'));
    this.menuOpenned.subscribe(() => this.el.nativeElement.querySelector(".ngx-swipe-menu").classList.add('open'));
  }

  onSwipeLeftAction(event: MouseEvent) {
    this.reset();

    this.defaultAction?.emit(this.data);
    this.swipeLeftDefaultAction?.emit(this.data);
  }

  onSwipeStart(_event: any) {
    // resets the position of all menu containers
    document.querySelectorAll<HTMLElement>('.ngx-swipe-menu').forEach(element => {
      this.reset(element);
    });

    this.actionsContainerElement = this.el.nativeElement.querySelector(".ng-swipe-actions-container");
    this.contentElement = this.el.nativeElement.querySelector(".ngx-swipe-menu-content");

    this.contentElement?.classList.add('active');
  }

  onSwipeMove(event: any) {
    const element = this.contentElement ?? event.target;

    if (event.direction == DIRECTION_LEFT && event.deltaX < 0 && event.deltaX < -this.minSwipeDistance) {
      const distance = Math.min(Math.abs(event.deltaX), this.actionsContainerElement?.getBoundingClientRect().width || this.minSwipeDistance + 10);
      element.style.transform = `translateX(-${distance}px)`;
    }
  }

  onSwipeEnd(event: any) {
    event.preventDefault();

    const element = this.contentElement ?? event.target;

    if (-event.deltaX >= this.minSwipeDistance) {
      this.menuOpenned.emit(this.data);

      if (this.showSwipeActions) {
        const distance = this.actionsContainerElement?.getBoundingClientRect().width || this.minSwipeDistance + 10;
        element.style.transform = `translateX(-${distance}px)`;

        // setup a listener to close the menu when clicking somewhere in the page
        const listener = (event: Event) => {
          const doc = element;
          if (doc !== this.el.nativeElement) {
            document.removeEventListener('click', listener);
            this.reset();
            this.menuClosed.emit(this.data);
          }
        };
        setTimeout(() => document.addEventListener('click', listener), 50);
      } else {
        this.reset();
        this.menuClosed.emit(this.data);
        this.defaultAction?.emit(this.data);
        this.swipeLeftDefaultAction.emit(this.data);
      }


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
