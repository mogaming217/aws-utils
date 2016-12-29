'use strict';

let AWS = require("aws-sdk");
let config = require("./config");
config.region = "ap-northeast-1"; // 適宜変更
AWS.config.update(config);
let apigw = new AWS.APIGateway();

apigw.getRestApis({}, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        let i = 0;
        let length = data.items.length;
        let id = setInterval(function() {
            let item = data.items[i++];
            let param = {
                restApiId: item.id
            };
            apigw.deleteRestApi(param, function(err, data) {
                if (err) {
                    console.log(err);
                }
                console.log(item.name + " deleted");
                if (i >= length) {
                    clearInterval(id);
                    console.log("done");
                }
            });
        }, 61000);
    }
});
