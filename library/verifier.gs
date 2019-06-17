var thisurl="";
function doGet(e) {
  var sign=e.parameter['id'];
  if(sign==undefined){
    var template=HtmlService.createTemplateFromFile('verifying');
    template.url=thisurl;
    return(template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1').setTitle('講演会予約確認 | 東京大学医学部五月祭企画').setFaviconUrl('https://utmed-mayfes.net/img/menulogo.png'))
  }
  else{
    var customer=isValidSignature(sign)
    var template=HtmlService.createTemplateFromFile('message');
    if(customer){
    　var template=HtmlService.createTemplateFromFile('verified');
      template.url=thisurl;
      template.id=customer.data[0];
      template.lecturer=customer.data[1];
      template.timestamp=customer.data[2];
      template.email=customer.data[3];
      template.name=customer.data[4];
      template.count=customer.data[5];
      return(template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1').setTitle('講演会予約確認 | 東京大学医学部五月祭企画').setFaviconUrl('https://utmed-mayfes.net/img/menulogo.png'));
    }
     {
      var template=HtmlService.createTemplateFromFile('message');
      template.url=thisurl;
      template.message='確認に失敗しました';
      return(template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1').setTitle('講演会予約確認 | 東京大学医学部五月祭企画').setFaviconUrl('https://utmed-mayfes.net/img/menulogo.png'))
    }
  }
}
function doPost(e) {
  return(doGet(e));
}
