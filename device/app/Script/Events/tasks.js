function DoBackAndClean(){
	Workflow.Back();
	//DB.Rollback();
}

function GetEventDetails() {

	return Vars.getEvent();
}

function GetExecutedTasks(event) {
	var query = new Query("SELECT DEE.Id, DEE.Ref, CE.Description, DEE.Terget, DEE.Comment, DEE.Result " +
	"FROM Document_Event_Equipments DEE " +
	"LEFT JOIN Catalog_Equipment CE " +
	"ON DEE.Equipment = CE.Id " +
	"WHERE DEE.Ref = @ref AND (DEE.Result = @done OR DEE.Result = @undone)");
//		var query = new Query("select * from Document_Event_Equipments WHERE Ref = @ref AND  Result = @result");


	query.AddParameter("ref", event);
	query.AddParameter("done",  DB.Current.Constant.ResultEvent.Done);
	query.AddParameter("undone",  DB.Current.Constant.ResultEvent.NotDone);
//Dialog.Debug(event);

	return query.Execute();
}

function GetNotExecutedTasks(event) {
	var q = new Query("SELECT DEE.Id, DEE.Ref, CE.Description, DEE.Terget, DEE.Comment " +
	"FROM  Document_Event_Equipments DEE " +
	"LEFT JOIN Catalog_Equipment CE " +
	"ON DEE.Equipment = CE.Id " +
	"WHERE DEE.Ref = @ref AND DEE.Result = @result");
	q.AddParameter("ref", event);
	q.AddParameter("result",  DB.Current.Constant.ResultEvent.New);
	return q.Execute();
}

function CompleteTheTask(itask, event) {
	var event_task_obj = itask.GetObject();
	event_task_obj.Result = DB.Current.Constant.ResultEvent.Done;
	event_task_obj.Save();
	if (Variables.Exists("itask"))

		Workflow.Refresh([ $.itask, event_task_obj.Id ]);


	else
		Workflow.Refresh([]);
}

function checkCommentLength(sender){
	if (StrLen(sender.Text) > 250){
	sender.Text = Left(sender.Text, StrLen(sender.Text) - 1);
	}
}

function SaveAndBack(task){
	var objtask = task.GetObject();
	objtask.Comment = $.taskComment.Text;
	objtask.Save();
	Workflow.Back();
}

function CompleteTask(sender, task) {
	var objtask = task.GetObject();
	objtask.Result = DB.Current.Constant.ResultEvent.Done;
	objtask.Comment = $.taskComment.Text;
	objtask.Save();
	Workflow.Back();
}

function NotDoneTask(sender, task) {
	if (!IsNullOrEmpty($.taskComment.Text)){
		var objtask = task.GetObject();
		objtask.Result = DB.Current.Constant.ResultEvent.NotDone;
		objtask.Comment = $.taskComment.Text;
		objtask.Save();
		Workflow.Back();
	} else {
		Dialog.Message("Для невыполненной задачи указание комментария обязательно.");
	}
}


function CreateVisitTaskValueIfNotExists(itask, event) {
	var query = new Query("SELECT Document_Event_Equipments.Id FROM Document_Event_Equipments WHERE Document_Event_Equipments.Ref = @Event AND  Document_Event_Equipments.Comment = @Text");
	query.AddParameter("Event", itask);

	query.AddParameter("Text", itask.Comment);
	var taskValue = query.ExecuteScalar();
	if (taskValue == null) {
		taskValue = DB.Create("Document.Event_Equipments");
		taskValue.id = itask.id;
		taskValue.Ref = itask.Ref;
		taskValue.Equipment = itask.Equipment;
		taskValue.Comment = itask.Comment;
		taskValue.Terget = itask.Terget;
		//Dialog.Debug(taskValue.TextTask);
		taskValue.TaskRef = itask;
		taskValue.Save();
		taskValue = taskValue.Id;
	}

	return taskValue;
}

