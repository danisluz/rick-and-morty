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

  it('should render title and message in template', () => {
    component.title = 'Delete';
    component.message = 'Are you sure?';
    component.confirmText = 'Yes';
    component.cancelText = 'No';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.modal-title')?.textContent).toContain('Delete');
    expect(compiled.querySelector('.modal-body')?.textContent).toContain('Are you sure?');
    expect(compiled.querySelectorAll('.btn')[0]?.textContent).toContain('No');
    expect(compiled.querySelectorAll('.btn')[1]?.textContent).toContain('Yes');
  });

  it('should call cancelAction on cancel button click', () => {
    spyOn(component, 'cancelAction');

    const compiled = fixture.nativeElement as HTMLElement;
    const cancelBtn = compiled.querySelectorAll('.btn')[0] as HTMLElement;
    cancelBtn.click();

    expect(component.cancelAction).toHaveBeenCalled();
  });

  it('should call confirmAction on confirm button click', () => {
    spyOn(component, 'confirmAction');

    const compiled = fixture.nativeElement as HTMLElement;
    const confirmBtn = compiled.querySelectorAll('.btn')[1] as HTMLElement;
    confirmBtn.click();

    expect(component.confirmAction).toHaveBeenCalled();
  });
});
