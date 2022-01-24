import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Game from './components/Game';
import * as serviceWorker from './serviceWorker';
import Home from './components/Home';
import Lobby from './components/Lobby';

const client = new ApolloClient({
	uri: process.env.REACT_APP_API_URL,
	cache: new InMemoryCache(),
});

const App: React.FC = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" exact>
				<Home />
			</Route>
			<Route path="/game" exact>
				<Game />
			</Route>
			<Route path="/lobby" exact>
				<Lobby roomId="123456" />
			</Route>
		</Switch>
	</BrowserRouter>
);

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
