function OnLoad(){
  if ($.Exists("searchSKU")) {
		$.edtSearch.Text = $.searchSKU;
  }
}
function getServices(isService) {
  var q = new Query();
  if (isService == 1) {
    var queryText = "SELECT Id, Description, Price " +
                    "FROM Catalog_RIM " +
                    "WHERE Service = 1 " +
                    "AND IsFolder = 0 " +
                    "AND NOT Id in (SELECT SKU " +
                              "FROM Document_Event_ServicesMaterials WHERE " +
                              "Ref = @event)";
  } else {
    var queryText = "SELECT Id, Description, Price " +
                    "FROM Catalog_RIM " +
                    "WHERE Service = 0 " +
                    "AND IsFolder = 0 " +
                    "AND NOT Id in (SELECT SKU " +
                              "FROM Document_Event_ServicesMaterials WHERE " +
                              "Ref = @event)";
  }

  q.AddParameter("event", Vars.getEvent());

  if ($.Exists("searchSKU")) {
		var searchString = $.searchSKU;
		if (!IsNullOrEmpty(searchString)){
			var searchtail = " AND  (Contains(Description, @SearchText))";
			q.AddParameter("SearchText", searchString);
			queryText = queryText + searchtail;
		}
	}

  q.Text = queryText;

  return q.Execute();
}

function findSKU(sender, key){
	$.Remove("searchSKU");
	$.AddGlobal("searchSKU", key);
	Workflow.Refresh([]);
}

function CreateAndNext(sender, refSKU) {
  var obj = DB.Create("Document.Event_ServicesMaterials");
  obj.Ref = Vars.getEvent();
  obj.Price = refSKU.Price;
  obj.SKU = refSKU;
  Workflow.Action('AddSKU', [obj]);
}

function CheckEmpty(val) {
  if (IsNullOrEmpty(val)) {
    return 0;
  } else {
    if (Converter.ToDecimal(val) == 0){
      return $.param1.AmountPlan;
    }
    return val;
  }
}

function SaveCount(sender, obj) {
  if (!IsNullOrEmpty($.SKUCount.Text)){
    if (Converter.ToDecimal($.SKUCount.Text) > 0){
      obj.AmountPlan = 0;
      obj.SumPlan = 0;
      obj.AmountFact = Converter.ToDecimal($.SKUCount.Text);
      obj.SumFact = Converter.ToDecimal($.SKUCount.Text) * obj.Price;
      obj.Save();
      Workflow.BackTo("calculate");
    } else {
      Dialog.Message(Translate["#ZeroCount#"]);
    }
  } else {
    Dialog.Message(Translate["#EmptyCount#"]);
  }
}
