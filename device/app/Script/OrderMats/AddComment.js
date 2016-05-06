var ref;
function OnLoad(){
  Vars.setNextAdd(true);
  ref = Vars.getOrderMat();
  $.RemindComment.Text = ref.SRComment;
}
function actionDoSelect(){
  obj = ref.GetObject();
  if (!IsNullOrEmpty($.RemindComment.Text)){
    if (StrLen($.RemindComment.Text) > 1000) {
      Dialog.Message(Translate["#ToLongText1000#"]  + " " +  StrLen($.RemindComment.Text));
      return;
    }
  }else {
    obj.SRComment = $.RemindComment.Text;
    obj.Save();
    DoBack();
  }
}
