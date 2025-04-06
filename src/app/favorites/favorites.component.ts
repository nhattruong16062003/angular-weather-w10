import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather.service';
import { AuthService } from '../services/auth.service';
import { Weather } from '../models/weather.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: Weather[] = [];
  isAuthenticated = false;
  private authSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private weatherService: WeatherService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (loggedIn) => this.isAuthenticated = loggedIn
    );

    this.loadFavorites();
  }

  loadFavorites() {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  }

  viewWeather(location: string) {
    this.router.navigate(['/'], { queryParams: { location } });
  }

  removeFavorite(location: string) {
    this.favorites = this.favorites.filter(fav => fav.location !== location);
    localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}