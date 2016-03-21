var summaryScreenIndex = 1;
var leadScreenIndex = 0;
var entered = false;
var sendingRequest;

// ------------------------ Main screen module ------------------------

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

//----------------Begin Info Block Visit---------------------------------
function GetToDayDoneRequestCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query("SELECT DE.id FROM Document_Event DE WHERE DE.ActualEndDate >= @DateStart AND DE.ActualEndDate <= @DateEnd AND DE.Status = @StatusEx");

	//q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.StatusyEvents.Done);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	return q.ExecuteCount();

}

function GetToDayUnDoneRequestsCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query("SELECT DE.id FROM Document_Event DE WHERE DE.StartDatePlan >= @DateStart AND DE.StartDatePlan < @DateEnd AND DE.Status == @StatusComp");
	q.AddParameter("StatusComp",  DB.Current.Constant.StatusyEvents.Appointed);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	return q.ExecuteCount();
}

function GetToMonthDoneRequestsCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query("SELECT DE.id FROM Document_Event DE WHERE DE.ActualEndDate >= datetime('now', 'start of month') AND DE.ActualEndDate <= datetime('now', 'start of month', '+1 months') AND DE.Status = @StatusEx");

	//q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.StatusyEvents.Done);
	return q.ExecuteCount();
}

function GetToMonthUnDoneRequestCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query("SELECT DE.id FROM Document_Event DE WHERE DE.StartDatePlan >= datetime('now', 'start of month') AND DE.StartDatePlan < datetime('now', 'start of month', '+1 months') AND DE.Status == @StatusComp");
	q.AddParameter("StatusComp",  DB.Current.Constant.StatusyEvents.Appointed);
	return q.ExecuteCount();
}




function GetBeginOfCurrentMonth(){
	var mth = "";
	if (DateTime.Now.Month < 10){
		mth = "0"+ DateTime.Now.Month;
	} else {
		mth = DateTime.Now.Month;
	}
	return "01." + mth + "." + DateTime.Now.Year + " 00:00:00";
}

function GetEndOfCurrentMonth(){
	var mth = "";
	if (DateTime.Now.Month < 10){
		mth = "0"+ DateTime.Now.Month;
	} else {
		mth = DateTime.Now.Month;
	}
	return DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month) + "." + mth + "." + DateTime.Now.Year + " 00:00:00";
}
//----------------End Info Block Visit---------------------------------

// Begin lead generation
function IsDemoUser() {
var userRef = $.common.UserRef;
var username = userRef.UserName;
var password = userRef.Password;
return username == 'demo' && password == 'demo';
}

function SetContactsSentFlag() {
var q = new Query("CREATE TABLE IF NOT EXISTS USR_ContactsSent  (" +
"ID INT PRIMARY KEY NOT NULL)");
q.Execute();
}

function GetContactsSentFlag() {
var q = new Query("SELECT name FROM sqlite_master " +
  "WHERE type='table' AND name='USR_ContactsSent'");
var ContactsSent = q.ExecuteCount() == 1;
return ContactsSent;
}

function SendContactsRequest(registered, callback) {
var headers = [];
headers.push(["registered", registered]);
headers.push(["regdate", DateTime.Now]);
headers.push(["name", $.FullName.Text]);
headers.push(["phone", $.Phone.Text]);
headers.push(["os", $.common.OS]);
//SendRequest("http://192.168.104.24", "/SUPS/hs/DemoAccess", "demoaccess", "password", "00:00:10", headers, callback); //develop
SendRequest("http://demo.superagent.ru/", "/SuperService_Demo/hs/DemoAccess", "demoaccess", "password", "00:00:10", headers, callback); //prod
}

function SendRequest(host, address, username, password, timeout, headers, callback) {
headers = (headers == undefined ? [] : headers);
callback = (callback == undefined ? Dummy : callback);

var request = Web.Request();
request.Host = host;
request.UserName = username;
request.Password = password;
request.Timeout = timeout;

for (var i = 0; i < headers.length; i++) {
  request.AddHeader(headers[i][0], headers[i][1]);
}

request.Post(address, "", callback);
}

function RegisterSuccess() {
SetContactsSentFlag();
GoToSummary();
Dialog.Message(Translate["#leadThanks#"]);
}

function SendMail() {
Email.Create(Translate["#leadMail#"], "", "");
}

function Call() {
Phone.Call(Translate["#leadPhone#"]);
}

function Register() {
	if (!sendingRequest) {
		if (IsFilledCorrectly()) {
			$.btnRegister.CssClass = "register_button_blocked";
			$.btnRegister.Text = Translate["#sending#"];
			$.btnEnterUnregistered.CssClass = "enter_button_blocked";
			$.FullName.CssClass = "edittext_blocked";
			$.Phone.CssClass = "edittext_blocked";
			$.btnRegister.Refresh();
			$.FullName.Enabled = false;
			$.Phone.Enabled = false;
			sendingRequest = true;

			SendContactsRequest(true, RegisterCallback);
		} else {
			Dialog.Message(Translate["#leadFillDataPlease#"]);
		}
	}
}

function RegisterCallback(state, args) {
if (args.Success) {
  RegisterSuccess();
} else {
  Dialog.Message(Translate["#leadFail#"]);
}
$.btnRegister.CssClass = "register_button";
$.btnRegister.Text = Translate["#register#"];
$.btnEnterUnregistered.CssClass = "enter_button";
$.FullName.CssClass = "lead_field";
$.Phone.CssClass = "lead_field";
$.FullName.Enabled = true;
$.Phone.Enabled = true;
$.btnRegister.Refresh();
sendingRequest = false;
}

function EnterUnregistered() {
	if (!sendingRequest) {
		SendContactsRequest(false);
		GoToSummary();
		entered = true;
	}
}

function IsFilledCorrectly() {
	var IsNameFilled = $.FullName.Text != "" && $.FullName.Text != null;
	var IsPhoneFilled = $.Phone.Text != "" && $.Phone.Text != null;
	return IsNameFilled && IsPhoneFilled;
}

function GoToSummary() {
	$.swipe_vl.Index = summaryScreenIndex;
}

function crutch(sender) {
// if (sender.Id == "FullName") {
// 	if (Right(sender.Text, 1) == "\n") {
// 		$.FullName.Text = StrReplace($.FullName.Text, "\n", "");
// 	}
// } else if (sender.Id == "Phone") {
// 	if (Right(sender.Text, 1) == "\n") {
// 		$.Phone.Text = StrReplace($.Phone.Text, "\n", "");
// 	}
// }
if (Right(sender.Text, 1) == "\n") {
  sender.Text = StrReplace(sender.Text, "\n", "");
  if (sender.Id == "FullName") {
    $.Phone.SetFocus();
  } else if (sender.Id == "Phone") {
    sender.Enabled = false;
    $.Phone.Refresh();
    sender.Enabled = true;
  }
}
}

function Dummy() {

}
// End lead generation
