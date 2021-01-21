export class Category {
  static CopyFrom(category: any): Category {
    let _category = new Category();
    _category.id = category.id;
    _category.name = category.name;
    return _category;
  }

  public id!: string;
  public name!: string;
}
