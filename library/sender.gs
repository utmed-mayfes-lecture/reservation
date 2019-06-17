var lectures=[
  {lecturer:"栗本康夫先生",start:new Date('2019-05-18T09:20:00.000+0900'),end:new Date('2019-05-18T10:45:00.000+0900'),recept:new Date('2019-05-18T09:00:00.000+0900')},
  {lecturer:"竹内昌治先生",start:new Date('2019-05-18T15:00:00.000+0900'),end:new Date('2019-05-18T17:00:00.000+0900'),recept:new Date('2019-05-18T14:00:00.000+0900')},
  {lecturer:"徳田安春先生",start:new Date('2019-05-19T09:20:00.000+0900'),end:new Date('2019-05-19T10:30:00.000+0900'),recept:new Date('2019-05-19T09:00:00.000+0900')},
  {lecturer:"生坂政臣先生",start:new Date('2019-05-19T16:00:00.000+0900'),end:new Date('2019-05-19T17:00:00.000+0900'),recept:new Date('2019-05-19T15:00:00.000+0900')},
  {lecturer:"東航平先生",start:new Date('2019-05-18T09:00:00.000+0900'),end:new Date('2019-05-19T10:00:00.000+0900'),recept:new Date('2019-05-18T08:30:00.000+0900')},
];
var days=['日','月','火','水','木','金','土'];
var sheetid = '';

function mailBody(customer,id){
  var Audience;
  if (customer.count > 1){
    Audience=customer.name+'様ご一行 '+ customer.count+'名';
  }
  else
  {
    Audience=customer.name+'様';
  }
  return (Audience+'\n\n'
          + Utilities.formatString('この度は%sの講演会に事前予約していだだき誠にありがとうございます。\n',lectures[id].lecturer)
          + 'このメールは自動返信メールです。\n'
          + '【予約ID】\n'
          + makeSignature(customer,lectures[id])+'\n'
          + '【講演時間】\n'
          + Utilities.formatDate(lectures[id].start, 'JST', 'yyyy/MM/dd HH:mm')+'～'+Utilities.formatDate(lectures[id].end, 'JST', 'yyyy/MM/dd HH:mm')+'\n'
          + '【受付開始】\n'
          + Utilities.formatDate(lectures[id].recept, 'JST', 'yyyy/MM/dd HH:mm')+'\n'
          + '【講演会場】\n'
          + '東京大学本郷キャンパス医学部本館3F 大講堂\n'
          + '【住所】\n'
          + '東京都文京区本郷7丁目3-1\n'
          + '【注意事項】\n'
          + '事前受付いただきました方に優先的にご入場いただくため当日は会場外にて集合した後、係の者が会場までご案内致します。\n'
          + '下記の予約確認ページにて地図をご参照の上、\n'
          + '【'+ Utilities.formatDate(lectures[id].recept, 'JST', 'MM/dd')+'('+days[lectures[id].recept.getDay()]+') '+Utilities.formatDate(lectures[id].recept, 'JST','HH:mm') +'】\n'
          + '【東大本郷キャンパス 医学部本館前広場】\n'
          + 'へお越しくださいますようご協力の程よろしくお願い申し上げます。\n'
          + 'なお、09:10以降にお越しくださる方は直接会場までお越し下さい。事前予約いただきましても講演開始時間である09:20までにお越しいただけない場合は、席の確保を保証いたしかねますので予めご了承ください。\n'
          + '講演会実行委員一同、皆様のご来場をお待ちしております。\n'
          + '会場へのアクセス＆予約内容の確認は '+thisurl+'?id='+makeSignature(customer,lectures[id])+ ' をご覧下さいますようお願い申し上げます。\n'
          + '何かお問い合わせ事項があるようでしたら mayfes2019.utmed.lecture@gmail.com までメールをいただければ対応いたします\n');
}

function confirmBody(iddata,message){
  var Audience;
  if (iddata.data[5] > 1){
    Audience=iddata.data[4]+'様ご一行 '+ iddata.data[5]+'名';
  }
  else
  {
    Audience=iddata.data[4]+'様';
  }
  return (Audience+'\n\n'
          + Utilities.formatString('この度は%sの講演会に事前予約していだだき誠にありがとうございます。\n',iddata.data[1])
          + 'このメールは自動返信メールです。\n'
          + '【予約ID】\n'
          + iddata.data[0]+'\n'
          + '【メールアドレス】'+'\n'
          + iddata.data[3]+'\n'
          + '【お名前】'+'\n'
          + iddata.data[4]+'\n'
          + '【人数】'+'\n'
          + iddata.data[5]+'\n'
          + message+'。\n'
          + '【注意事項】\n'
          + '予約内容の確認は '+thisurl+'?id='+iddata.data[0]+ ' で対応しております。\n'
          + '何かお問い合わせ事項があるようでしたら mayfes2019.utmed.lecture@gmail.com までメールをいただければ対応いたします\n');
}


function mailSubject(customer,id){
  return(Utilities.formatString("【%s講演会事前予約】受付しました", lectures[id].lecturer));
}
function confirmSubject(iddata,smessage){
   return('【'+iddata.data[1]+'講演会予約】 '+smessage);
}

