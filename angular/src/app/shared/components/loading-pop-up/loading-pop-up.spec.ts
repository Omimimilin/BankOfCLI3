import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingPopUp } from './loading-pop-up';

describe('LoadingPopUp', () => {
  let component: LoadingPopUp;
  let fixture: ComponentFixture<LoadingPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingPopUp],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingPopUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
