import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Session } from './models/session';
import { User } from './models/user';
import { map, catchError } from 'rxjs/operators';
import { DocumentNode } from 'graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private apollo: Apollo) {}

  private LOGIN_MUTATION: DocumentNode = gql`
    mutation Login($emailAddress: String!, $password: String!) {
      Login(emailAddress: $emailAddress, password: $password) {
        message
        status
        token
        user {
          id
          username
          emailAddress
          role
        }
      }
    }
  `;

  login(emailAddress: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: this.LOGIN_MUTATION,
      variables: {
        emailAddress: emailAddress,
        password: password,
      },
    });
  }
}
