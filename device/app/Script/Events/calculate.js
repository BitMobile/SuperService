function ChangeListAndRefresh(control) {
    $.Remove("WorM");
    $.AddGlobal("WorM", control);
    Workflow.Refresh([$.param1]);
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
          Workflow.Action('AddSKU', [obj]);
        }
      } else {
        if ($.MobileSettings.EditPlanMaterials){
          var obj = id.GetObject();
          Workflow.Action('AddSKU', [obj]);
        }
      }
  } else {
    var obj = id.GetObject();
    Workflow.Action('AddSKU', [obj]);
  }

}

function getRIM(servises) {
  var q = new Query("SELECT DERIM.Id AS Id, " +
                    "DERIM.LineNumber AS Line, " +
                    "CRIM.Description AS Description, " +
	                  "CRIM.Service AS isService, " +
	                  "DERIM.Price AS Price, " +
	                  "CASE WHEN DERIM.AmountPlan > 0 THEN DERIM.AmountPlan ELSE DERIM.AmountFact END AS Amount, " +
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
  q.AddParameter("inPlan", inPlan);
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

function getTotals() {
  var q = new Query("SELECT SUM(CASE WHEN DES.SumFact > 0 " +
                              "THEN DES.SumFact " +
                              "ELSE DES.SumPlan END) AS TotalSumm, " +
                            "SUM(CASE WHEN RIM.Service = 1 " +
                                "THEN CASE WHEN DES.SumFact > 0 " +
                                          "THEN DES.SumFact " +
                                          "ELSE DES.SumPlan END " +
                                "ELSE 0 END) AS serTotal, "  +
                            "SUM(CASE WHEN RIM.Service = 0 " +
                                "THEN CASE WHEN DES.SumFact > 0 " +
                                      "THEN DES.SumFact " +
                                      "ELSE DES.SumPlan END " +
                                "ELSE 0 END) AS matTotal " +
                    "FROM Document_Event_ServicesMaterials DES " +
                    "LEFT JOIN Catalog_RIM RIM " +
                    "ON DES.SKU = RIM.Id");
  var res = q.Execute();
  res.Next();
  return res;
}
