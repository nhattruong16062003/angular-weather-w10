import { Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { FavoritesComponent } from './favorites/favorites.component'; // Import component favorites

export const routes: Routes = [
    { path: '', component: WeatherComponent },
    { path: 'favorites', component: FavoritesComponent }, // Thêm route mới
];