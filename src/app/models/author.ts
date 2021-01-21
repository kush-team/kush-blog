export class Author {
  static CopyFrom(author: any): Author {
    let _author = new Author();
    _author.id = author.id;
    _author.username = author.username;
    return _author;
  }

  public id!: string;
  public username!: string;
}
