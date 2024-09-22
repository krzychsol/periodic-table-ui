import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PeriodicElement } from './periodic-elements';
import { debounceTime, Observable, of } from 'rxjs';
import { ELEMENT_DATA } from './element-data';

@Injectable({
  providedIn: 'root'
})
export class ElementStateService extends RxState<{ elements: PeriodicElement[], isLoading: boolean}> {

	constructor() {
		super();
		this.set({ elements: [], isLoading: true});
		this.connect('elements', this.fetchInitialData());
		this.hold(this.select('elements').pipe(debounceTime(1000)), () => this.set({ isLoading: false }));
	}

	updateElement(updatedElement: PeriodicElement) {
		this.set('elements', (state) => state.elements.map(e => e.position === updatedElement.position ? updatedElement : e));
	}

	private fetchInitialData(): Observable<PeriodicElement[]> {
		const DATA: PeriodicElement[] = ELEMENT_DATA;
		return of(DATA);
	}
}
