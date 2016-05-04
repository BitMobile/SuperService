var ref;
function OnLoad(){
  Vars.setNextAdd(true);
  ref = Vars.getOrderMat();
  $.RemindComment.Text = ref.SRComment;
}
function actionDoSelect(){
  obj = ref.GetObject();
  obj.SRComment = $.RemindComment.Text;
  obj.Save();
  DoBack();
}
