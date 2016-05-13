function OnLoad() {
	DrawDataReport();

	DrawFtpReport();
}

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


// -------------------- Sync Data ------------
function SyncData() {
	 $.dataSyncReport.Visible = false;
	 $.dataSyncError.Visible = false;
	 $.dataSyncLayout.Visible = true;
	 $.dataSyncIndicator.Start();
	 DB.Sync(SyncDataFinish);
	}

	function SyncDataFinish() {

		$.dataSyncIndicator.Stop();
		$.dataSyncLayout.Visible = false;

		DrawDataReport();
	}

	function DrawDataReport() {
	 var at = Translate["#at#"];
	 var date = DB.LastSyncTime.ToString("dd.MM.yy ");
	 var time = DB.LastSyncTime.ToString(" HH:mm");

	 if (DB.SuccessSync) {
	  $.dataSyncReport.Text = date + at + time;
	  $.dataSyncReport.Visible = true;
	  $.dataSyncError.Visible = false;
	  $.buttonSendLog.Visible = false;
		Global.SetMobileSettings();
	 } else {
	  $.dataSyncError.Text = Translate["#error#"] + ": " + date + at + time;
	  $.dataSyncError.Visible = true;
	  $.dataSyncReport.Visible = false;
	  $.buttonSendLog.Visible = true;
	 }
	}

// -------------------- Sync Ftp ------------


function SyncFtp() {
	$.ftpSyncReport.Visible = false;
	$.ftpSyncError.Visible = false;
	$.ftpSyncLayout.Visible = true;
	$.ftpSyncIndicator.Start();

	FileSystem.UploadPrivate(UploadPrivateCallback);
}

function UploadPrivateCallback(args) {
	if (args.Result) {
		// Remove private files
		FileSystem.ClearPrivate();
		FileSystem.SyncShared(SyncSharedCallback);
	} else {
		FileSystem.HandleLastError();
		SyncFtpFinish();
	}
}

function SyncSharedCallback(args) {
	if (!args.Result) {
		FileSystem.HandleLastError();
	}

	SyncFtpFinish();
}

function SyncFtpFinish() {
	$.ftpSyncIndicator.Stop();
	$.ftpSyncLayout.Visible = false;

	DrawFtpReport();
}

function DrawFtpReport() {

	var at = Translate["#at#"];
	var date = FileSystem.LastSyncTime.ToString("dd.MM.yy ");
	var time = FileSystem.LastSyncTime.ToString(" HH:mm");

	if (FileSystem.SuccessSync) {

		$.ftpSyncReport.Text = date + at + time;
		$.ftpSyncReport.Visible = true;
		$.ftpSyncError.Visible = false;

	} else {

		if (isDefault(FileSystem.LastSyncTime))
			$.ftpSyncError.Text = Translate["#Synchronization_has_not_been_performed#"];
		else
			$.ftpSyncError.Text = Translate["#error#"] + ": " + date + at + time;
		$.ftpSyncError.Visible = true;
		$.ftpSyncReport.Visible = false;

	}
}
function SendLog() {
	var result = Application.SendDatabase();

	if (result)
		Dialog.Message("#SucsessSend#");
	else
		Dialog.Message("#noSuccess#");

}
