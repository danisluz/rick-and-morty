import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.title).toBe('Confirmar');
    expect(component.message).toBe('Tem certeza que deseja continuar?');
    expect(component.confirmText).toBe('Confirmar');
    expect(component.cancelText).toBe('Cancelar');
  });

  it('should emit confirm event on confirmAction', () => {
    spyOn(component.confirm, 'emit');

    component.confirmAction();

    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit cancel event on cancelAction', () => {
    spyOn(component.cancel, 'emit');

    component.cancelAction();

    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
