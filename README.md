# AWS-Utils
## 概要
勉強会やインターンシップで、AWSのユーザを参加者に配布し何かしらのハンズオンすることが多いです。
ただ、そのための準備や後始末が非常に面倒です。たとえば、APIGatewayは、RestAPIを1分に1つしか
作成/削除できません。そういった微妙に不便な部分を解決するスクリプトをNode.jsで書きました。

### apigw-remove-all.js
指定したリージョン（デフォルトはap-northeast-1）にあるRestAPIを全て削除します。全て削除されるので、利用には細心の注意を払ってください。消したくないものがある場合は使えません。

### apigw-create.js
指定したリージョンに、CSVで指定した名前のRestAPIを作成するスクリプトです。CSVの中身は下記のようにしてください（CSVになってないけど気にしない）。1行目のnameはheaderとして使っているので、変えないようにしてください。

```
name
restapi-name
hogehoge
foobar
```

## 必要な環境
- node
  - v6.6.0で動作確認済み
- npm
  - v3.10.3で動作確認済み
- 対象AWSアカウントのクレデンシャル情報  

## 使い方
### config.jsの作成
AWSアカウントのクレデンシャル情報を設定するconfig.jsを作成します。下記内容を各自書き換えて、config.jsとしてプロジェクトルートに保存してください。

```
let AWS = require("aws-sdk");

var config = {
  accessKeyId: "your access key",
  secretAccessKey: "your secret"
};

module.exports = config;
```

### 実行
`node hogehoge.js`で実行してください。

## 注意事項
ご利用により生じた問題は、すべて自己責任です。一切責任を負いませんので、予めご了承ください。
