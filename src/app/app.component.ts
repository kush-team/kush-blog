import { Component, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { Theme } from './models/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public title = 'kush-blog';

  public loading = true;
  public error: any;

  private gqlTest:string = `
  {
    GetThemeByName(name: "Original") {
      message
      status
      data {
        id
        name
        landingTemplate
        landingQuery
        articlesQuery
        articlesTemplate
        articleQuery
        articleTemplate
        author {
          id
          username
        }
      }
    }
  }
`



  public theme!: Theme;

  constructor(private apollo: Apollo) {}

  ngOnInit() {

    this.apollo.subscribe({
            query: gql`
              subscription themeChanged{
                themeChanged{
                    id
                    name
                    landingTemplate
                    landingQuery
                    articlesQuery
                    articlesTemplate
                    articleQuery
                    articleTemplate
                }
            }`
    }).subscribe((resp:any) => {
      this.theme.articleQuery = resp?.data?.themeChanged?.articleQuery;
      this.theme.articleTemplate = resp?.data?.themeChanged?.articleTemplate;
      this.theme.articlesQuery = resp?.data?.themeChanged?.articlesQuery;
      this.theme.articlesTemplate = resp?.data?.themeChanged?.articlesTemplate;
      this.theme.landingQuery = resp?.data?.themeChanged?.landingQuery;
      this.theme.landingTemplate = resp?.data?.themeChanged?.landingTemplate;
    });

    this.apollo
      .watchQuery({
        query: gql(this.gqlTest),
      })
      .valueChanges.subscribe((result: any) => {
        this.theme = Theme.CopyFrom(result?.data[Object.keys(result?.data)[0]].data);
        this.loading = result.loading;
        this.error = result.error;
      });
  }

}
