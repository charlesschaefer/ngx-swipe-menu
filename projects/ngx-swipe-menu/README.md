# NgxSwipeMenu

A component to create "swipe left to 'action'" experiences.

# Installation

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

```html
<!-- ... -->
<ul>
  <ngx-swipe-menu>
    <li><!-- ... --></li>
    <!-- if you want to customize the action buttons: -->
    <ng-template #actions>
      <button>Edit</button>
      <button>Remove</button>
    </ng-template>
  </ngx-swipe-menu>
</ul>
<!-- ... -->
```

