function DoBackAndClean(){
	Workflow.Back();
	//DB.Rollback();
}

function GetAndSetStartTime(event){
	//Dialog.Message(event);
	var obj = event.GetObject();
	//Dialog.Message(obj.ActualStartDate);
	if (obj.ActualStartDate == '01.01.0001 0:00:00') {
		obj.ActualStartDate = DateTime.Now;
		obj.Save();
	}
	//Dialog.Message(ActualStartDate);
}

function FixDateTimeAndCoord(){
	//$.StartVisit.Visible = false;
	$.dataSyncLayout.Visible = true;
	$.dataSyncIndicator.Start();
	var event = Vars.getEvent();
	eventInObj = event.GetObject();
		eventInObj.ActualStartDate = DateTime.Now;
		var location = GPS.CurrentLocation;
		if(ActualLocation(location)) {
				eventInObj.Latitude = location.Latitude;
				eventInObj.Longitude = location.Longitude;
				//eventInObj.Save(false);
				//$.Coordinats = location.Latitude + "; " + location.Longitude;
				//Workflow.Refresh([param1]);
		} else {
			//Dialog.Message("Не удалось получить координаты.");
		}
		eventInObj.Save(false);
		DB.Save();
		DB.Sync(SyncDataFinish);

//
}
function SyncDataFinish(state) {
	$.dataSyncIndicator.Stop();
		Workflow.Refresh([]);
				//$.ftpSyncIndicator.Stop();
	//Dialog.Message(state);
}
function DoActionAndSave(step, req, cust, outlet) {

}

function DoNextStep(param){
		GetAndSetStartTime(param);
		if ($.MobileSettings.UsedCalculate){
			DoAction("calculate", param);
			return;
		}

		if ($.MobileSettings.UsedEquipment){
			DoAction("tasks", param);
			return;
		}

		if ($.MobileSettings.UsedCheckLists){
			var q = new Query("SELECT DEC.Id " +
		                "FROM Document_Event_CheckList DEC " +
		                "WHERE DEC.Ref = @event")
			q.AddParameter("event", param);
			if (q.ExecuteCount() > 0) {
				DoAction("checklist", param);
			} else {
				DoAction("Total", param);	}
			return;
		}

		DoAction("Total", param);
}

// # Begin Parameters

function GetEventParams(custRef) {
  var q = new Query("SELECT DEP.Id AS Id, CEO.EditingBMA AS Editing, CEO.Id AS ParamRef, CEO.Description AS Parameter, " +
	"DEP.Val AS Val, ETDP.Name AS Type, length(trim(DEP.Val)) AS VL " +
  "FROM Document_Event_Parameters DEP " +
  "LEFT JOIN Catalog_EventOptions CEO " +
  "ON DEP.Parameter = CEO.Id  " +
  "LEFT JOIN Enum_TypesDataParameters ETDP " +
  "ON CEO.DataTypeParameter = ETDP.ID " +
  "WHERE CEO.DisplayingBMA = 1 AND DEP.Ref = @custRef AND (VL > 0 OR Editing = 1) AND CEO.DeletionMark = 0 " +
	"ORDER BY DEP.LineNumber");

  q.AddParameter("custRef", custRef);
  return q.Execute();
}

// # End Parameters


function GetEventDetails() {
	return Vars.getEvent();
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

function setCoordinats(sender, outlet, param1){
	var location = GPS.CurrentLocation;
	if(ActualLocation(location)) {
	    var objOutlet = outlet.GetObject();
	    objOutlet.Latitude = location.Latitude;
	    objOutlet.Longitude = location.Longitude;
	    objOutlet.Save(false);
	    $.Coordinats = location.Latitude + "; " + location.Longitude;
	    Workflow.Refresh([param1]);
	} else {
		Dialog.Message("Не удалось получить координаты.");
	}
}

function updateCoordinats(outlet, param1) {
	Dialog.Choose("Координаты", [["update", "#Refresh#"],["copy", "#Copy#"], ["cut", "#delete#"]] , coordinatsCallBack, [outlet, param1]);
}

function coordinatsCallBack(state, args){
	var obj = state[0].GetObject();
	var location = GPS.CurrentLocation;

	if (args.Result == "update") {
		if(ActualLocation(location)) {
		obj.Latitude = location.Latitude;
		obj.Longitude = location.Longitude;
		obj.Save(false);
		Workflow.Refresh([state[1]]);
		} else {
			Dialog.Message("Не удалось получить координаты.");
		}
	}

	if (args.Result == "copy") {
		Clipboard.SetString(obj.Latitude + "; " + obj.Longitude);
	}

	if (args.Result == "cut") {
		obj.Latitude = 0;
		obj.Longitude = 0;
		obj.Save(false);
		Workflow.Refresh([state[1]]);
	}
}

function ShowClient(p){
	Vars.setClient(p);
	Workflow.Action("showClient",[]);
}
