export interface Weather {
    location: string;
    temp_c: number;
    condition: string;
    humidity: number;
    wind_kph: number;
    icon: string;
    isFavorite: boolean;
}