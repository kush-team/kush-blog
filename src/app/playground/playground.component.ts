import { PlaygroundService } from './../playground.service';
import { Component, Input, KeyValueDiffer, KeyValueDiffers, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Theme } from '../models/theme';
import { StorageService } from '../storage.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})

export class PlaygroundComponent implements OnInit {
  @Input() theme!:Theme;
  @Input() themes!:Theme[];

  public code:string = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n\tselector: 'app-article',\n\ttemplateUrl: './hellowornd.component.html',\n\tstyleUrls: ['./hellowornd.component.scss']\n})\n\nexport class HelloWordComponent implements OnInit {\n\t\n\tconstructor() { }\n\n\tngOnInit() {\n\t\tconsole.log('Hello Word!')\n\t}\n}\n";
  private differ: KeyValueDiffer<string, any>;

  public editorOptions = {theme: 'vs-dark', language: 'typescript'};
  private key:string = "";
  public themeID: string;

  private UPDATE_THEME:DocumentNode = gql`
    mutation UpdateTheme($id: ID!, $theme: ThemeInput!) {
      UpdateTheme(id: $id, Theme: $theme) {
        message
        status
        data {
          id
          name
        }
      }
    }
  `;

  private CREATE_THEME:DocumentNode = gql`
    mutation CreateTheme($theme: ThemeInput!) {
      CreateTheme(Theme: $theme) {
        message
        status
        data {
          id
          name
          landingQuery
          landingTemplate
          articleQuery
          articleTemplate
          articlesQuery
          articlesTemplate
        }
      }
    }
  `;

  constructor(
    private differs: KeyValueDiffers,
    private apollo: Apollo,
    private playgroundService: PlaygroundService,
    public storageService:StorageService,
    private themeService:ThemeService) {
      this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.themeID = this.theme.id;
    this.playgroundService.fileChanged.subscribe(
      (data:any) => {
        this.key = data.key;
        this.code = this.theme.getPropertyByName(this.key);
        this.editorOptions = {theme: 'vs-dark', language: data.language};
      }
    );
  }




  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key == "theme") {
          this.code = this.theme.getPropertyByName(this.key);
        }
        if (item.key == "code") {
          this.theme.setPropertyByName(this.key, item.currentValue);
        }
      });
    }
  }

  public setFile(key:string, language:string): void {
    this.playgroundService.setFile(key, language);
  }

  public themeSelected(): void {
    if (this.theme.id != this.themeID) {
      let theme = this.themes.filter(t => t.id === this.themeID)[0];
      this.themeService.setTheme(theme);
    }
  }

  public saveTheme(): void {
    let theme = {
      name : this.theme.name,
      landingTemplate : this.theme.landingTemplate,
      landingQuery : this.theme.landingQuery,
      articlesTemplate : this.theme.articlesTemplate,
      articlesQuery : this.theme.articlesQuery,
      articleTemplate : this.theme.articleTemplate,
      articleQuery : this.theme.articleQuery,
      authorID: this.theme.author.id
    };

    this.apollo.mutate({
      mutation: this.UPDATE_THEME,
      variables: {
        id: this.theme.id,
        theme: theme
      }
    }).subscribe(({ data }) => {
      //console.log('got data', data);
    },(error) => {
      //console.log('there was an error sending the query', error);
    });
  }

  public cloneTheme(): void {
    let theme = {
      name : prompt("Please enter theme name", `${this.theme.name} cloned`),
      landingTemplate : this.theme.landingTemplate,
      landingQuery : this.theme.landingQuery,
      articlesTemplate : this.theme.articlesTemplate,
      articlesQuery : this.theme.articlesQuery,
      articleTemplate : this.theme.articleTemplate,
      articleQuery : this.theme.articleQuery,
      authorID: this.storageService.getCurrentUser().id
    };

    this.apollo.mutate({
      mutation: this.CREATE_THEME,
      variables: {
        theme: theme
      }
    }).subscribe((data:any) => {
      this.theme = Theme.CopyFrom(data.data.CreateTheme.data);
      this.themes.push(this.theme);
    },(error) => {
      //console.log('there was an error sending the query', error);
    });
  }
}
