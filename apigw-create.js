'use strict';

let fs = require("fs");
let csv = require("comma-separated-values");
let AWS = require("aws-sdk");
let config = require("./config");
config.region = "ap-northeast-1"; // 適宜変更
AWS.config.update(config);
let apigw = new AWS.APIGateway();

let str = fs.readFileSync("./csv/apigw-list.csv").toString();
let items = new csv(str, {header: true}).parse();

let length = items.length;
let i = 0;

let id = setInterval(function(){
    let item = items[i++];
    let param = {
        name: item.name
    };
    apigw.createRestApi(param, function(err, data){
        if(err){
            console.log(err, err.stack);
        }
        console.log(item.name + " created");
        if(i >= length){
            clearInterval(id);
            console.log("done");
        }
    });
}, 61000);
