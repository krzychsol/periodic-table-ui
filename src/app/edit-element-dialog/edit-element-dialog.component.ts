import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElement } from '../periodic-elements';

@Component({
	selector: 'app-edit-element-dialog',
	templateUrl: './edit-element-dialog.component.html',
	styleUrls: ['./edit-element-dialog.component.scss'],
	standalone: true,
	imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule]
})
export class EditElementDialogComponent {
	fieldControl = new FormControl();

	constructor(
		public dialogRef: MatDialogRef<EditElementDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: {element: PeriodicElement, field: string}
	) {}

	ngOnInit(): void {
		this.initFormControl();
	}

	initFormControl(): void {
		switch (this.data.field) {
			case 'name':
				this.fieldControl = new FormControl(this.data.element.name, [Validators.required]);
				break;
			case 'weight':
				this.fieldControl = new FormControl(this.data.element.weight, [Validators.required, Validators.min(0)]);
				break;
			case 'symbol':
				this.fieldControl = new FormControl(this.data.element.symbol, [Validators.required]);
				break;
			default:
				break;
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		if (this.fieldControl.valid) {
			this.dialogRef.close({
			  ...this.data.element,
			  [this.data.field]: this.fieldControl.value
			});
		}
	}
}
