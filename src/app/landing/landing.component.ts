import { Component, Input, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ArticlesService } from '../articles.service';
import { Category } from '../models/category';
import { PlaygroundService } from '../playground.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  @Input() stringTemplate!: string;
  @Input() query!: string;

  public loading = true;
  public error: any;
  public categories: Category[];
  public categoryID: string;

  constructor(
    private apollo: Apollo,
    private playgroundService: PlaygroundService,
    private articleService: ArticlesService
  ) {}

  ngOnInit(): void {
    this.articleService.categoryChanged.subscribe((categoryID: string) => {
      this.categoryID = categoryID;
    });
  }

  ngOnChanges(): void {
    this.apollo
      .watchQuery({
        query: gql(this.query),
      })
      .valueChanges.subscribe((result: any) => {
        this.categories = (result?.data[
          Object.keys(result?.data)[0]
        ].dataList).map((category: any) => {
          return Category.CopyFrom(category);
        });
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  public setFile(key: string, language: string): void {
    this.playgroundService.setFile(key, language);
  }

  public setCategoryID(categoryID: string): void {
    this.articleService.setCategoryID(categoryID);
  }
}
