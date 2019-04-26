import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CscompComponent } from './cscomp.component';

describe('CscompComponent', () => {
  let component: CscompComponent;
  let fixture: ComponentFixture<CscompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CscompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CscompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
