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
        UserName: user.name
    };
    // ユーザ作成
    iam.createUser(param, function(err, data){
        if(err){
            console.log(err, err.stack);
            clearInterval(id);
        }else{
            param.Password = user.password;
            param.PasswordResetRequired = true;
            // コンソールからログインできるようにProfileを設定
            iam.createLoginProfile(param, function(err, data){
                if(err){
                    console.log(err, err.stack);
                    clearInterval(id);
                }else{
                    delete param.Password;
                    delete param.PasswordResetRequired;
                    param.GroupName = user.group;
                    // グループに追加
                    iam.addUserToGroup(param, function(err, data){
                        if(err){
                            console.log(err, err.stack);
                            clearInterval(id);
                        }else{
                            console.log(param.UserName + " created");
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
}, 5000);