function senderInfo(){
  return({from:"mayfes2019utmed.lecture@gmail.com",
    name:"東京大学医学部五月祭企画 講演会担当"});
}

function makeSignature(customer,lecture){
  var key='-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAOp+JCQVvYnDCTG9\nQSqKbDVCNDaroxSPLc0Ew4pc7ltIfmpMQ49d+i/wMgVnixu0Uwyey7Lyw5GfwK1G\n1nKJHRkWCyEUrJ7ludTsbn65bziI3N4V8fDiWIMxx1Z2A1+JIoP6kRYgqHSErCD8\nZ3HvC+RhsQUAuA5pQBdpNT6zWR8PAgMBAAECgYEAz4vyRRYQ+pvryWBvC04VVFZS\njIkCALJxoWK0CAUU2yqg6UizC3Psev2n6GyrDUxfrW3ncW25d2zkRvnJ2PpPCzFk\nM8ArmHXC4QZpbTm85fHBrEuJ0bBVrvhWpUX6jEdF44rfpnz6E2ksdzZUF5P4QMZE\nchD2pfNcRqWuxP8mOBECQQD2R5f0Ub240qjxYOF7bKBXnqxGkV6As8jEhixy36UZ\ndQBTIBMw7Uru83GZCiCLKW/sy2FjRLSxm8kAz+NfiGR9AkEA879z40S7DkuHEPWA\nWO5SL2Qa2vmYK8kveiksx/UfTumVw1ZZUgE6E44V/GMFNzjtMcPJkEKokya/L7au\nxm7jewJABcaeELPOEESYg7iy8RMWG5f0EF+eaMROpBVFe5g1JgixbkGlUZNvG3WI\nJ3+uTbU2E8adTReyaSvvJd66RWZMfQJAMiGzTQ/qxQLlsag8kI3bm2GkYFsrX/4N\n5LspOasBmHJUWgudbU9RSYpUnUckYHo11qFlCGWdVD6I3eBdy/QslwJANn8cef6S\nVVhY6HW4uTbQ0KWoPMbwlsXozD0x3kB1LqLh+yjDnYxDgKrG19qNtNB9qYZkCrZS\nl/n8kkjktGTL5A==\n-----END PRIVATE KEY-----\n'
  var signature=Utilities.computeRsaSha256Signature((lecture.lecturer+Utilities.formatDate(customer.timestamp, 'JST', 'MMddHHmmss')+customer.address+customer.name),key);
  return(signature.reduce(function(str,chr){
    chr = (chr < 0 ? chr + 256 : chr).toString(16);
    return str + (chr.length==1?'0':'') + chr;
  },'').substr(0,8));
}

function writeSignature(customer,lectureid){
  var lecture=lectures[lectureid];
  var database=SpreadsheetApp.openById(sheetid);
  var sheet=database.getSheetByName(lecture.lecturer);
  var recordrow=sheet.getDataRange().getLastRow()+1;
  var recordrange=sheet.getRange(recordrow,1,1,6);
  var record=[[makeSignature(customer,lecture),
             lecture.lecturer,
             Utilities.formatDate(customer.timestamp, "JST", "yyyy-MM-dd'T'HH:mm:ss+0900"),
             customer.address,
             customer.name,
             customer.count
            ]];
  recordrange.setValues(record);
  return(record);
}

function isValidSignature(signature){
  var database=SpreadsheetApp.openById(sheetid);
  var signaturecol=0;
  var sheets = database.getSheets();
  for (var i=0;i<sheets.length;i++){
    var data=sheets[i].getDataRange().getValues();
    for(var j=0;j<data.length;j++){
      var line = data[j];
      if(line[signaturecol]==signature){
        return({sheet:i,row:j+1,data:line});
      }
    }
  }
  return(false);
}
function deleteSignature(iddata){
  var sheets=(SpreadsheetApp.openById(sheetid).getSheets())[iddata.sheet];
  var database=sheets.getRange(iddata.row,1,1,6);
  if(iddata.data[0]==database.getValues()[0][0]){
    database.deleteCells(SpreadsheetApp.Dimension.ROWS);
    return(0);
  }
  return(1);
}
function modifyReservation(iddata,newiddata){
  var sheets=(SpreadsheetApp.openById(sheetid).getSheets())[iddata.sheet];
  var database=sheets.getRange(iddata.row,1,1,6);
  if(newiddata.data[0]==iddata.data[0]){
    if(Number(newiddata.data[5])>0){iddata.data[5]=Number(newiddata.data[5]);}
    if(newiddata.data[4]!=""&& newiddata.data[4]!=null){iddata.data[4]=newiddata.data[4];}
    if(newiddata.data[3]!=""&& newiddata.data[3]!=null&&isValidEmail(newiddata.data[3])){iddata.data[3]=newiddata.data[3];}
    database.setValues([iddata.data]);
    return({sheet:iddata.sheet,row:iddata.row,data:iddata.data.concat()});
  }
  return(0);
}
function isValidEmail(email) {
  //適当なコードを使ってください。Google Form側でValidateしています。
  return(1);
}
