'use strict';

let fs = require("fs");
let csv = require("comma-separated-values");
let AWS = require("aws-sdk");
let config = require("./config");
config.region = "ap-northeast-1"; // 適宜変更
AWS.config.update(config);
let iam = new AWS.IAM();

let str = fs.readFileSync("./csv/user-list.csv").toString();
let users = new csv(str, {header: true}).parse();

let length = users.length;
let i = 0;

let id = setInterval(function(){
    let user = users[i++];
    let param = {
        UserName: user.name,
        GroupName: user.group
    };
    // まずUserをGroupから除外する
    iam.removeUserFromGroup(param, function(err, data){
        if(err){
            console.log(err, err.stack);
            clearInterval(id);
        }else{
            delete param.GroupName;
            // Profileを削除する
            iam.deleteLoginProfile(param, function(err, data){
                if(err){
                    console.log(err, err.stack);
                    clearInterval(id);
                }else{
                    // Userを削除する
                    iam.deleteUser(param, function(err, data){
                        if(err){
                            console.log(err, err.stack);
                            clearInterval(id);
                        }else{
                            console.log(user.name + " deleted");
                            if(i >= length){
                                console.log("done");
                                clearInterval(id);
                            }
                        }
                    });
                }
            });
        }
    });
}, 10000);
