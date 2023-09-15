import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonProvidersComponent } from './button-providers.component';

describe('ButtonProvidersComponent', () => {
  let component: ButtonProvidersComponent;
  let fixture: ComponentFixture<ButtonProvidersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonProvidersComponent]
    });
    fixture = TestBed.createComponent(ButtonProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
