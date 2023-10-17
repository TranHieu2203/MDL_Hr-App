import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightchatComponent } from './rightchat.component';

describe('RightchatComponent', () => {
  let component: RightchatComponent;
  let fixture: ComponentFixture<RightchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
