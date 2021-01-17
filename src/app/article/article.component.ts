import { Article } from './../models/article';
import { Component, Input, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';

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

  constructor(private apollo: Apollo) { }

  ngOnInit() {
  }

  ngOnChanges(): void {

    this.apollo
      .watchQuery({
        query: gql(this.query),
      })
      .valueChanges.subscribe((result: any) => {
        this.article = Article.CopyFrom(result?.data[Object.keys(result?.data)[0]].data);
        this.loading = result.loading;
        this.error = result.error;
      });
  }

}
