import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import {  BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import Navbar from './components/Navbar';
import { SearchBooks } from './pages/SearchBooks';
import { SavedBooks } from './pages/SavedBooks';

const httpLink = createHttpLink({
  uri: '/graphql'
})

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API 
  link: authLink.concat(httpLink),
  cache: new InMemoryCache
});

function App() {
  return (
    <ApolloProvider client={client}>

      <Router >
      <Navbar />
      <Switch>
        <Route exact path='/' component={SearchBooks} />
        <Route exact path='/saved' component={SavedBooks} />
        <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
      </Switch>
      </Router >

    </ApolloProvider>
  );
}

export default App;
