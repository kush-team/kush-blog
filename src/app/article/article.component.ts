import { ArticlesService } from './../articles.service';
import { Article } from './../models/article';
import { Component, Input, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { PlaygroundService } from '../playground.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  @Input() stringTemplate!:string;
  @Input() query!:string;

  public article!: Article;
  public loading = true;
  public error: any;

  private articleID:string;


  constructor(private apollo: Apollo, private playgroundService: PlaygroundService, private articlesService: ArticlesService) { }

  public setFile(key:string, language:string): void {
    this.playgroundService.setFile(key, language);
  }

  ngOnInit() {
    this.articlesService.articleChanged.subscribe(
      (articleID:string) => {
        this.articleID = articleID;
        this.getArticle();
      }
    );
  }

  ngOnChanges(): void {
    if (this.articleID) {
      this.getArticle();
    }
  }

  private getArticle(): void {
    this.apollo
      .watchQuery({
        query: gql(this.query),
        variables: {
          id: this.articleID
        }
      })
      .valueChanges.subscribe((result: any) => {
        this.article = Article.CopyFrom(result?.data[Object.keys(result?.data)[0]].data);
        this.loading = result.loading;
        this.error = result.error;
      });
  }

}
