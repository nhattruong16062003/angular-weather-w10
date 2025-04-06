import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  isAuthenticated = false;
  private authSubscription: Subscription;

  constructor(public authService: AuthService) {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (loggedIn) => this.isAuthenticated = loggedIn
    );
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}