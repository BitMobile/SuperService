function getEqHistory(eq){
  var q = new Query("SELECT CEEH.Id, CEEH.Ref, CEEH.Period, " +
	  "ESE.Description AS Result, CEEH.Target, CU.Description AS Executor " +
    "FROM Catalog_Equipment_EquiementsHistory CEEH " +
    "LEFT JOIN Enum_ResultEvent ESE ON CEEH.Result = ESE.Id " +
    "LEFT JOIN Catalog_User CU ON CEEH.Executor = CU.Id " +
    "WHERE CEEH.Ref = @eq " +
    "ORDER BY CEEH.Period DESC");

  q.AddParameter("eq", eq);

  return q.Execute();
}

function getStatusStyle(status){
  if (status == "Выполнено"){
    return "green_mark";
  } else {
    return "red_mark";
  }
}
