import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaygroundComponent } from './playground/playground.component';
import { ArticlesComponent } from './articles/articles.component';
import { LandingComponent } from './landing/landing.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { FormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ArticleComponent } from './article/article.component';
import { CompileDirective } from './compile.directive';

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    ArticlesComponent,
    LandingComponent,
    ArticleComponent,
    CompileDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    GraphQLModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
