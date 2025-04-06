import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather.service';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Weather } from '../models/weather.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  weather$: Observable<Weather> | undefined;
  searchQuery = '';
  favorites: Weather[] = [];
  showFavorites = false;
  private searchQuerySubject = new BehaviorSubject<string>('');

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    // Observable cho thời tiết dựa trên vị trí
    this.weather$ = this.locationService.selectedLocation$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(location => this.weatherService.getCurrentWeather(location))
    );

    // Observable cho tìm kiếm
    this.searchQuerySubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        const location = query.trim();
        if (location) {
          this.locationService.setLocation(location);
          return this.weatherService.getCurrentWeather(location);
        }
        // Nếu không có query, không trả về gì cả vì vị trí mặc định đã được set bên dưới
        return [];
      })
    ).subscribe();

    // Lấy vị trí hiện tại khi khởi tạo
    this.getCurrentLocation();
    this.loadFavorites();
  }

  // Hàm mới để lấy vị trí hiện tại
  private getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Chuyển đổi tọa độ thành tên thành phố nếu cần
          this.locationService.setLocation(`${latitude},${longitude}`);
        },
        (error) => {
          console.error('Lỗi khi lấy vị trí:', error);
          // Nếu không lấy được vị trí, fallback về 'Hanoi'
          this.locationService.setLocation('Hanoi');
        }
      );
    } else {
      console.error('Trình duyệt không hỗ trợ Geolocation');
      this.locationService.setLocation('Hanoi');
    }
  }

  onInputChange(value: string) {
    this.searchQuery = value;
    this.searchQuerySubject.next(value);
  }

  loadFavorites() {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  }

  toggleFavorite(weather: Weather) {
    weather.isFavorite = !weather.isFavorite;
    if (weather.isFavorite) {
      const existingIndex = this.favorites.findIndex(fav => fav.location === weather.location);
      if (existingIndex === -1) {
        this.favorites.push(weather);
      }
    } else {
      this.favorites = this.favorites.filter(fav => fav.location !== weather.location);
    }
    this.saveFavorites();
  }

  saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
  }

  onSearch() {
    this.searchQuerySubject.next(this.searchQuery);
  }
  // Hàm để xác định class dựa trên điều kiện thời tiết
  getWeatherClass(condition: string): string {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return 'sunny-bg';
    } else if (conditionLower.includes('cloudy')) {
      return 'cloudy-bg';
    } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
      return 'rainy-bg';
    } else if (conditionLower.includes('snow')) {
      return 'snowy-bg';
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return 'stormy-bg';
    }
    return 'default-bg'; // Nền mặc định nếu không khớp
  }
}