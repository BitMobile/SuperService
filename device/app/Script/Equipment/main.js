function getEquipmentList(clientId) {
	var q = new Query("SELECT CE.Id, CE.Description, CE.SerialNumber " +
		"FROM Catalog_Equipment_Equiements CEE LEFT JOIN Catalog_Equipment CE " +
		"ON CEE.Ref = CE.Id " +
		"WHERE CEE.Clients = @Client");
	q.AddParameter("Client", clientId);

	return q.Execute();
}
