import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoCuotaComponent } from './calculo-cuota.component';

describe('CalculoCuotaComponent', () => {
  let component: CalculoCuotaComponent;
  let fixture: ComponentFixture<CalculoCuotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculoCuotaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalculoCuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
