import { Article } from './../models/article';
import { Component, Input, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { PlaygroundService } from '../playground.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  @Input() stringTemplate!:string;
  @Input() query!:string;

  public articles!: Article[];
  public loading = true;
  public error: any;

  constructor(private apollo: Apollo, private playground: PlaygroundService) { }

  public setFile(key:string, language:string): void {
    this.playground.setFile(key, language);
  }

  ngOnChanges() {
    this.apollo
      .watchQuery({
        query: gql(this.query),
      })
      .valueChanges.subscribe((result: any) => {
        this.articles = (result?.data[Object.keys(result?.data)[0]].dataList).map((article:any) => { return Article.CopyFrom(article)}) ;
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  ngOnInit(): void {

  }

}
