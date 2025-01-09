# NgxSwipeMenu

A component to create "swipe left to 'action'" experiences.

# Installation & Configuration

```
npm i --save ngx-swipe-menu hammerjs
```

After installation, you need to configure the providers in your `app.config.ts` file:

```js
import { BrowserModule, HammerModule } from "@angular/platform-browser";
import { provideSwipeMenu } from 'ngx-swipe-menu';
import 'hammerjs';

// ....
export const appConfig: ApplicationConfig = {
    providers: [
        // ....
        importProvidersFrom(BrowserModule),
        importProvidersFrom(HammerModule),
        provideSwipeMenu(),
        // ...
    ]
};
```

# Usage

On your controller, import the component:

```js
// ...
import { NgxSwipeMenuComponent } from 'ngx-swipe-menu';

// ...
@Component({
    imports: [
        // ...
        NgxSwipeMenuComponent,
    ],
    // ...
})
// ...
```

On your template, use the component "around" the content you want to be "moved" when the user swipes left:

## Swipe Left with custom action buttons

```html
<!-- ... -->
<ul>
  <!-- by default, swipeLeft is the only activated -->
  <ngx-swipe-menu>
    <li><!-- ... --></li>
    <!-- if you want to customize the action buttons: -->
    <ng-template #swipeLeftActions>
      <button>Edit</button>
      <button>Remove</button>
    </ng-template>
  </ngx-swipe-menu>
</ul>
<!-- ... -->
```
## Swipe Left without buttons and a default action (with "Archive" label) when user swipes left

In this example, we won't have action buttons. It can be useful for default actions, like "swipe left to archive" in gmail. 
We also pass a `data` variable, with the data that will be sent to our listener function when the user swipes.

This can be usefull to identify the item in a list of "swappable" items.

```html
<!-- ... -->
<ul>
  <ngx-swipe-menu [showSwipeLeftActions]="false" swipeLeftActionLabel="Archive" (swipeLeftDefaultAction)="onSwipeLeft($event)" [data]="itemData">
    <li><!-- ... --></li>
  </ngx-swipe-menu>
</ul>
<!-- ... -->
```

## Disable swipe Left and enable swipe right, with custom buttons

```html
<!-- ... -->
<ul>
  <ngx-swipe-menu [enableSwipeLeft]="false" [enableSwipeRight]="true">
    <li><!-- ... --></li>
    <ng-template #swipeRightActions>
      <button>Edit</button>
      <button>Remove</button>
    </ng-template>
  </ngx-swipe-menu>
</ul>
<!-- ... -->
```

## Swipe left to "Archive" and Swipe right to "Delete", with FontAwesome icons instead of labels

```html
<!-- ... -->
<ul>
  <ngx-swipe-menu [enableSwipeLeft]="true" [enableSwipeRight]="true" [data]="itemData"
    swipeLeftActionIcon="fa-solid fa-box-archive" swipeRithgActionIcon="fa-solid fa-trash"
    (swipeLeftDefaultAction)="archiveItem($event)"
    (swipeRightDefaultAction)="deleteItem($event)"
  >
    <li><!-- ... --></li>
  </ngx-swipe-menu>
</ul>
<!-- ... -->
```


# Component inputs and outputs/events

## General
- **minSwipeDistance** (default=50):
> The minimum distance (in pixels) the user must move the content to enable showing the menu itens.
   
- **data**:
> The data provided here will be sent in the second argument of all the event listeners

- **menuOpenned** (event):
> An event emitted when the swipe gesture is finished and the actions menu is openned. 
> The first argument passed to the listener function is the data provided for this item

- **menuClosed** (event):
> An event emitted when the actions menu is closed.
> The first argument passed to the listener function is the data provided for this item


## Swipe Left Options

- **enableSwipeLeft** (default=true):
> Defines if the swipeLeft gesture is enabled
   
- **showSwipeLeftActions** (default=true):
> Defines if the menu actions buttons must be showed. If no, when the user finishes
> the swipeLeft gesture we emit the defaultSwipeLeftAction event
   
- **swipeLeftActions** SwipeMenuActions[]:
> A list of SwipeMenuActions structure to configure the menu actions that must be showed
> when the user swipes left
   
- **swipeLeftActionLabel** :
> The label to be showed when action buttons are deactivated for swipe left

- **swipeLeftActionIcon** :
> The classes to be applied when when action buttons are deactivated for swipe left

- **swipeLeftDefaultAction** (event):
> An event emitted when the user clicks the default button of the swipeLeft
> gesture, when showSwipeLeftActions=true, or else when finished the swipeLeft gesture.
> The first argument passed to the listener function is the data provided for this item


## Swipe Right Options
   
- **enableSwipeRight** (default=false):
> Defines if the swipeRight gesture is enabled
   
- **showSwipeRightActions** (default=true):
> Defines if the menu actions buttons must be showed. If no, when the user finishes
> the swipeRight gesture we emit the defaultSwipeRightAction event

- **swipeRightActions** SwipeMenuActions[]:
> A list of SwipeMenuActions structure to configure the menu actions that must be showed
> when the user swipes right
   
- **swipeRightActionLabel** :
> The label to be showed when action buttons are deactivated for swipe right

- **swipeRightActionIcon** :
> The classes to be applied when when action buttons are deactivated for swipe right

- **swipeRightDefaultAction** (event):
> An event emitted when the user clicks the default button of the swipeRight
> gesture, when showSwipeLeftActions=true, or else when finished the swipeRight gesture.
> The first argument passed to the listener function is the data provided for this item
   