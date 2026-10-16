import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastContainer } from './toast';

describe('ToastContainer', () => {
  let component: ToastContainer;
  let fixture: ComponentFixture<ToastContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
