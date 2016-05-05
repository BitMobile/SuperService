var ref;
function OnLoading(){
  var EditTrue = Vars.getOrderMatEnable();
  if (!EditTrue) {
    if ($.workflow.name == "Event") {
    var qev = new Query("SELECT Id FROM Document_NeedMat WHERE DocIn = @Eve AND DocIn <> '@ref[Document_Event]:00000000-0000-0000-0000-000000000000'");
    qev.AddParameter("Eve",Vars.getEvent());
      if (qev.ExecuteCount()==0) {
        CreateOMat();
      }else{
        ref = qev.ExecuteScalar();
        var obj = ref.GetObject();
        obj.FillFull = 0;
        obj.Save();
      }
    }
    else {
      CreateOMat();
    }
  }
//DoCommit();
}
function ActionDoBack(){
  var obj = ref.GetObject();
  var q = new Query("SELECT OM.SKU As SKU FROM Document_NeedMat_Matireals OM LEFT JOIN Document_NeedMat DM ON OM.Ref = DM.Id WHERE DM.ID = @reford");
  q.AddParameter("reford",ref);
  var emptyOrd = q.ExecuteCount();
  if (emptyOrd==0 && ref.FillFull == 0) {
    DB.Delete(ref);
  }
  else {
    obj.Save();
  }

  if($.workflow.name == "Event")
  {
    Vars.setOrderMat(null,false);
    Workflow.BackTo("calculate");
  }else{
    Vars.setOrderMat(null,false);
    DoBack();
  }
}
function PostCountAndUnit(OrderMat){
  return OrderMat.Count + " " + OrderMat.Matireals.Unit;
}
function CreateOMat(){
  var OrderMat = DB.Create("Document.NeedMat");
  OrderMat.Date = DateTime.Now;
  if ($.workflow.name == "Event") {
    OrderMat.DocIn = Vars.getEvent();
  }
  var q1 = new Query("Select Id FROM Enum_StatsNeedNum WHERE Name = 'New'");
  OrderMat.StatsNeed = q1.ExecuteScalar();
  //var q2 = new Query("Select Id From Catalog_User Where Role <> 'Admin' AND UserName <> 'demo'");
  OrderMat.SR = $.common.UserRef;
  OrderMat.FillFull = 0;
  OrderMat.DeletionMark = 0;
  OrderMat.Save();
  ref = OrderMat.Id;
  Vars.setOrderMat(ref,true);
}
function OnLoad(){
  if (Vars.getFill()) {
    Vars.setFill(false);
    Dialog.Ask("#AskFill#", FillOnNorm, ref,ActionDoBack);
  }
}
function FillOnNorm(state, args){
  var obj = state.GetObject();
  obj.FillFull = 1;
  obj.Save();
  ActionDoCommit();
}
function deleteSKU(sender,id) {
  DB.Delete(id);
  Workflow.Refresh([]);
}
function GetAllMat(){
  //Dialog.Message(ref);
  var q1 = new Query("SELECT IT.Id AS Id, IT.SKU AS Matireals, IT.Count AS Count FROM Document_NeedMat_Matireals IT Where IT.Ref = @Ref");
  q1.AddParameter("Ref",ref);
  return q1.Execute();
}
function actionDoSelect(){
	Workflow.Action("AddOrderMat",[]);
}
function ActionDoCommit(){
  var obj = ref.GetObject();
  var q = new Query("SELECT OM.SKU As SKU FROM Document_NeedMat_Matireals OM LEFT JOIN Document_NeedMat DM ON OM.Ref = DM.Id WHERE DM.ID = @reford");
  q.AddParameter("reford",ref);
  var emptyOrd = q.ExecuteCount();
  if (emptyOrd==0 && ref.FillFull == 0) {
    DB.Delete(ref);
  }else {
    obj.Save();
  }

  if($.workflow.name == "Event")
  {
    Vars.setOrderMat(null,false);
    Workflow.BackTo("calculate");
  }else{
    Vars.setOrderMat(null,false);
    DoCommit();
  }
//  Dialog.Message($.workflow.name);
}
