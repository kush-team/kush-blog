import { ArticlesService } from './../articles.service';
import { Article } from './../models/article';
import { Component, Input, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { PlaygroundService } from '../playground.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  @Input() stringTemplate!: string;
  @Input() query!: string;

  public articles!: Article[];
  public loading = true;
  public error: any;

  public categoryID: string = '';

  constructor(
    private apollo: Apollo,
    private playgroundService: PlaygroundService,
    private articleService: ArticlesService
  ) {}

  public setFile(key: string, language: string): void {
    this.playgroundService.setFile(key, language);
  }

  public setArticle(articleID: string): void {
    this.articleService.setArticle(articleID);
  }

  ngOnChanges() {
    this.getArticles();
  }

  ngOnInit(): void {
    this.articleService.categoryChanged.subscribe((categoryID: string) => {
      this.categoryID = categoryID;
      this.getArticles();
    });
  }

  private getArticles(): void {
    this.apollo
      .watchQuery({
        query: gql(this.query),
        variables: {
          categoryID: this.categoryID,
        },
      })
      .valueChanges.subscribe((result: any) => {
        this.articles = (result?.data[
          Object.keys(result?.data)[0]
        ].dataList).map((article: any) => {
          return Article.CopyFrom(article);
        });
        this.loading = result.loading;
        this.error = result.error;
      });
  }
}
