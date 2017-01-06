'use strict';

let AWS = require("aws-sdk");
let config = require("./config");
config.region = "ap-northeast-1"; // 適宜変更
AWS.config.update(config);
let CW = new AWS.CloudWatchLogs();

deleteRecursion();

function deleteRecursion(){
    // 1度に50件までしか取得できない
    CW.describeLogGroups({}, function(err, data){
        if(err){
            console.log(err, err.stack);
            return;
        }else if(!data || !data.logGroups || data.logGroups.length == 0){
            // 消すデータがなかったら終わり
            console.log("done");
            return;
        }else{
            let length = data.logGroups.length;
            let i = 0;
            let id = setInterval(function(){
                let group = data.logGroups[i++];
                let param = {
                    logGroupName: group.logGroupName
                };
                CW.deleteLogGroup(param, function(err, data){
                    if(err){
                        console.log(err, err.stack);
                        clearInterval(id);
                        return;
                    }else{
                        console.log(i + ": " + group.logGroupName + " deleted");
                        if(i >= length){
                            clearInterval(id);
                            // 50すべて削除できたらもう一度この関数を再帰的に呼ぶ
                            deleteRecursion();
                            return;
                        }
                    }
                });
            }, 1000);
        }
    });
}
