function OnLoad() {
    CanForward($.param1);
}

function DoNext(param) {
  if (CanForward($.param1)){
    DoAction("Total", param);
  }
}

function GetCheckList(event){
    var q = new Query("SELECT CA. Description AS Desc, " +
                      "ETDP.Name AS AType, " +
                      "MAX(DEC.Required) AS Req, " +
                      "DEC.Result, " +
                      "DEC.Action Action " +
                      "FROM Document_Event_CheckList DEC " +
                      "LEFT JOIN Catalog_Actions CA " +
                      "ON DEC.Action = CA.Id " +
                      "LEFT JOIN Enum_TypesDataParameters ETDP " +
                      "ON DEC.ActionType = ETDP.Id " +
                      "WHERE DEC.Ref = @event " +
                      "GROUP BY CA.Description, ETDP.Name, DEC.Action, DEC.Result " +
                      "ORDER BY DEC.LineNumber");

    q.AddParameter("event", event);

    return q.Execute();
}

function CanForward(event){
  var q = new Query("SELECT length(trim(DEC.Result)) AS Res, DEC.Required AS Req " +
                "FROM Document_Event_CheckList DEC " +
                "WHERE DEC.Ref = @event AND DEC.Required = 1 " +
                "AND Res = 0");
  q.AddParameter("event", event);
  var cnt =  q.ExecuteCount();

  if (cnt == 0) {
    $.nextButton.Refresh();
    $.nextButton.CssClass = "forward_orange";
    $.nextButton.Refresh();
    $.nextButton.Text = Translate["#next#"];
    return true;
  } else {
    $.nextButton.Refresh();
    $.nextButton.CssClass = "forward_gray";
    $.nextButton.Refresh();
    $.nextButton.Text = Translate["#next#"] + " (" + cnt + ")";
    return false;
  }

}



function CanForwardRefresh(event){
  var q = new Query("SELECT length(trim(DEC.Result)) AS Res, DEC.Required AS Req " +
                "FROM Document_Event_CheckList DEC " +
                "WHERE DEC.Ref = @event AND DEC.Required = 1 " +
                "AND Res = 0");
  q.AddParameter("event", event);
  var cnt =  q.ExecuteCount();

  if (cnt == 0) {
    return true;
  } else {
    return false;
  }
}

function getStatusStyle(res){
  if (!IsNullOrEmpty(res)){
    return "green_mark";
  } else {
    return "red_mark";
  }
}

function GetBooleanDialog(sender, event, control, act, actText, index, req){
    var arr = [];
    arr.push([true, Translate["#Yes#"]]);
    arr.push([false, Translate["#No#"]]);

    Dialog.Choose(actText, arr, SetBooleanValue, [event, control, act, actText, index, sender, req]);
}

function SetBooleanValue(state, args){
    var res = undefined;
    if (args.Result) {
      res = Translate["#Yes#"];
    } else {
      res = Translate["#No#"];
    }

    SetForAllActions(state[0],state[2], res, state[4]);
    Variables[state[1]].Text = res;
    OnChangeField(state[5], state[0], state[4], state[6])
}

function GetValueListDialog(sender, event, control, act, actText, index, req){
    var arr = [];
    var q = new Query("SELECT Val, Val FROM Catalog_Actions_ValueList WHERE Ref = @action");
    q.AddParameter("action", act);
    Dialog.Choose(actText, q.Execute(), SetValueListValue, [event, control, act, actText, index, sender, req]);
}

function SetValueListValue(state, args){

    SetForAllActions(state[0],state[2], args.Result, state[4]);
    Variables[state[1]].Text = args.Result;
    OnChangeField(state[5], state[0], state[4], state[6])
}


function GetDateDialog(sender, event, control, act, actText, curRes, index, req){
    if (IsNullOrEmpty(curRes)){
      Dialog.DateTime(actText, SetDateValue, [event, control, act, actText, index, sender, req]);
    } else {
      Dialog.DateTime(actText, Date(curRes), SetDateValue, [event, control, act, actText, index, sender, req]);
    }

}

