import React from 'react';
import ReactDOM from 'react-dom';


import Layout_3 from "./components/layouts/layout_3"
import Welconme from"./components/welcome/welcome"
import EthAddress from "./components/test/ethAddress"
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Layout_3 />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
