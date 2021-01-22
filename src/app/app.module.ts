import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  COMPILER_OPTIONS,
  CompilerFactory,
  Compiler,
} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaygroundComponent } from './playground/playground.component';
import { ArticlesComponent } from './articles/articles.component';
import { LandingComponent } from './landing/landing.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ArticleComponent } from './article/article.component';
import { AuthInterceptor } from './auth.interceptor';
import { LoginComponent } from './login/login.component';
import { AngularSplitModule } from 'angular-split';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { DynamicComponent } from './dynamic/dynamic.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    ArticlesComponent,
    LandingComponent,
    ArticleComponent,
    LoginComponent,
    DynamicComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSplitModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS],
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}
