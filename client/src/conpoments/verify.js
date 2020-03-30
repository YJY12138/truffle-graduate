import React, {Component} from 'react'
import getWeb3 from './getWeb3'
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
//验证文件是否在区块链上