function SetDateValue(state, args){
    SetForAllActions(state[0], state[2], args.Result, state[4]);
    Variables[state[1]].Text = Format("{0:dd.MM.yyyy HH:mm}", args.Result);
    OnChangeField(state[5], state[0], state[4], state[6])
}

function SetStringValue(sender, event, act, index){
    if (StrLen(sender.Text) > 200) {
      Dialog.Message(Translate["#ToLongText200#"] + " " + StrLen(sender.Text));
      sender.SetFocus();
      return;
    }

    SetForAllActions(event, act, sender.Text, index);
}

function SetIntegerValue(sender, event, act, index){
    if (!validate(sender.Text, "[0-9]*")){
        Dialog.Message(Translate["#OnlyInteger#"]);
        sender.SetFocus();
        return;
    }

    if (StrLen(sender.Text) > 200) {
      Dialog.Message(Translate["#ToLongText200#"] + " " + StrLen(sender.Text));
      Variables[control].SetFocus();
      return;
    }

    SetForAllActions(event, act, sender.Text, index);
}

function SetDecimalValue(sender, event, act, index){
    if (StrLen(sender.Text) > 200) {
      Dialog.Message(Translate["#ToLongText200#"] + " " + StrLen(sender.Text));
      sender.SetFocus();
      return;
    }

    SetForAllActions(event, act, sender.Text, index);
}

function SetForAllActions(event, act, result, index) {
  var q = new Query("SELECT DEC.Id AS Id, DEC.Required AS Req FROM Document_Event_CheckList DEC WHERE DEC.Ref = @event AND DEC.Action = @action");

  q.AddParameter("event", event);
  q.AddParameter("action", act);

  var res = q.Execute();

  while (res.Next()) {
      obj = res.Id.GetObject();
      obj.Result = result;
      obj.Save(false);

  }

}

function OnChangeField(sender, event, index, req) {
  if (req){
    if (IsNullOrEmpty(sender.Text)){
      Variables["marker" + index].CssClass = "red_mark";
      Variables["marker" + index].Refresh();
    } else {
      Variables["marker" + index].CssClass = "green_mark";
      Variables["marker" + index].Refresh();
    }
  }
  CanForward(event);
}

function FormatDate(datetime) {
	return String.IsNullOrEmpty(datetime) ? "—" : Format("{0:dd.MM.yyyy HH:mm}", Date(datetime));
}

function AddSnapshot(sender, objectRef, eqRef) { // optional: title, path
		var listChoice = new List;
		if ($.MobileSettings.AllowGalery) {
      listChoice.Add([1, Translate["#makeSnapshot#"]]);
			listChoice.Add([0, Translate["#addFromGallery#"]]);
      Dialog.Choose(Translate["#snapshot#"], listChoice, AddSnapshotHandler, [objectRef, eqRef]);
    } else {
      MakeSnapshot(objectRef, eqRef);
    }
		//listChoice.Add([0, Translate["#addFromGallery#"]]);


}

function AddSnapshotHandler(state, args) {
	var objRef = state[0];
	var eqRef = state[1];
  var desc = state[2];


	if (parseInt(args.Result)==parseInt(0)){ 	//Gallery answer
		ChooseFromGallery(objRef, eqRef);
	}

	if (parseInt(args.Result)==parseInt(1)){ 	//SnapshotAnswer
		MakeSnapshot(objRef, eqRef);
	}

}

function ChooseFromGallery(objRef, eqRef) {
	FileSystem.CreateDirectory(String.Format("/private/{0}", GetParentFolderName(objRef)));

	var pictId = Global.GenerateGuid();
	var path = GetPrivateImagePath(objRef, pictId, ".jpg");
	Gallery.Size = $.MobileSettings.PictureSize;

	Gallery.Copy(path, SaveImage, [objRef, eqRef, pictId]);
}

