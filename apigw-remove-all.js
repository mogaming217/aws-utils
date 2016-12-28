'use strict';

let AWS = require("aws-sdk");
let config = require("./config");
config.region = "ap-northeast-1";
AWS.config.update(config);
let apigw = new AWS.APIGateway();

apigw.getRestApis({}, function(err, data){
  if(err){
    console.log(err, err.stack);
  }else{
    let i = 0;
    let length = data.items.length;
    let id = setInterval(function(){
      if(i < length){
        let param = {
          restApiId: data.items[i++].id
        };
        apigw.deleteRestApi(param, function(err, data){
          if(err){
            console.log(err);
          }
        });
        if(i >= length){
            clearInterval(id);
            console.log("done");
        }
      }
    }, 61000);
  }
});
