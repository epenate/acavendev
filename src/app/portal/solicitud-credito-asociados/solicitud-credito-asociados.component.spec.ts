import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCreditoAsociadosComponent } from './solicitud-credito-asociados.component';

describe('SolicitudCreditoAsociadosComponent', () => {
  let component: SolicitudCreditoAsociadosComponent;
  let fixture: ComponentFixture<SolicitudCreditoAsociadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudCreditoAsociadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudCreditoAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
