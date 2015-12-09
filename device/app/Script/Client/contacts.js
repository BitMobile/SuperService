

function DoBackAndClean(){	
	Workflow.Back();
	//DB.Rollback();
}

function GetEventDetails() {


function GetAllsActiveContact() {

function GetExecutedContact(event) {
	var query = new Query("SELECT Id, FIO, Tel FROM Catalog_Client_Contact");
//		var query = new Query("select * from Document_Event_Equipments WHERE Ref = @ref AND  Result = @result");


	q.Text = queryText;
	//query.AddParameter("result", "Done");

//Dialog.Debug(event);

	return query.Execute();
}


function actionDoSelect(p){
	Vars.setClient(p);
	Workflow.Action("DoSelect",[]);
}