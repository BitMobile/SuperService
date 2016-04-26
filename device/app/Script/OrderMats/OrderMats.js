var recvStartPeriod;
var recvStopPeriod;
function OnLoading(){
	backupStartPeriod = recvStartPeriod;
	backupStopPeriod = recvStopPeriod;
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

function GetAllOrderMat(){

var q = new Query("SELECT Ord.Id As IdT, strftime('%d/%m/%Y',Ord.Date) AS Date, Ord.Number As Number,Ord.StatsNeed As Status FROM Document_NeedMat Ord WHERE DeletionMark = 0 ");
if (!IsNullOrEmpty(recvStartPeriod)) {
q.Text = q.Text + "AND Date > @recvStartPeriod ";
q.AddParameter("recvStartPeriod",recvStartPeriod);
}
if (!IsNullOrEmpty(recvStopPeriod)) {
q.Text = q.Text + "AND Date < @recvStopPeriod ";
q.AddParameter("recvStopPeriod",recvStopPeriod);
}
q.Text = q.Text + "ORDER BY Date"
return q.Execute();
}
function ConvertEmptyDate(date) {
	if (date == "01.01 00:00") {
		return Translate["#NoDate#"];
	} else {
		return date;
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
function GetNumberOfMat(ordermatid){
	var q = new Query("SELECT Mat.Id FROM Document_NeedMat_Matireals Mat WHERE Ref = @OrdId");
	q.AddParameter("OrdId",ordermatid);
	var strans = q.ExecuteCount();
	var strplus = "";
	if (strans == 1) {
		strplus = " материал";
	}
	if (strans > 1 & strans < 5) {
		strplus = " материала";
	}
	if (strans > 4) {
		strplus = " материалов";
	}
	strans = strans + strplus;
	return strans;
}
function actionDoSelect(a,p){
	Vars.setOrderMat(p);
	Workflow.Action("DoSelect",[]);
}
