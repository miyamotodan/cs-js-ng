import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsformComponent } from './csform.component';

describe('CsformComponent', () => {
  let component: CsformComponent;
  let fixture: ComponentFixture<CsformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
