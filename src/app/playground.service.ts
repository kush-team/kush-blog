import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PlaygroundService {


  public fileChanged:EventEmitter<any> = new EventEmitter();

  private currentKey: string;
  private currentLanguage: string;

  constructor() { }

  public setFile(key:string, language:string): void {
    this.currentKey = key;
    this.currentLanguage = language;
    this.fileChanged.emit({key: this.currentKey, language: this.currentLanguage});
  }
}
