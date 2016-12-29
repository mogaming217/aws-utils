'use strict';

let AWS = require("aws-sdk");
let config = require("./config");
config.region = "ap-northeast-1"; // 適宜変更
AWS.config.update(config);
let lambda = new AWS.Lambda();

// 指定されたリージョンのLambdaFunctionの一覧を取得
lambda.listFunctions({}, function(err, data){
    if(err){
        console.log(err, err.stack);
    }else{
        let length = data.Functions.length;
        let i = 0;
        let id = setInterval(function(){
            let func = data.Functions[i++];
            let param = {
                FunctionName: func.FunctionArn
            };
            // LambdaFunction削除
            lambda.deleteFunction(param, function(err, data){
                if(err){
                    console.log(err, err.stack);
                    clearInterval(id);
                }else{
                    console.log(func.FunctionName + " deleted");
                    if(i >= length){
                        clearInterval(id);
                        console.log("done");
                    }
                }
            });
        }, 3000);
    }
});
