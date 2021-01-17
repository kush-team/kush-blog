import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  public articleChanged:EventEmitter<any> = new EventEmitter();

  private currentArticleID: string;

  constructor() { }

  public setArticle(articleID: string): void {
    this.currentArticleID = articleID;
    this.articleChanged.emit(articleID);
  }
}
