import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Weather } from '../models/weather.model';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private apiKey = '350de4fde5614bc691531647250604';
    private apiUrl = 'https://api.weatherapi.com/v1/current.json';

    constructor(private http: HttpClient) { }

    getCurrentWeather(location: string): Observable<Weather> {
        const url = `${this.apiUrl}?key=${this.apiKey}&q=${encodeURIComponent(location)}`;

        return this.http.get<any>(url).pipe(
            map(response => ({
                location: response.location.name,
                temp_c: response.current.temp_c,
                condition: response.current.condition.text,
                humidity: response.current.humidity,
                wind_kph: response.current.wind_kph,
                icon: response.current.condition.icon,
                isFavorite: false
            }))
        );
    }
}