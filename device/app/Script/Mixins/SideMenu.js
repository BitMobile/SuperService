
function GetItemsStyles(){
	var styles = new Dictionary();
	styles.Add("Summary", IsCurrent("Summary"));
	styles.Add("Events", IsCurrent("Events"));
	styles.Add("Client", IsCurrent("Client"));
	styles.Add("Sync", IsCurrent("Sync"));
	styles.Add("About", IsCurrent("About"));
	styles.Add("OrderMats", IsCurrent("OrderMats"));
	return styles;
}

function IsCurrent(name){
	var c = Vars.getGlobalWorkflow() == null ? "Summary" : Vars.getGlobalWorkflow();
  return name == c ? "header" : "btn_item";
}

function menuClickAction(a){
  Vars.setGlobalWorkflow(a);
  DoAction(a);
}
