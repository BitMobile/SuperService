
//---------------Common functions-----------
function PullArray(arr, ind){
	return arr[ind];
}

function GenerateGuid() {

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function test(a){
	Console.WriteLine('===== test = ' + a);
	return a;
}

function testInDialog(s){
	Dialog.Debug(s);
	return s;
}

function Trans(txt){
	return Translate["#" + txt + "#"];
}


function IsNullOrEmpty(val1) {
    return String.IsNullOrEmpty(val1);
}


function makeCall(num){
	Phone.Call(num);
}

function GetUnloadCount(rs){
	return rs.Count();
}

function Inversion(val){
	if (val){
		return false;
	} else {
		return true;
	}
}


function onEmptyValue(v) {
	if (IsNullOrEmpty(v)){
		return "—";
	} else {
		return v;
	}
}

//-----------------Dialog handlers-----------------

//Íóæíî ïåðåíåñòè ýòó ïðîâåðêó â ñîáûòèå ïðè ñòàðòå ïðèëîæåíèÿ


function checkFieldLength(sender, cutlength){
	if (StrLen(sender.Text)> cutlength) {
		sender.Text = Left(sender.Text, cutlength);
	}
}

function isEmptyCoordinats(client){
	if (client.Latitude == 0 && client.Longitude == 0){
		return true;
	} else {
		return false;
	}
}

function ActualLocation(location){
    var actualTime;
    var locTime = location.Time.ToLocalTime();
    var maxTime = DateTime.Now.AddMinutes(-5);
    actualTime = locTime > maxTime;

    return (location.NotEmpty && actualTime);
}

// function SnapshotExists(filePath) {
// 	if (!IsNullOrEmpty(filePath)){
// 		return FileSystem.Exists(filePath);
// 	}
// 	return false //FileSystem.Exists(filePath);
// }

function dateDDMMYYYYMMHH(dt) {
	if (!IsNullOrEmpty(dt)){
		return String.Format("{0:dd.MM.yyyy HH:mm}", DateTime.Parse(dt));
	} else {
		return "";
	}
}



//--- # Begin Editing parameters ---
function GetParamBooleanDialog(sender, param, paramRef, senderId){
		var arr = [];
    arr.push([true, Translate["#Yes#"]]);
    arr.push([false, Translate["#No#"]]);
		arr.push(["", Translate["—"]]);
    Dialog.Choose(paramRef.Description, arr, SetParamBooleanValue, [param, senderId]);
}

function SetParamBooleanValue(state, args){
    var res = undefined;
    if (args.Result == "") {
			res = "—";
    } else if (args.Result) {
			res = Translate["#Yes#"];
    }
		else if(args.Result == false)
		{
      res = Translate["#No#"];
    }
		if (args.Result == "") {
			SetForAllParameters(state[0], undefined);
		}
		else {
			SetForAllParameters(state[0], res);
		}
    Variables[state[1]].Text = res;
}

function GetParamValueListDialog(sender, param, paramRef, index, senderId){
		var tbl = ["Catalog_EquipmentOptions_ListValues",
								"Catalog_ClientOptions_ListValues",
								"Catalog_EventOptions_ListValues"];
    var q = new Query("SELECT Val, Val FROM " + tbl[index] + " WHERE Ref = @param Union Select \"\" As Val, @p2 As Val");
    q.AddParameter("param", paramRef);
		q.AddParameter("p2", Translate["—"]);
    Dialog.Choose(paramRef.Description, q.Execute(), SetParamValueListValue, [param, senderId]);
}

function SetParamValueListValue(state, args){

    SetForAllParameters(state[0], args.Result);
		if (args.Result == "") {
			Variables[state[1]].Text = "—";
		}
		else {
			Variables[state[1]].Text = args.Result;
		}
}


function GetParamDateDialog(sender, param, paramRef, curRes, senderId){
    if (IsNullOrEmpty(curRes)){
      Dialog.DateTime(paramRef.Description, SetParamDateValue, [param, senderId]);
    } else {
      Dialog.DateTime(paramRef.Description, Date(curRes), SetParamDateValue, [param, senderId]);
    }

}

function SetParamDateValue(state, args){
    SetForAllParameters(state[0], args.Result);
    Variables[state[1]].Text = Format("{0:dd.MM.yyyy HH:mm}", args.Result);

}

function SetParamStringValue(sender, param){
    if (StrLen(sender.Text) > 200) {
      Dialog.Message(Translate["#ToLongText200#"] + " " + StrLen(sender.Text));
      sender.SetFocus();
      return;
    }

    SetForAllParameters(param, sender.Text);
}

function SetParamIntegerValue(sender, param){
    if (!validate(sender.Text, "[0-9]*")){
        Dialog.Message(Translate["#OnlyInteger#"]);
        sender.SetFocus();
        return;
    }

    if (StrLen(sender.Text) > 200) {
      Dialog.Message(Translate["#ToLongText200#"] + " " + StrLen(sender.Text));
      sender.SetFocus();
      return;
    }

    SetForAllParameters(param, sender.Text);
}

function SetParamDecimalValue(sender, param){
    if (StrLen(sender.Text) > 200) {
      Dialog.Message(Translate["#ToLongText200#"] + " " + StrLen(sender.Text));
      sender.SetFocus();
      return;
    }

    SetForAllParameters(param, sender.Text);
}

function SetForAllParameters(param, result) {
      var obj = param.GetObject();
      obj.Val = result;
      obj.Save(false);
}

function AddParamSnapshot(sender, objectRef, eqRef) { // optional: title, path
		var listChoice = new List;
		if ($.MobileSettings.AllowGalery) {
			listChoice.Add([0, Translate["#addFromGallery#"]]);
		}
		//listChoice.Add([0, Translate["#addFromGallery#"]]);
		listChoice.Add([1, Translate["#makeSnapshot#"]]);

		Dialog.Choose(Translate["#snapshot#"], listChoice, AddSnapshotHandler, [objectRef, eqRef]);
}


//--- # Begin Snapshots ---
function AddSnapshot(sender, objRef, itemRef) { // optional: title, path

		var listChoice = new List;
		if ($.MobileSettings.AllowGalery) {
			listChoice.Add([0, Translate["#addFromGallery#"]]);
		}
		//listChoice.Add([0, Translate["#addFromGallery#"]]);
		listChoice.Add([1, Translate["#makeSnapshot#"]]);

		Dialog.Choose(Translate["#snapshot#"], listChoice, AddSnapshotHandler, [objRef, itemRef]);
}

function AddSnapshotHandler(state, args) {



	if (parseInt(args.Result)==parseInt(0)){ 	//Gallery answer
		ChooseFromGallery(state);
	}

	if (parseInt(args.Result)==parseInt(1)){ 	//SnapshotAnswer
		MakeSnapshot(state);
	}

}

function ChooseFromGallery(state) {

	FileSystem.CreateDirectory(String.Format("/private/{0}", GetParentFolderName(state[0])));

	var pictId = Global.GenerateGuid();
	var path = GetPrivateImagePath(state[0], pictId, ".jpg");
	Gallery.Size = $.MobileSettings.PictureSize;

	Gallery.Copy(path, SaveImage, [state, pictId]);
}

function MakeSnapshot(state) {
	FileSystem.CreateDirectory(String.Format("/private/{0}", GetParentFolderName(state[0])));

	var pictId = Global.GenerateGuid();
	var path = GetPrivateImagePath(state[0], pictId, ".jpg");
	Camera.Size = $.MobileSettings.PictureSize;

	Camera.Path = path;
	Camera.MakeSnapshot(path, $.MobileSettings.PictureSize, SaveImage, [state, pictId]);
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

	if (getType(entityRef.Ref) == "System.String"){
		folder = entityRef.Metadata().TableName;
	}
	else{
		folder = entityRef.Ref.Metadata().TableName;
	}
	folder = StrReplace(folder, "_", ".");
	folder = Lower(folder);

	return folder;
}

function SaveImage(state, args){
		if (args.Result){
      //SetForAllActions(state[0],state[1], state[2]);
			var obj = state[0][1].GetObject();
			obj.Val = state[1];
			obj.Save(false);
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

function GetSnapShotPath(objRef,fileName) {
	if (!IsNullOrEmpty(fileName)){
		if (FileSystem.Exists(GetPrivateImagePath(objRef, fileName, ".jpg"))){
			return GetPrivateImagePath(objRef, fileName, ".jpg");
	  }

	  if (FileSystem.Exists(GetSharedImagePath(objRef, fileName, ".jpg"))){
	    return GetSharedImagePath(objRef, fileName, ".jpg");
	  }
	} else {
		return "";
	}
}



function SnapshotExists(obj, pictname) {

	if (!IsNullOrEmpty(pictname)){
		return FileSystem.Exists(GetSnapShotPath(obj,pictname)); //fileFound && fileExists;
	} else {
		return false;
	}
}

function SnapshotDeleteDialog(sender, objRef, itemRef, curVal) { // optional: title, path
		var listChoice = new List;
		listChoice.Add([0, Translate["#DeleteSnapShot#"]]);

		Dialog.Ask(Translate["#qDeleteSnapShot#"], SnapshotActionsHandler, [objRef,itemRef, curVal]);
}

function SnapshotActionsHandler(state, args){

				DeleteSnapShot(state[0], state[1], state[2]);

}

function DeleteSnapShot(objRef, itemRef, pictId) {
  SetForAllParameters(itemRef, "");
	if (FileSystem.Exists(GetPrivateImagePath(objRef, pictId, ".jpg"))){
	 	FileSystem.Delete(GetPrivateImagePath(objRef, pictId, ".jpg"));
	}

	Workflow.Refresh([$.param1]);
}

//--- # End Snapshots ---
function FormatDate(datetime) {
	return String.IsNullOrEmpty(datetime) ? "—" : Format("{0:dd.MM.yyyy HH:mm}", Date(datetime));
}

function dataExists(val) {
	return IsNullOrEmpty(val);
}
//--- # End Editing parameters ---
