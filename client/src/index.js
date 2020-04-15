import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import App2 from './components/upload/upload';
import Layout from "./components/layout"
import Layout_2 from "./components/layouts/layout_2"
import Welconme from"./components/welcome/welcome"
import EthAddress from "./components/test/ethAddress"
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Layout />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
