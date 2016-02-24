function ChangeListAndRefresh(control) {
    $.Remove("WorM");
    $.AddGlobal("WorM", control);
    Workflow.Refresh([]);
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
