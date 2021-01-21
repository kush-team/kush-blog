import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  public articleChanged: EventEmitter<any> = new EventEmitter();
  public categoryChanged: EventEmitter<any> = new EventEmitter();

  private currentArticleID: string;
  private currentcategoryID: string;

  constructor() {}

  public setArticle(articleID: string): void {
    this.currentArticleID = articleID;
    this.articleChanged.emit(articleID);
  }

  public setCategoryID(categoryID: string): void {
    this.currentcategoryID = categoryID;
    this.categoryChanged.emit(categoryID);
  }
}
