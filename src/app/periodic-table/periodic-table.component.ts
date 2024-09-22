import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PeriodicElement } from '../periodic-elements';
import { ELEMENT_DATA } from '../element-data';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, Observable } from 'rxjs';
import { EditElementDialogComponent } from '../edit-element-dialog/edit-element-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ElementStateService } from '../element-state.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'app-periodic-table',
	standalone: true,
	imports: [RouterOutlet, CommonModule, MatInputModule, MatTableModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSortModule, MatProgressSpinnerModule, MatIconModule],
	templateUrl: './periodic-table.component.html',
	styleUrl: './periodic-table.component.scss',
})
export class PeriodicTableComponent {
	displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
	dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	isLoading$: Observable<boolean>;
	filterControl = new FormControl('');

	constructor(
		private dialog: MatDialog, 
		private elementState: ElementStateService) {

		this.elementState.hold(
			this.elementState.select('elements'),
			(elements) => {
				this.dataSource.data = elements;
			}
		)

		this.isLoading$ = this.elementState.select('isLoading');

		this.elementState.hold(this.filterControl.valueChanges.pipe(debounceTime(2000)), (filterValue) => {
			this.applyFilter(filterValue || '');
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	openEditDialog(element: PeriodicElement, field: string) {
		const dialogRef = this.dialog.open(EditElementDialogComponent, {
			width: '350px',
			data: {element, field}
		});

		this.elementState.hold(
			dialogRef.afterClosed(),
			(result) => {
			  if (result) {
				this.elementState.updateElement(result);
			  }
			}
		  );
	};
}
