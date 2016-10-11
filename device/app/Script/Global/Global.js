function DoSelect(entity, attribute, control) {
    var tableName = entity[attribute].Metadata().TableName;
    var query = new Query();
    query.Text = "SELECT Id, Description FROM " + tableName;
    Dialog.Select("#select_answer#", query.Execute(), DoSelectCallback1, [entity, attribute, control]);
    return;
}

function DateTimeDialog(entity, attribute, date, control) {
    var header = Translate["#enterDateTime#"];
    Dialog.ShowDateTime(header, date, DoSelectCallback2, [entity, attribute, control]);
}

function checkUsr(){
	var mskCO = '@ref[Catalog_Departments]:4859e3db-e14d-11dc-93e2-000e0c3ec513';
	var userObject = $.common.UserRef;
	return isInDepartment(mskCO, userObject.Department);
}

function FindTwinAndUnite(orderitem) {

	var q = new Query(
			"SELECT Id FROM Document_NeedMat_Matireals WHERE Ref=@ref AND SKU=@sku AND Id<>@id LIMIT 1"); // AND
																																								// Id<>@id
	q.AddParameter("ref", orderitem.Ref);
	q.AddParameter("sku", orderitem.SKU);
	q.AddParameter("id", orderitem.Id);
	var rst = q.ExecuteCount();
	if (parseInt(rst) != parseInt(0)) {
		var twin = q.ExecuteScalar();
		twin = twin.GetObject();
		twin.Count += orderitem.Count;
		twin.Save();
		DB.Delete(orderitem.Id);
	} else
		orderitem.Save();
}

function isInDepartment(valCheck, val){
	if (val != valCheck){
		if (val.Parent !=  DB.EmptyRef("Catalog_Departments")){
			if (val.Parent == valCheck){
				return true;
			} else {
				isInDepartment(valCheck, val.Parent);
			}
		} else {
			return false;
		}
	} else{
		return true;
	}
}

function GenerateGuid() {

	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function SetMobileSettings(){
  if ($.Exists("MobileSettings"))
      $.Remove("MobileSettings");

  $.AddGlobal("MobileSettings", new Dictionary);

  var solVersion  = new Query("SELECT Value FROM ___SolutionInfo WHERE key='version'");
  $.MobileSettings.Add("solVersion", solVersion.ExecuteScalar());
  var UsedEquipment = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'UsedEquipment'");
  $.MobileSettings.Add("UsedEquipment", UsedEquipment.ExecuteScalar());
  var UsedCL = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'UsedCheckLists'");
  $.MobileSettings.Add("UsedCheckLists", UsedCL.ExecuteScalar());
  var UsedEquipment = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'AllowGalery'");
  $.MobileSettings.Add("AllowGalery", UsedEquipment.ExecuteScalar());
  var UsedGpsFix = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'UsedGpsFix'");
  $.MobileSettings.Add("UsedGpsFix", UsedGpsFix.ExecuteScalar());

  var UsedCalculate = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'UsedCalculate'");
  $.MobileSettings.Add("UsedCalculate", UsedCalculate.ExecuteScalar());
  var AddUnPlanMaterials = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'AddUnPlanMaterials'");
  $.MobileSettings.Add("AddUnPlanMaterials", AddUnPlanMaterials.ExecuteScalar());
  var AddUnPlanService = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'AddUnPlanService'");
  $.MobileSettings.Add("AddUnPlanService", AddUnPlanService.ExecuteScalar());
  var EditPlanMaterials = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'EditPlanMaterials'");
  $.MobileSettings.Add("EditPlanMaterials", EditPlanMaterials.ExecuteScalar());
  var EditPlanService = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'EditPlanService'");
  $.MobileSettings.Add("EditPlanService", EditPlanService.ExecuteScalar());
  var UsedCalculateMaterials = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'UsedCalculateMaterials'");
  $.MobileSettings.Add("UsedCalculateMaterials", UsedCalculateMaterials.ExecuteScalar());
  var UsedCalculateService = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'UsedCalculateService'");
  $.MobileSettings.Add("UsedCalculateService", UsedCalculateService.ExecuteScalar());
  var UsedBag = new Query("SELECT LogicValue FROM Catalog_SettingMobileApplication WHERE Description = 'UsedServiceBag'");
  $.MobileSettings.Add("UsedServiceBag", UsedBag.ExecuteScalar());

  var PictureSize = new Query("SELECT NumericValue FROM Catalog_SettingMobileApplication WHERE Description = 'PictureSize'");
  var resPS = PictureSize.ExecuteScalar();
  if (isNaN(parseInt(resPS))){
    $.MobileSettings.Add("PictureSize", 1400);
  } else {
    if (parseInt(resPS)> 0) {
        $.MobileSettings.Add("PictureSize", parseInt(PictureSize.ExecuteScalar()));
    } else {
        $.MobileSettings.Add("PictureSize", 1400);
    }
  }
}
