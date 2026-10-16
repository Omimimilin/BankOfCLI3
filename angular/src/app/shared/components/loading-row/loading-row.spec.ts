import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingRow } from './loading-row';

describe('LoadingRow', () => {
  let component: LoadingRow;
  let fixture: ComponentFixture<LoadingRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingRow],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
