import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RseComponent } from './rse.component';

describe('RseComponent', () => {
  let component: RseComponent;
  let fixture: ComponentFixture<RseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
