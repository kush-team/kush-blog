import { Author } from './author';

export class Theme {


  static CopyFrom(data: any): Theme {
    let _theme = new Theme();
    _theme.name = data.name;
    _theme.id = data.id;

    if (data.author) {
      _theme.author = Author.CopyFrom(data.author);
    }

    _theme.landingTemplate = data.landingTemplate;
    _theme.articlesTemplate = data.articlesTemplate;
    _theme.articleTemplate = data.articleTemplate;
    _theme.landingQuery = data.landingQuery;
    _theme.articlesQuery = data.articlesQuery;
    _theme.articleQuery = data.articleQuery;
    return _theme;
  }

  public id!:string;
  public name!: string;
  public author!: Author;

  public landingTemplate!: string;
  public articlesTemplate!: string;
  public articleTemplate!: string;

  public landingQuery!: string;
  public articlesQuery!: string;
  public articleQuery!: string;


  public getPropertyByName(key: string): string {
    switch(key) {
      case 'landingTemplate': {
        return this.landingTemplate;
      }
      case 'articlesTemplate': {
        return this.articlesTemplate;
      }
      case 'articleTemplate': {
        return this.articleTemplate;
      }
      case 'articlesQuery': {
        return this.articlesQuery;
      }
      case 'articleQuery': {
        return this.articleQuery;
      }
      case 'landingQuery': {
        return this.landingQuery;
      }
    }
    return "";
  }

  public setPropertyByName(key: string, value: string): void {
    switch(key) {
      case 'landingTemplate': {
         this.landingTemplate = value;
        break;
      }
      case 'articlesTemplate': {
         this.articlesTemplate = value;
        break;
      }
      case 'articleTemplate': {
         this.articleTemplate = value;
        break;
      }
      case 'articlesQuery': {
         this.articlesQuery = value;
        break;
      }
      case 'articleQuery': {
         this.articleQuery = value;
        break;
      }
      case 'landingQuery': {
         this.landingQuery = value;
      }
    }
  }
}
