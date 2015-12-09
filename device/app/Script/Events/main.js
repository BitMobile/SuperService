function OnLoading(){
	SetListType();
	backupStartPeriod = recvStartPeriod;
	backupStopPeriod = recvStopPeriod;
}

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

function filterDateCaption(dt){
	if (dt != null){
		return String.Format("{0:dd.MM.yyyy}", DateTime.Parse(dt));
	} else {
		return "";
	}
}

function filterDate(dt){
	if (dt != null){
		return String.Format("{0:dd MMMM yyyy}", DateTime.Parse(dt));
	} else {
		return "";
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


function RollBackAndBack(){
	recvStartPeriod = backupStartPeriod;
	recvStopPeriod = backupStopPeriod;
	Workflow.Back();

}

function clearmyfilter(){
	$.beginDate.Text = "";
	recvStartPeriod = undefined;
	$.endDate.Text = "";
	recvStopPeriod = undefined;
}

function SetBeginDate() {
	var header = Translate["#enterDateTime#"];
	if(recvStartPeriod != undefined){
		Dialog.DateTime(header, recvStartPeriod, SetBeginDateNow);
	} else {
		Dialog.DateTime(header, SetBeginDateNow);
	}
}

function SetBeginDateNow(state, args) {
	$.beginDate.Text = filterDate(args.Result);
	recvStartPeriod = BegOfDay(args.Result);
	//Workflow.Refresh([]);
}

function SetEndDate() {
	var header = Translate["#enterDateTime#"];
	if(recvStopPeriod != undefined){
		Dialog.DateTime(header, recvStopPeriod, SetEndDateNow);
	} else {
		Dialog.DateTime(header, SetEndDateNow);
	}
}

function SetEndDateNow(state, args) {
	$.endDate.Text = filterDate(args.Result);
	recvStopPeriod = EndOfDay(args.Result);
	//Dialog.Debug(BegOfDay(key));
	//Workflow.Refresh([]);
}

function ClearFilter(){
	recvStartPeriod = "";
	recvStopPeriod = "";
	Workflow.Refresh([]);
}


function SetListType() {
    if ($.Exists("visitsType") == false)
        $.AddGlobal("visitsType", "planned");
    else
        return $.visitsType;
}

function ChangeListAndRefresh(control) {
    $.Remove("visitsType");
    $.AddGlobal("visitsType", control);
    Workflow.Refresh([]);
}

function GetTodaysActiveTask() {
	var q = new Query();

	var queryText = "SELECT DE.Id AS Id, CC.Description AS Description, strftime('%d.%m %H:%M', DE.StartDatePlan) AS StartTime, CC.Address AS Address" +
		" FROM Document_Event DE LEFT JOIN Catalog_Client CC ON DE.Client = CC.Id" +
		" WHERE DE.StartDatePlan >= @DateStart AND DE.StartDatePlan <= @DateEnd AND DE.Status = @StatusEx";

	if ($.Exists("searchToDay")) {
		var searchString = $.searchToDay;
		if (searchString != null && searchString != ""){
			var searchtail = " AND  (Contains(CC.Description, @SearchText) OR Contains(CC.Address , @SearchText))";
			q.AddParameter("SearchText", searchString);
			queryText = queryText + searchtail;
		}
	}
	q.Text = queryText;
	//q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.StatusyEvents.Appointed);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));

	return q.Execute().Unload();
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
	var queryText = "SELECT DE.Id AS Id, CC.Description AS Description, strftime('%d.%m %H:%M', DE.StartDatePlan) AS StartTime, CC.Address AS Address" +
		" FROM Document_Event DE LEFT JOIN Catalog_Client CC ON DE.Client = CC.Id" +
		" WHERE DE.Status = @StatusEx";

	if ($.Exists("searchAll")) {
		var searchString = $.searchAll;
		//	Dialog.Debug(searchString());
		if ($.searchAll != null && $.searchAll != ""){
			var searchtail = " AND  (Contains(CC.Description, @SearchText) OR Contains(CC.Address , @SearchText))";
			q.AddParameter("SearchText", searchString);
			queryText = queryText + searchtail;
		}
}

	if (!IsNullOrEmpty(recvStartPeriod)){
		var starttail = " AND DE.StartDatePlan >= @DateStart";//AND REQ.PlanStartDataTime < @DateEnd
		q.AddParameter("DateStart", recvStartPeriod);
		queryText = queryText + starttail;

	}

	if (!IsNullOrEmpty(recvStopPeriod)){
		var stoptail = " AND DE.StartDatePlan < @DateEnd";//AND REQ.PlanStartDataTime < @DateEnd
		q.AddParameter("DateEnd", recvStopPeriod);
		queryText = queryText + stoptail;
	}
	q.Text = queryText;
	//q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.StatusyEvents.Appointed);
	//Dialog.Debug("now");
	return q.Execute().Unload();
}

function actionDoSelect(p){
	Vars.setEvent(p);
	Workflow.Action("DoSelect",[]);
}
