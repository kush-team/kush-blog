import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import { split, ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink): ApolloClientOptions<any> {
        // Create an http link:
        const http = httpLink.create({
          uri: 'https://fe7dd51637c9.ngrok.io/graphql',
        });

        // Create a WebSocket link:
        const ws = new WebSocketLink({
          uri: `wss://fe7dd51637c9.ngrok.io/graphql`,
          options: {
            reconnect: true,
          },
        });

        // using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
        const link = split(
          // split based on operation type
          ({ query }) => {
            let definition = getMainDefinition(query);
            return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
          },
          ws,
          http,
        );

        return {
          cache: new InMemoryCache(),
          link,
          // ... options
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
