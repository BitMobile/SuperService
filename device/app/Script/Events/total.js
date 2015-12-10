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
	if ($.HungryImageTrue.Visible || $.AngryImageTrue.Visible) {

		if (!IsNullOrEmpty($.RemindComment.Text)){
			var reminder = DB.Create("Document.Reminder");
			reminder.Reminders = event;

			if ($.HungryImageTrue.Visible && !$.AngryImageTrue.Visible){
				reminder.ViewReminder = DB.Current.Constant.VidRemember.Sale;
			}

			if (!$.HungryImageTrue.Visible && $.AngryImageTrue.Visible){
				reminder.ViewReminder = DB.Current.Constant.VidRemember.Problem;
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
	Dialog.Ask("После завершения визита его нельзя будет отредактировать. Вы хотите завершить визит?", CommitEvent, event);
}


function CommitEvent(state, args){
	obj = state.GetObject();
	obj.Status = DB.Current.Constant.StatusyEvents.Done;
	obj.ActualEndDate = DateTime.Now;
	obj.Save();
	Workflow.Commit();
}