function RetrieveTask(executedTask) {
	var task_obj = executedTask.GetObject();
	task_obj.Result = DB.Current.Constant.ResultEvent.New;
	task_obj.Save();

	if (Variables.Exists("itask"))
		Workflow.Refresh([ $.itask ]);
	else
		Workflow.Refresh([]);
}

function FormatDate(datetime) {
	return Format("{0:g}", Date(datetime).Date);
}

function GetTargetText(text) {
	if (String.IsNullOrEmpty(text))
		return Translate["#noDescriGiven#"];
	else
		return text;
}


function actionDoSelect(p){
	Vars.setTask(p);
	Dialog.Debug(Vars.setTask(p));
	Workflow.Action("Task",[]);
}

function AddSnapshot(sender, objectRef, eqRef) { // optional: title, path
		var listChoice = new List;
		listChoice.Add([0, Translate["#addFromGallery#"]]);
		listChoice.Add([1, Translate["#makeSnapshot#"]]);

		Dialog.Choose(Translate["#snapshot#"], listChoice, AddSnapshotHandler, [objectRef,eqRef]);
}

function AddSnapshotHandler(state, args) {
	var objRef = state[0];
	var eqRef = state[1];


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
	Gallery.Size = 1500;
	Gallery.Copy(path, SaveImage, [objRef, eqRef, pictId]);
}

function MakeSnapshot(objRef, eqRef) {
	FileSystem.CreateDirectory(String.Format("/private/{0}", GetParentFolderName(objRef)));

	var pictId = Global.GenerateGuid();
	var path = GetPrivateImagePath(objRef, pictId, ".jpg");
	Camera.Size = 1500;
	Camera.Path = path;
	Camera.MakeSnapshot(path, 1500, SaveImage, [objRef, eqRef, pictId]);
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
			objSnapShot = DB.Create("Document.Event_Photos");
			objSnapShot.Ref = state[0];
			objSnapShot.Equipment = state[1];
			objSnapShot.UIDPhoto = state[2];
			objSnapShot.Save(false);
			Workflow.Refresh([$.task]);
		}
}

function isSnapShotInEventExists(event, eq){
		var q = new Query("Select DEP.Id From Document_Event_Photos DEP WHERE DEP.Ref == @event AND DEP.Equipment == @eq");
		q.AddParameter("event", event);
		q.AddParameter("eq", eq);
		if (q.ExecuteCount() > 0) {
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

function SnapshotExists(event, eq, pictId) {
		var q = new Query("Select DEP.UIDPhoto From Document_Event_Photos DEP WHERE DEP.Ref == @event AND DEP.Equipment == @eq AND DEP.UIDPhoto == @pict");
		q.AddParameter("event", event);
		q.AddParameter("eq", eq);
		q.AddParameter("pict", pictId);
		var filename = q.ExecuteScalar();
		var fileFound = !String.IsNullOrEmpty(filename);
		var fileExists = (fileFound ? FileSystem.Exists(GetPrivateImagePath(event, pictId, ".jpg")) : false);
		return fileFound && fileExists;

}

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

function DeleteSnapShot(event, eq, pictId) {
	q = new Query("SELECT DEP.Id FROM Document_Event_Photos DEP WHERE DEP.Ref == @event AND DEP.Equipment == @eq AND DEP.UIDPhoto == @pict");
	q.AddParameter("event", event);
	q.AddParameter("eq", eq);
	q.AddParameter("pict", pictId);
	res = q.ExecuteScalar();
	DB.Delete(res);

	if (FileSystem.Exists(GetPrivateImagePath(event, pictId, ".jpg"))){
	 	FileSystem.Delete(GetPrivateImagePath(event, pictId, ".jpg"));
	}

	Workflow.Refresh([$.task]);
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
function askIfRollback(sender, task) {

	Dialog.Ask(Translate["#questionRollback#"], RollbackTask, task);
}

function RollbackTask(state, args) {
	var objtask = state.GetObject();
	objtask.Result = DB.Current.Constant.ResultEvent.New;
	objtask.Comment = $.taskComment.Text;
	objtask.Save();
	Workflow.Refresh([$.task]);
}
