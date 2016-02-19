function OnLoading(){
$.Add("clientRef", Vars.getClient());
}

function OnLoad(){
 GetClientDetails();
}

function DoBackAndClean(){
	Workflow.Back();
	//DB.Rollback();
}

function DoActionAndSave(step, req, cust, outlet) {

}

// # Begin Parameters

// function GetSnapShotPath(fileName) {
//   var q = new Query("SELECT FullFileName" +
//                     " FROM Catalog_Client_Files" +
//                     " WHERE FileName == @fn");
//
//   q.AddParameter("fn", fileName);
//   return q.ExecuteScalar();
// }

function GetCustParams(custRef) {
  var q = new Query("SELECT CCP.Id AS Id, CCO.EditingBMA AS Editing, CCO.Id AS ParamRef, CCO.Description AS Parameter, CCP.Val AS Val, " +
  "ETDP.Name AS Type, length(trim(CCP.Val)) AS VL " +
  "FROM Catalog_Client_Parameters CCP " +
  "LEFT JOIN Catalog_ClientOptions CCO " +
  "ON CCP.Parameter = CCO.Id  " +
  "LEFT JOIN Enum_TypesDataParameters ETDP " +
  "ON CCO.DataTypeParameter = ETDP.ID " +
  "WHERE CCO.DisplayingBMA = 1 AND CCP.Ref = @custRef AND (VL > 0 OR Editing = 1) AND CCO.DeletionMark = 0 " +
	"ORDER BY CCP.LineNumber");

  q.AddParameter("custRef", custRef);
  return q.Execute();
}

// # End Parameters

function GetClientDetails() {
	var client = Vars.getClient();

	$.Description.Text = client.Description;
  $.Address.Text = client.Address;

}

function GetAllsActiveTask() {
	var q = new Query();

	var queryText = "SELECT Id, Description, Address" +
		" FROM Catalog_Client";


	q.Text = queryText;
	//q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);

	//Dialog.Debug("now");
	return q.Execute().Unload();
}

function PhoneExists(call) {
	if (IsNullOrEmpty(call)){
		return false;
	} else {
		return true;
	}
}



function MoreMakeContactCall(tel){
	Dialog.Question("#call# "+ tel + "?", PhoneCall, tel);
}

function PhoneCall(answ, tel){
	if (answ == DialogResult.Yes) {
		Phone.Call(tel);
	}
}
