# [予約Form](https://github.com/utmed-mayfes-lecture/reservation/tree/master/lecturer)
lecturerのフォルダーにあります。Google Formを作成し、メールアドレスの収集にチェックを入れ、

- お名前
- 人数

という名前の質問を用意してください。
トリガーはフォーム送信時で`onSubmitForm`を使用してください
## [mailer.gs](https://github.com/utmed-mayfes-lecture/reservation/blob/master/lecturer/mailer.gs)
〇〇先生予約フォームで使用されているものです。フォーム送信時に起動するようトリガーが設定されています。
### var lectureid
変数lectureidは後述のlecturesの何番目の要素に対応するGoogle Formかを示しています。
### function onSubmitForm(e)
フォーム送信時にまず実行されます。変更も削除も同一です。
フォームが重複実行された際に、LockServiceでタイムスタンプが重複することを防いでいます。
### function sendReceipt(e,lectureid)
必要な質問のデータを抽出しています。講義idと質問のデータとをlibraryに渡しています。
# [変更Form](https://github.com/utmed-mayfes-lecture/reservation/tree/master/modify)
modifyのフォルダーにあります。Google Formを作成し

- 予約ID
- メールアドレス
- お名前
- 人数

という名前の質問を用意してください。
トリガーはフォーム送信時で`onSubmitForm`を使用してください
## [confirm.gs](https://github.com/utmed-mayfes-lecture/reservation/blob/master/modify/confirm.gs)
### function sendConfirm(e)
変更、削除する予約IDを抽出した後、他の回答も抽出しlibraryに渡します。
# [削除Form](https://github.com/utmed-mayfes-lecture/reservation/tree/master/delete)
deleteのフォルダーにあります。Google Formを作成し

- 予約ID

という名前の質問を用意してください。
トリガーはフォーム送信時で`onSubmitForm`を使用してください
## [confirm.gs](https://github.com/utmed-mayfes-lecture/reservation/blob/master/delete/confirm.gs)
### function sendConfirm(e)
削除する予約IDを抽出した後libraryに渡します。

# [共通ライブラリ](https://github.com/utmed-mayfes-lecture/reservation/tree/master/library)
Google Driveにスクリプト単体で置いてください。またWebアプリケーションとして公開してください。
## [sender.gs](https://github.com/utmed-mayfes-lecture/reservation/blob/master/library/sender.gs)
メール送信スクリプトと、予約ID照合の実装がなされています。メールの文面を4人の先生である程度共通させたかったために一か所に情報を集めました。
### var lectures

| 変数名 | 内容 |
----|----
| lecturer | 講演者名 |
| start | 講演開始時刻 |
| end | 講演終了時刻 |
| recept | 受付開始時刻 |

講演id=nは`lectures[n]`に相当します
### var days=['日','月','火','水','木','金','土']
曜日の配列です。
### var sheetid
変数lectures[lectureid]とした際に講演情報(	講演者名、講演開始時間、講演終了時間、受け付け開始時間)が出てくるようになっています。
https://docs.google.com/spreadsheets/d/[ID] /edit
で[ID]の部分がIDです。
シート名は`lecturer`と同一のものを用意してください。
### function mailBody(customer,id)
予約者情報と、講演idからメールの文面を生成する関数です。
戻り値はメール本文のテキストです。
### function mailSubject(customer,id)
予約者情報と、講演idからメールのタイトルを生成する関数です。
戻り値はメールタイトルのテキストです。
### function writeSignature(customer,lectureid)
予約者情報と、講演idから予約レコードを作成する関数です。
戻り値は書き込まれたレコードです。
```
[[
  makeSignature(customer,lecture),
  lecture.lecturer,
  Utilities.formatDate(customer.timestamp, "JST", "yyyy-MM-dd'T'HH:mm:ss+0900"),
  customer.address,
  customer.name,
  customer.count
]];
```

| 引数 | 内容 |
----|----
| customer | 予約者情報 |
| id, lectureid | 講演id |

`var customer`の構造は以下の通りです。

| 変数名 | 内容 |
----|----
| address | 予約者のメールアドレス |
| name | 予約者名 |
| count | 予約人数 |
| timestamp | Date()オブジェクトの予約受付時刻 |

### function makeSignature(customer,lecture)
レコードをつなげた文字列に対し、SHA256と生成しておいてある秘密鍵で電子署名を生成しています。ただの乱数を使用する場合よりも、重複が避けられると考えこの実装にしました。

| 引数 | 内容 |
----|----
| customer | 予約者情報 |
| lecture | lectures[(講演id)] |

戻り値は8桁の16進数をテキスト化したものです。
### function isValidSignature(signature)
対応するレコードを電子署名から検索し照合しています。

| 引数 | 内容 |
----|----
| signature | 8桁の16進数テキスト |

戻り値は以下のような配列です。

| 変数名 | 内容 |
----|----
| sheet | 予約IDが存在するシート |
| row | 予約IDが存在する行 |
| data | 予約情報 |

`data`は以下のような配列です。

0. 予約ID
1. 講演者名
2. "yyyy-MM-dd'T'HH:mm:ss+0900"形式の予約受付時刻
3. 予約者メールアドレス
4. 予約者名
5. 予約人数

### function confirmBody(iddata,message)
レコードの情報から予約変更や削除の際の確認メッセージを送るものです。

|引数 | 内容 |
----|----
| iddata | isValidSignatureの戻り値と同形式 |
| message | 予約者への確認メッセージ |

戻り値はメール本文のテキストです。
### function confirmSubject(iddata,smessage)
レコードの情報から予約変更や削除の際の確認メッセージを送るものです。

|引数 | 内容 |
----|----
| iddata | isValidSignatureの戻り値と同形式 |
| message | 予約者への確認メッセージ |

戻り値はメールタイトルのテキストです。
### function deleteSignature(iddata)
対応するレコードを電子署名から検索し削除を行っています。

|引数 | 内容 |
----|----
| iddata | isValidSignatureの戻り値と同形式 |

成功した場合は0、失敗した場合は1を返します。
### function modifyReservation(iddata,newiddata)
対応するレコードを電子署名から検索し変更を行っています。変更に関しては、newiddataで空のフィールドは無視し、空でないものだけ変更する実装になっています。変更できるのは予約者メールアドレス、予約者名、予約人数だけです。

|引数 | 内容 |
----|----
| iddata | isValidSignatureの戻り値と同形式 |
| newiddata | isValidSignatureの戻り値と同形式 |

成功した場合は0、失敗した場合は1を返します。
### function senderInfo()
送信アドレスと送信者名を指定しています。

| 変数名 | 内容 |
----|----
| from | `"mayfes2019utmed.lecture@gmail.com"` |
| name | `"東京大学医学部五月祭企画 講演会担当"` |

対応するシートを探し出し、レコードを生成し、最終行の一つ下に書き込んでいます。
対応するレコードを電子署名から検索し、照合、変更、削除を行っています。変更に関しては、newiddataで空のフィールドは無視し、空でないものだけ変更する実装になっています。

## [verifier.gs](https://github.com/utmed-mayfes-lecture/reservation/blob/master/library/verifier.gs)
ここでdoGet関数を定義し、URLパラメーターに?id=(8桁の16進数)が来たときは、照合し、パラメーターが何もなかったときは予約照合画面が出るようにしています。
### var thisurl
Webアプリケーションとして公開した際の割り当てアドレスです。
### function doGet(e)
Webアプリケーションとして公開した際に最初に呼び出される関数です。HTMLオブジェクトを返します。
