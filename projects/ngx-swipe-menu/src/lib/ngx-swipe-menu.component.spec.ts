import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSwipeMenuComponent } from './ngx-swipe-menu.component';

describe('NgxSwipeMenuComponent', () => {
  let component: NgxSwipeMenuComponent;
  let fixture: ComponentFixture<NgxSwipeMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSwipeMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSwipeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
