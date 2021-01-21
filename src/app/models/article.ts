import { Category } from './category';
import { Author } from './author';

export class Article {
  static CopyFrom(article: any): Article {
    let _article = new Article();

    _article.id = article.id;
    _article.title = article.title;
    _article.content = article.content;
    _article.brief = article.brief;
    _article.createdAt = article.createdAt;

    if (article.author) {
      _article.author = Author.CopyFrom(article.author);
    }
    if (article.category) {
      _article.category = Category.CopyFrom(article.category);
    }

    return _article;
  }

  public id!: string;
  public title!: string;
  public content!: string;
  public brief!: string;
  public createdAt!: string;
  public author!: Author;
  public category!: Category;
}
