import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonToolsComponent } from './common-tools.component';

describe('CommonToolsComponent', () => {
  let component: CommonToolsComponent;
  let fixture: ComponentFixture<CommonToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