function MakeSnapshot(objRef, eqRef) {
	FileSystem.CreateDirectory(String.Format("/private/{0}", GetParentFolderName(objRef)));

	var pictId = Global.GenerateGuid();
	var path = GetPrivateImagePath(objRef, pictId, ".jpg");
	Camera.Size = $.MobileSettings.PictureSize;

	Camera.Path = path;
	Camera.MakeSnapshot(path, $.MobileSettings.PictureSize, SaveImage, [objRef, eqRef, pictId]);
}

function GetSharedImagePath(objectID, pictID, pictExt) {
	var objectType = GetParentFolderName(objectID);
	var r = "/shared/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + pictExt;
	return r;
}

function GetPrivateImagePath(objectID, pictID, pictExt) {
	var objectType = GetParentFolderName(objectID);
	var r = "/private/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + pictExt;
	return r;
}

function GetPrivateImage(objectID, pictID) {
	var objectType = GetParentFolderName(objectID);
	var r = "/private/" + objectType + "/" + objectID.Id.ToString() + "/"
    + pictID + ".jpg";
	return r;
}

function GetParentFolderName(entityRef) {
	var folder;

	if (getType(entityRef.Ref) == "System.String")
		folder = entityRef.Metadata().TableName;
	else{
		folder = entityRef.Ref.Metadata().TableName;
	}
	folder = StrReplace(folder, "_", ".");
	folder = Lower(folder);

	return folder;
}

function SaveImage(state, args){
		if (args.Result){
      SetForAllActions(state[0],state[1], state[2]);
      Workflow.Refresh([$.param1]);

		}
}

function isSnapShotInEventExists(s){
		if (!IsNullOrEmpty(s)) {
			return true;
		} else {
			return false;
		}
}

function GetSnapShots(event, eq) {
		var q = new Query("Select DEP.Id, DEP.UIDPhoto From Document_Event_Photos DEP WHERE DEP.Ref == @event AND DEP.Equipment == @eq");
		q.AddParameter("event", event);
		q.AddParameter("eq", eq);

		return q.Execute();
}

// function SnapshotExists(event, pictname) {
// 		// var q = new Query("Select DEP.UIDPhoto From Document_Event_Photos DEP WHERE DEP.Ref == @event AND DEP.Equipment == @eq AND DEP.UIDPhoto == @pict");
// 		// q.AddParameter("event", event);
// 		// q.AddParameter("eq", eq);
// 		// q.AddParameter("pict", pictId);
// 		// var filename = q.ExecuteScalar();
// 		//var fileFound = !String.IsNullOrEmpty(filename);
// 		//var fileExists = (fileFound ? FileSystem.Exists(GetPrivateImagePath(event, pictId, ".jpg")) : false);
// 		return FileSystem.Exists(GetPrivateImagePath(event, pictname, ".jpg")) //fileFound && fileExists;
// }

function SnapshotActions(sender, objectRef, eqRef, pictId) { // optional: title, path
		var listChoice = new List;
		listChoice.Add([0, Translate["#DeleteSnapShot#"]]);

		Dialog.Choose(Translate["#snapshot#"], listChoice, SnapshotActionsHandler, [objectRef, eqRef, pictId]);
}

function SnapshotActionsHandler(state, args){
		if (parseInt(args.Result)==parseInt(0)){
				DeleteSnapShot(state[0], state[1], state[2]);
		}
}

function DeleteSnapShot(event, act, pictId) {
  SetForAllActions(event, act, "");
	if (FileSystem.Exists(GetPrivateImagePath(event, pictId, ".jpg"))){
	 	FileSystem.Delete(GetPrivateImagePath(event, pictId, ".jpg"));
	}

	Workflow.Refresh([$.param1]);
}

function getStatusStyle(status){
  if (status == DB.Current.Constant.ResultEvent.Done){
    return "green_mark";
  } else {
    return "red_mark";
  }
}

function isDone(task){
	if (task.Result == DB.Current.Constant.ResultEvent.New) {
		return false;
	} else {
		return	true;
	}
}
