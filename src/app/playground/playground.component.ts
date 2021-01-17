import { Component, Input, KeyValueDiffer, KeyValueDiffers, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Theme } from '../models/theme';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})

export class PlaygroundComponent implements OnInit {
  @Input() theme!:Theme;
  public code!:string;
  private differ: KeyValueDiffer<string, any>;

  public editorOptions = {theme: 'vs-dark', language: 'graphql'};
  private key:string = "";

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

  constructor(private differs: KeyValueDiffers, private apollo: Apollo) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {

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
    this.key = key;
    this.code = this.theme.getPropertyByName(this.key);
    this.editorOptions = {theme: 'vs-dark', language: language};
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
}
