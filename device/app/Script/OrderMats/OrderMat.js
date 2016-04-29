function OnLoading(){
$.Add("OrderMatRef", Vars.getOrderMat());
}
function OnLoad(){
 GetOrderMatDetails();
}
function GetOrderMatDetails() {
	var OrderMat = Vars.getOrderMat();
  var EditTrue = Vars.getOrderMatEnable();
  if (EditTrue) {

  } else {
    $.Description.Text = "#" + OrderMat.Number;
    $.StatDesv.Text = OrderMat.StatsNeed.Description;
  }

}
function GetAllMat(){
  var ref = Vars.getOrderMat();
  //Dialog.Message(ref);
  var q1 = new Query("SELECT IT.SKU AS Matireals, IT.Count AS Count FROM Document_NeedMat_Matireals IT Where IT.Ref = @Ref");
  q1.AddParameter("Ref",ref);
  return q1.Execute();
}
