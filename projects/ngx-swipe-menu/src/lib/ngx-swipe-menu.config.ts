import { Injectable } from "@angular/core";
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from "@angular/platform-browser";
import { DIRECTION_HORIZONTAL } from 'hammerjs';

@Injectable()
export class SwipeMenuConfig extends HammerGestureConfig {
  override overrides = {
    'pinch': { enable: false },
    'rotate': { enable: false },
    'swipe': { enable: false },
    'pan': {
        direction: DIRECTION_HORIZONTAL
    }
   } as any;
}

export function provideSwipeMenu() {
    return {
        provide: HAMMER_GESTURE_CONFIG,
        useClass: SwipeMenuConfig
    }
}
