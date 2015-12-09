
//---------------Common functions-----------
function PullArray(arr, ind){
	return arr[ind];
}

function GenerateGuid() {

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function test(a){
	Console.WriteLine('===== test = ' + a);
	return a;
}

function testInDialog(s){
	Dialog.Debug(s);
	return s;
}

function Trans(txt){
	return Translate["#" + txt + "#"];
}


function IsNullOrEmpty(val1) {
    return String.IsNullOrEmpty(val1);
}


function makeCall(num){
	Phone.Call(num);
}

function GetUnloadCount(rs){
	return rs.Count();
}

function Inversion(val){
	if (val){
		return false;
	} else {
		return true;
	}
}

//-----------------Dialog handlers-----------------

//Íóæíî ïåðåíåñòè ýòó ïðîâåðêó â ñîáûòèå ïðè ñòàðòå ïðèëîæåíèÿ


function checkFieldLength(sender, cutlength){
	if (StrLen(sender.Text)> cutlength) {
		sender.Text = Left(sender.Text, cutlength);
	}
}

function isEmptyCoordinats(client){
	if (client.Latitude == 0 && client.Longitude == 0){
		return true;
	} else {
		return false;
	}
}
