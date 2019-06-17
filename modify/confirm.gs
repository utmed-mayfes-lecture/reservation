function onSubmitForm(e){
  var lock = LockService.getScriptLock();//ロックサービスのオブジェクトを生成
  try{
    lock.waitLock(2000);//複数のフォーム送信がほぼ同時にあった時，遅い方に最大2秒待ってもらう
    sendConfirm(e);
  }catch(err){
  }finally{
    lock.releaseLock();//次の送信のためにロック解除
  }
}
function sendConfirm(e){
  var data=['','','','','',0];
  var itemResponses = e.response.getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var question = itemResponses[i].getItem().getTitle();
    var answer = itemResponses[i].getResponse();
    if (question == 'お名前') data[4] = answer;
    if (question == '人数') data[5] = answer;
    if (question == 'メールアドレス') data[3] = answer;
    if (question == '予約ID') data[0] = answer;
  }
  var oldsign=sender.isValidSignature(data[0]);
  if(oldsign){
    var newsign={sheet:oldsign.sheet,row:oldsign.row,data:oldsign.data.concat()};
    newsign.data=data.concat();
    newsign=sender.modifyReservation(oldsign,newsign);
    GmailApp.sendEmail(newsign.data[3], sender.confirmSubject(newsign,'変更'), sender.confirmBody(newsign,'予約が変更されました'),sender.senderInfo());
  }
}
