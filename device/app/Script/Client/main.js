

function CloseMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}

function OpenMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}


function MakeFilterSettingsBackUp(){

	if ($.Exists("BUFilterCopy") == true){
		$.Remove("BUFilterCopy");
		$.Add("BUFilterCopy", new Dictionary());
		$.BUFilterCopy.Add("Start", recvStartPeriod);
		$.BUFilterCopy.Add("Stop", recvStopPeriod);
	} else {
		$.Add("BUFilterCopy", new Dictionary());
		$.BUFilterCopy.Add("Start", recvStartPeriod);
		$.BUFilterCopy.Add("Stop", recvStopPeriod);
	}

}

function getGlobalStart(){
	return Vars.getRecvStartPeriod();
}


function getGlobalStop(){
	return Vars.getRecvStartPeriod();
}

function RollBackAndBack(){
	Vars.setRecvStartPeriod($.BUFilterCopy.Start);
	Vars.setRecvStopPeriod($.BUFilterCopy.Stop);
	Workflow.Back();

}





function findtodaytext(key){
	$.Remove("searchToDay");
	$.AddGlobal("searchToDay", key);
	Workflow.Refresh([]);
}

function findinalltext(key){
	$.Remove("searchAll");
	$.AddGlobal("searchAll", key);
	Workflow.Refresh([]);
}

function GetAllsActiveTask() {
	var q = new Query();

	var queryText = "SELECT Id, Description, Address" +
		" FROM Catalog_Client";

	if ($.Exists("searchAll")) {
		var searchString = $.searchAll;
		//	Dialog.Debug(searchString());
		if ($.searchAll != null && $.searchAll != ""){
			var searchtail = " WHERE  (Contains(Description, @SearchText) OR Contains(Address , @SearchText))";
			q.AddParameter("SearchText", searchString);
			queryText = queryText + searchtail;
		}
		//Dialog.Debug(recvStartPeriod());
	//	Dialog.Debug(recvStartPeriod());
	//	Dialog.Debug(Vars.getRecvStopPeriod());


	}
	q.Text = queryText;
	//q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);

	//Dialog.Debug("now");
	return q.Execute().Unload();
}

function actionDoSelect(p){
	Vars.setClient(p);
	Workflow.Action("DoSelect",[]);
}
