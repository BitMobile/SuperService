function OnLoad() {
	if ($.Exists("map")){
      $.map.AddMarker($.param1.Address, $.param1.Latitude, $.param1.Longitude, "orange");
  }
}
