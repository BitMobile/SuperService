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
