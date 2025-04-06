import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    // Public Observable
    isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    // Current value getter
    get isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    login() {
        this.isAuthenticatedSubject.next(true);
    }

    logout() {
        this.isAuthenticatedSubject.next(false);
    }
}