var ref;
function OnLoading(){
  var EditTrue = Vars.getOrderMatEnable();
  if (!EditTrue) {
    var OrderMat = DB.Create("Document.NeedMat");
    OrderMat.Date = DateTime.Now;
    var q1 = new Query("Select Id FROM Enum_StatsNeedNum WHERE Name = 'New'");
    OrderMat.StatsNeed = q1.ExecuteScalar();
    var q2 = new Query("Select Id From Catalog_User Where UserName <> 'Admin'");
    OrderMat.SR = q2.ExecuteScalar();
    OrderMat.DeletionMark = 0;
    OrderMat.DocIn = Vars.getEvent();
    OrderMat.Save();
    ref = OrderMat.Id;
}
//DoCommit();
}
function OnLoad(){
// GetOrderMatDetails();
}
function GetAllMat(){
  //Dialog.Message(ref);
  var q1 = new Query("SELECT IT.SKU AS Matireals, IT.Count AS Count FROM Document_NeedMat_Matireals IT Where IT.Ref = @Ref");
  q1.AddParameter("Ref",ref);
  return q1.Execute();
}
function actionDoSelect(){
	Vars.setOrderMat(ref,true);
	Workflow.Action("AddOrderMat",[]);
}
function ActionDoCommit(){
  if($.workflow.name="Event")
  {
    Workflow.BackTo("calculate");
  }
  else {
  Vars.setOrderMat(null,false);
  DoCommit();
  }
}
