	 var curUser = $.common.UserRef;

// ------------------------ Main screen module ------------------------

function CloseMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}

function OpenMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}

//----------------Begin Info Block Visit---------------------------------
function GetToDayUnDoneRequestsCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query("SELECT DE.id FROM Document_Event DE WHERE DE.ActualEndDate >= @DateStart AND DE.ActualEndDate <= @DateEnd AND DE.Status = @StatusEx");

	//q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.StatusyEvents.Done);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	return q.ExecuteCount();
}

function GetToDayDoneRequestCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query("SELECT DE.id FROM Document_Event DE WHERE DE.StartDatePlan >= @DateStart AND DE.StartDatePlan < @DateEnd AND DE.Status == @StatusComp");
	q.AddParameter("StatusComp",  DB.Current.Constant.StatusyEvents.Appointed);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	return q.ExecuteCount();
}

function GetToMonthDoneRequestsCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query("SELECT DE.id FROM Document_Event DE WHERE DE.ActualEndDate >= datetime('now', 'start of month') AND DE.ActualEndDate <= datetime('now', 'start of month', '+1 months') AND DE.Status = @StatusEx");

	//q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.StatusyEvents.Done);
	return q.ExecuteCount();
}

function GetToMonthUnDoneRequestCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query("SELECT DE.id FROM Document_Event DE WHERE DE.StartDatePlan >= datetime('now', 'start of month') AND DE.StartDatePlan < datetime('now', 'start of month', '+1 months') AND DE.Status == @StatusComp");
	q.AddParameter("StatusComp",  DB.Current.Constant.StatusyEvents.Appointed);
	return q.ExecuteCount();
}




function GetBeginOfCurrentMonth(){
	var mth = "";
	if (DateTime.Now.Month < 10){
		mth = "0"+ DateTime.Now.Month;
	} else {
		mth = DateTime.Now.Month;
	}
	return "01." + mth + "." + DateTime.Now.Year + " 00:00:00";
}

function GetEndOfCurrentMonth(){
	var mth = "";
	if (DateTime.Now.Month < 10){
		mth = "0"+ DateTime.Now.Month;
	} else {
		mth = DateTime.Now.Month;
	}
	return DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month) + "." + mth + "." + DateTime.Now.Year + " 00:00:00";
}
//----------------End Info Block Visit---------------------------------
