import { ThemeService } from './theme.service';
import { StorageService } from './storage.service';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Theme } from './models/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'kush-blog';

  public loading = true;
  public error: any;

  public codeSize: number = 40;
  public siteSize: number = 60;
  public isOpen: boolean = true;

  private gqlTest: string = `
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
`;
  private allThemesQuery: string = `
    query getAllThemes{
      GetAllThemes {
        dataList {
          id
          name
          landingQuery
          landingTemplate
          articleQuery
          articleTemplate
          articlesQuery
          articlesTemplate
          author {
            id
            username
            emailAddress
          }
        }
    }
}
`;

  public theme!: Theme;

  public themeList!: Theme[];

  constructor(
    private apollo: Apollo,
    public storageService: StorageService,
    private themeService: ThemeService
  ) {}

  public splitResize(event: any): void {
    this.codeSize = event.sizes[0];
    this.siteSize = event.sizes[1];
    this.isOpen = this.codeSize > 5;

    window.dispatchEvent(new Event('resize'));
  }

  public closeCodeEditor(): void {
    this.codeSize = 0;
    this.siteSize = 100;
    this.isOpen = false;
  }

  public openCodeEditor(): void {
    this.codeSize = 40;
    this.siteSize = 60;
    this.isOpen = true;
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  ngOnInit() {
    this.themeService.themeChanged.subscribe((theme: Theme) => {
      this.theme = theme;
    });

    this.apollo
      .subscribe({
        query: gql`
          subscription themeChanged {
            themeChanged {
              id
              name
              landingTemplate
              landingQuery
              articlesQuery
              articlesTemplate
              articleQuery
              articleTemplate
            }
          }
        `,
      })
      .subscribe((resp: any) => {
        let themeToUpdate: Theme = this.themeList.filter(
          (t) => t.id === resp?.data?.themeChanged?.id
        )[0];
        if (themeToUpdate) {
          themeToUpdate.articleQuery = resp?.data?.themeChanged?.articleQuery;
          themeToUpdate.articleTemplate =
            resp?.data?.themeChanged?.articleTemplate;
          themeToUpdate.articlesQuery = resp?.data?.themeChanged?.articlesQuery;
          themeToUpdate.articlesTemplate =
            resp?.data?.themeChanged?.articlesTemplate;
          themeToUpdate.landingQuery = resp?.data?.themeChanged?.landingQuery;
          themeToUpdate.landingTemplate =
            resp?.data?.themeChanged?.landingTemplate;
        }
      });

    this.apollo
      .watchQuery({
        query: gql(this.allThemesQuery),
      })
      .valueChanges.subscribe((result: any) => {
        if (!this.themeList) {
          this.themeList = (result?.data[
            Object.keys(result?.data)[0]
          ].dataList).map((theme: any) => {
            return Theme.CopyFrom(theme);
          });

          if (!this.theme) {
            let originalFilter: Theme = this.themeList.filter(
              (t: Theme) => t.name === 'Original'
            )[0];
            this.themeService.setTheme(originalFilter);
          } else {
            this.themeService.setTheme(this.theme);
          }

          this.loading = result.loading;
          this.error = result.error;
        }
      });
  }
}
