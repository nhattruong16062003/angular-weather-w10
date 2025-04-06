import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private selectedLocationSubject = new BehaviorSubject<string>('Hanoi');
    selectedLocation$ = this.selectedLocationSubject.asObservable();

    private searchQuerySubject = new BehaviorSubject<string>('');
    searchQuery$ = this.searchQuerySubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
    );

    setLocation(location: string) {
        this.selectedLocationSubject.next(location);
    }

    setSearchQuery(query: string) {
        this.searchQuerySubject.next(query);
    }
    private locationSubject = new BehaviorSubject<string>('');
}