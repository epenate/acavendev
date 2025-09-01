import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCreditoComponent } from './solicitud-credito.component';

describe('SolicitudCreditoComponent', () => {
  let component: SolicitudCreditoComponent;
  let fixture: ComponentFixture<SolicitudCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudCreditoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
