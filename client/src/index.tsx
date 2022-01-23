import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Game from './components/Game';
import * as serviceWorker from './serviceWorker';
import Home from './components/Home';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route path="/" exact>
				<Home />
			</Route>
			<Route path="/game" exact>
				<Game />
			</Route>
		</Switch>
	</BrowserRouter>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
