import { EventEmitter, Injectable } from '@angular/core';
import { Theme } from './models/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public themeChanged:EventEmitter<Theme> = new EventEmitter();

  constructor() { }

  public setTheme(theme:Theme): void {
    this.themeChanged.emit(theme);
  }
}
