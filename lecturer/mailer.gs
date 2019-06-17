var lectureid=0;
function onSubmitForm(e){
  var lock = LockService.getScriptLock();//ロックサービスのオブジェクトを生成
  try{
    lock.waitLock(2000);//複数のフォーム送信がほぼ同時にあった時，遅い方に最大2秒待ってもらう
    sendReceipt(e,lectureid);
  }catch(err){
  }finally{
    lock.releaseLock();//次の送信のためにロック解除
  }
}
function sendReceipt(e,lectureid){
  var itemResponses = e.response.getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var question = itemResponses[i].getItem().getTitle();
    var answer = itemResponses[i].getResponse();
    if (question == 'お名前') var userName = answer;
    if (question == '人数') var userCount = answer;
  }
  var userMail=e.response.getRespondentEmail();
  var customer={
    address:userMail,
    name:userName,
    count:userCount,
    timestamp:new Date()
  }
  GmailApp.sendEmail(userMail, sender.mailSubject(customer,lectureid), sender.mailBody(customer,lectureid),sender.senderInfo());
  sender.writeSignature(customer, lectureid);
}
