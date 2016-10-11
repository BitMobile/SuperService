function ChangeListAndRefresh(control) {
    $.Remove("WorM");
    $.AddGlobal("WorM", control);
    Workflow.Refresh([$.param1]);
}

function actionDoSelect(){
  Vars.setNextAdd(true);
  Workflow.Action("CreateOrderMat",[Vars.getEvent()]);
}

function DoNextStep(param){

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

function editCountSKU(sender, id, isInPlan) {
  if (isInPlan == 1){
      if ($.WorM == 'work'){
        if ($.MobileSettings.EditPlanService){
          var obj = id.GetObject();
          Workflow.Action('AddSKU', [obj, 1]);
        }
      } else {
        if ($.MobileSettings.EditPlanMaterials){
          var obj = id.GetObject();
          Workflow.Action('AddSKU', [obj, 1]);
        }
      }
  } else {
    var obj = id.GetObject();
    Workflow.Action('AddSKU', [obj, 1]);
  }

}

function getRIM(servises) {
  var q = new Query("SELECT DERIM.Id AS Id, " +
                    "DERIM.LineNumber AS Line, " +
                    "CRIM.Description AS Description, " +
	                  "CRIM.Service AS isService, " +
	                  "DERIM.Price AS Price, " +
	                  "CASE WHEN DERIM.AmountFact > 0 THEN DERIM.AmountFact ELSE DERIM.AmountPlan END AS Amount, " +
                    "CASE WHEN DERIM.SumFact > 0 THEN DERIM.SumFact ELSE DERIM.SumPlan END AS Summ, " +
                    "CASE WHEN AmountPlan > 0 THEN 1 ELSE 0 END AS Ord " +
                    "FROM Document_Event_ServicesMaterials DERIM " +
                    "LEFT JOIN Catalog_RIM CRIM " +
                    "ON DERIM.SKU = CRIM.Id " +
                    "WHERE DERIM.Ref = @event " +
                    "AND isService = @isService " +
                    "ORDER BY Ord DESC, Line");
  q.AddParameter("isService", servises);
  q.AddParameter("event", Vars.getEvent());
  return q.Execute();
}

function deleteSKU(sender,id) {
  DB.Delete(id);
  Workflow.Refresh([]);
}

function SumPresent(price, count) {

  if (count > 1) {
    return count + " x " + price + " P";
  } else {
    return price  + " P";
  }
}

function isNullsetZero(val) {
	if (IsNullOrEmpty(val)){
		return 0;
	} else {
		return val;
	}
}


function getTotals() {
  var q = new Query("SELECT serTotal + matTotal AS TotalSumm, serTotal,  matTotal " +
                          "FROM (SELECT CASE WHEN @ucs = 1 " +
                                        "THEN SUM(CASE WHEN RIM.Service = 1 " +
                                                  "THEN CASE WHEN DES.SumFact > 0 " +
                                                            "THEN DES.SumFact " +
                                                            "ELSE DES.SumPlan END " +
                                                  "ELSE 0 END) " +
                                        "ELSE 0 END AS serTotal, "  +
                                  "CASE WHEN @ucm = 1 " +
                                        "THEN SUM(CASE WHEN RIM.Service = 0 " +
                                                  "THEN CASE WHEN DES.SumFact > 0 " +
                                                        "THEN DES.SumFact " +
                                                        "ELSE DES.SumPlan END " +
                                                  "ELSE 0 END) " +
                                        "ELSE 0 END AS matTotal " +
                          "FROM Document_Event_ServicesMaterials DES " +
                          "LEFT JOIN Catalog_RIM RIM " +
                          "ON DES.SKU = RIM.Id " +
                          "WHERE DES.Ref = @event)");
  q.AddParameter("event", Vars.getEvent());
  q.AddParameter("ucs", $.MobileSettings.UsedCalculateService);
  q.AddParameter("ucm", $.MobileSettings.UsedCalculateMaterials);
  var res = q.Execute();
  res.Next()
  return res;
}


function askCommit(event){

  Console.WriteLine("===================================");
    Console.WriteLine(event);

  Console.WriteLine('test');
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

      // Console.WriteLine($.ExecutiveComment.Text);
	// if (StrLen($.ExecutiveComment.Text) > 1000) {
	// 	Dialog.Message(Translate["#ToLongText1000#"] + " " +  StrLen($.ExecutiveComment.Text));
	// 	return;
	// }
	// if ($.MobileSettings.UsedGpsFix){
	// 	var location = GPS.CurrentLocation;
	// 	if(ActualLocation(location)) {
	// 		SaveEvent(state, location);
	// 		Workflow.Commit();
	// 	} else {
	// 		Dialog.Choose(Translate["#noVisitCoordinats#"], [[1, Translate["#Commit#"]], [2, Translate["#TryAgain#"]], [0, Translate["#Abort#"]],], NoCoordinatVariats, state);
	// 	}
	// } else {
			SaveEvent(state, undefined);

			Workflow.Commit();
	// }
}

function CommitEventNoCoordinats(state, args){
	// if (StrLen($.ExecutiveComment.Text) > 1000) {
	// 	Dialog.Message(Translate["#ToLongText1000#"] + " " +  StrLen($.ExecutiveComment.Text));
	// 	return;
	// }
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
	// obj.CommentContractor = $.ExecutiveComment.Text;
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
	// if (StrLen($.ExecutiveComment.Text) > 1000){
	// 	Dialog.Message(Translate["#ToLongText1000#"] + " " + StrLen($.ExecutiveComment.Text));
	// } else {
	// 	obj = ref.GetObject();
	// 	obj.CommentContractor = $.ExecutiveComment.Text;
	// 	obj.Save();
	// }
}


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

			Dialog.Message("#AfterSync#");
			$.AngryImageTrue.Visible = false;
			$.AngryImageFalse.Visible = true;
			$.HungryImageTrue.Visible = false;
			$.HungryImageFalse.Visible = true;
			$.RemindComment.Text = "";
		} else {
			Dialog.Message("#PostComment#");
		}
	} else {
		Dialog.Message("#SetStat#");
	}
}
