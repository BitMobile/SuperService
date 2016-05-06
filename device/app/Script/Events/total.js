function isHungry(sender){

	if ($.HungryImageFalse.Visible == true){
		$.HungryImageFalse.Visible = false;
		$.HungryImageTrue.Visible = true;
		$.AngryImageTrue.Visible = false;
		$.AngryImageFalse.Visible = true;
	} else {
		$.HungryImageTrue.Visible = false;
		$.HungryImageFalse.Visible = true;
	}

	if ($.Exists("HungryTap")){
		$.Remove("HungryTap");
	} else {
		$.Add("HungryTap",true);
	}

}

function isAngry(sender){

	if ($.AngryImageFalse.Visible == true){
		$.AngryImageFalse.Visible = false;
		$.AngryImageTrue.Visible = true;
		$.HungryImageTrue.Visible = false;
		$.HungryImageFalse.Visible = true;
	} else {
		$.AngryImageTrue.Visible = false;
		$.AngryImageFalse.Visible = true;
	}

	if ($.Exists("AngryTap")){
		$.Remove("AngryTap");
	} else {
		$.Add("AngryTap",true);
	}

}

function checkCommentLength(sender){
	//var str = sender.Text;
	//sender.Text = Left(str, 250);
}

function createReminder(event){
	if (!IsNullOrEmpty($.RemindComment.Text)){
		if (StrLen($.RemindComment.Text) > 1000) {
			Dialog.Message(Translate["#ToLongText1000#"]  + " " +  StrLen($.RemindComment.Text));
			return;
		}
	}

	if ($.HungryImageTrue.Visible || $.AngryImageTrue.Visible) {

		if (!IsNullOrEmpty($.RemindComment.Text)){
			var reminder = DB.Create("Document.Reminder");
			reminder.Reminders = event;

			if ($.HungryImageTrue.Visible && !$.AngryImageTrue.Visible){
				reminder.ViewReminder = DB.Current.Constant.FoReminders.Sale;
			}

			if (!$.HungryImageTrue.Visible && $.AngryImageTrue.Visible){
				reminder.ViewReminder = DB.Current.Constant.FoReminders.Problem;
			}

			reminder.Date = DateTime.Now;

			reminder.Comment = $.RemindComment.Text;

			reminder.Save(false);

			Dialog.Message("Оповещение будет отправлено при следующей синхронизации!");
			$.AngryImageTrue.Visible = false;
			$.AngryImageFalse.Visible = true;
			$.HungryImageTrue.Visible = false;
			$.HungryImageFalse.Visible = true;
			$.RemindComment.Text = "";
		} else {
			Dialog.Message("Оставьте комментарий");
		}
	} else {
		Dialog.Message("Укажите один из статусов оповещения");
	}
}

function askCommit(sender, event){
	q = new Query("SELECT DEE.Id FROM Document_Event_Equipments DEE WHERE DEE.Result = @newStatus AND DEE.Ref = @Ref");
	q.AddParameter("newStatus", DB.Current.Constant.ResultEvent.New);
	q.AddParameter("Ref", event);
	cnt = q.ExecuteCount();
	if(cnt == 0 || !$.MobileSettings.UsedEquipment){
		Dialog.Ask(Translate["#ConfirmeEndReg#"], CommitEvent, event);
	} else {
		Dialog.Message(Translate["#CompliteAllTask#"]);
	}
}


function CommitEvent(state, args){
	if (StrLen($.ExecutiveComment.Text) > 1000) {
		Dialog.Message(Translate["#ToLongText1000#"] + " " +  StrLen($.ExecutiveComment.Text));
		return;
	}
	if ($.MobileSettings.UsedGpsFix){
		var location = GPS.CurrentLocation;
		if(ActualLocation(location)) {
			SaveEvent(state, location);
			Workflow.Commit();
		} else {
			Dialog.Choose(Translate["#noVisitCoordinats#"], [[1, Translate["#Commit#"]], [2, Translate["#TryAgain#"]], [0, Translate["#Abort#"]],], NoCoordinatVariats, state);
		}
	} else {
			SaveEvent(state, undefined);

			Workflow.Commit();
	}
}

function CommitEventNoCoordinats(state, args){
	if (StrLen($.ExecutiveComment.Text) > 1000) {
		Dialog.Message(Translate["#ToLongText1000#"] + " " +  StrLen($.ExecutiveComment.Text));
		return;
	}
	SaveEvent(state, undefined);
	Workflow.Commit();

}

function NoCoordinatVariats(state, args){
	if (args.Result == 1){
		CommitEventNoCoordinats(state, args);
	}

	if (args.Result == 2){
		CommitEvent(state, args);
	}


}

function SaveEvent(ref, loc){
	var obj = ref.GetObject();
	obj.Status = DB.Current.Constant.StatusyEvents.Done;
	obj.CommentContractor = $.ExecutiveComment.Text;
	obj.ActualEndDate = DateTime.Now;
	if (loc != undefined){
		obj.Latitude = location.Latitude;
		obj.Longitude = location.Longitude;
		obj.GPSTime = location.Time;
	}

	var q = new Query("SELECT Id, AmountPlan AS AP, SumPlan AS SP " +
										"FROM Document_Event_ServicesMaterials " +
										"WHERE AmountFact = 0 " +
										"AND Ref = @Ref");

	q.AddParameter("Ref", ref);
	var res = q.Execute();
	var itemObj = undefined;

	while (res.Next()){
		itemObj = res.Id.GetObject();
		itemObj.AmountFact = res.AP;
		itemObj.SumFact = res.SP;
		itemObj.Save();
	}

	obj.Save();

}

function SetExecutiveComment(sender, ref) {
	if (StrLen($.ExecutiveComment.Text) > 1000){
		Dialog.Message(Translate["#ToLongText1000#"] + " " + StrLen($.ExecutiveComment.Text));
	} else {
		obj = ref.GetObject();
		obj.CommentContractor = $.ExecutiveComment.Text;
		obj.Save();
	}
}
