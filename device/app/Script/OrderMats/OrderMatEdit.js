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
function CreateOMat(){
  var OrderMat = DB.Create("Document.NeedMat");
  OrderMat.Date = DateTime.Now;
  if ($.workflow.name == "Event") {
    OrderMat.DocIn = Vars.getEvent();
  }
  var q1 = new Query("Select Id FROM Enum_StatsNeedNum WHERE Name = 'New'");
  OrderMat.StatsNeed = q1.ExecuteScalar();
  var q2 = new Query("Select Id From Catalog_User Where UserName <> 'Admin'");
  OrderMat.SR = q2.ExecuteScalar();
  OrderMat.FillFull = 0;
  OrderMat.DeletionMark = 0;
  OrderMat.Save();
  ref = OrderMat.Id;
}
function OnLoad(){
  if (Vars.getNextAdd()) {
  }else{
    Dialog.Ask("#AskFill#", FillOnNorm, ref);
  }
}
function FillOnNorm(state, args){
  state = state.GetObject();
  state.FillFull = 1;
  state.Save();
  ActionDoCommit();
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

  if($.workflow.name == "Event")
  {
    Workflow.BackTo("calculate");
  }else{
    Vars.setOrderMat(null,false);
    DoCommit();
  }
//  Dialog.Message($.workflow.name);
}
