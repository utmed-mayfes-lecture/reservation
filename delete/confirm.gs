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
  var itemResponses = e.response.getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var question = itemResponses[i].getItem().getTitle();
    var answer = itemResponses[i].getResponse();
    if (question == '予約ID') var sign = answer;
  }
  var oldsign=sender.isValidSignature(sign);
  if(oldsign){
    var newsign={sheet:oldsign.sheet,row:oldsign.row,data:oldsign.data.concat()};
    sender.deleteSignature(oldsign);
    GmailApp.sendEmail(newsign.data[3], sender.confirmSubject(newsign,'削除'), sender.confirmBody(newsign,'予約が削除されました'),sender.senderInfo());
  }
}
