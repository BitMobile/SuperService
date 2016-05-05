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
    if (OrderMat.Number==null) {
      $.Description.Text = Translate["#NoNumber#"];
    }else {
      $.Description.Text = "#" + OrderMat.Number;
    }
    $.StatDesv.Text = OrderMat.StatsNeed.Description;

    $.DateDesv.Text = GetDateString(OrderMat.Date);
    //Dialog.Message(OrderMat.StatsNeed.Name);


  }

}
function GetStatStyle()
{
  var OrderMat = Vars.getOrderMat();
  if (OrderMat.StatsNeed.Name=="New") {
    return "main_row_green_stat";
  }
  if (OrderMat.StatsNeed.Name=="Done") {
    return "main_row_blue_stat";
  }
  if (OrderMat.StatsNeed.Name=="Confirmed") {
    return "main_row_yelow_stat";
  }
  if (OrderMat.StatsNeed.Name=="Cancel") {
    return "main_row_red_stat";
  }
}
function PostCountAndUnit(OrderMat){
  return OrderMat.Count + " " + OrderMat.Matireals.Unit;
}
function GetAllMat(){
  var ref = Vars.getOrderMat();
  //Dialog.Message(ref);
  var q1 = new Query("SELECT IT.SKU AS Matireals, IT.Count AS Count FROM Document_NeedMat_Matireals IT Where IT.Ref = @Ref");
  q1.AddParameter("Ref",ref);
  return q1.Execute();
}
