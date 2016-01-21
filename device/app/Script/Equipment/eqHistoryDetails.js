function GetHistoryDetails(ref){
  var q = new Query("SELECT EH.Target AS Target, " +
                    "EH.Comment AS Comment, " +
                    "strftime('%d.%m.%Y',EH.Period) AS Period, " +
                    "CE.Description AS Equip, " +
                    "CASE WHEN ERE.Id == @NotDone " +
                          "THEN @NeVyp " +
                          "ELSE ERE.Description END AS Status " +
                    "FROM Catalog_Equipment_EquiementsHistory EH  " +
                    "LEFT JOIN Catalog_Equipment CE " +
                    "ON EH.Equiements = CE.Id " +
                    "LEFT JOIN Enum_ResultEvent ERE ON EH.Result = ERE.Id " +
                    "WHERE EH.Id = @Eq");

    q.AddParameter("NotDone", DB.Current.Constant.ResultEvent.NotDone);
    q.AddParameter("NeVyp", Translate["#Undone#"]);
    q.AddParameter("Eq", ref);
    var res = q.Execute();
    if (res.Next()){
      return res;
    } else {
      return null;
    }
}
