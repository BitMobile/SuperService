
var historyStart = undefined;
var historyStop = undefined;

//-------------------------------------------
var recvStartPeriod = "";
var backupStartPeriod;
function setRecvStartPeriod(a){
	recvStartPeriod = a;
}

function getRecvStartPeriod(){
	return recvStartPeriod;
}
//-----------------------------------------
var recvStopPeriod = "";
var backupStopPeriod;
function setRecvStopPeriod(a){
	recvStopPeriod = a;
}

function getRecvStopPeriod(){
	return recvStopPeriod;
}




// Begin Current Event ID
var currentEvent;

function setEvent(a){
	currentEvent = a;
}

function getEvent(){
	return currentEvent;
}
// End Current Event ID
var currentOrderMat;
var editenableOrd;
var nextAdd;
var Fill;
function setOrderMat(a,b){
	currentOrderMat = a;
	editenableOrd = b;
}
function setNextAdd(a){
	nextAdd = a;
}
function setFill(a)
{
	Fill = a;
}
function getFill(){
	return Fill;
}
function getNextAdd(a){
	return nextAdd;
}

function getOrderMat()
{
	return currentOrderMat;
}
function getOrderMatEnable()
{
	return editenableOrd;
}
// Begin Current Event ID
var currentClient;

function setClient(a){
	currentClient = a;
}

function getClient(){
	return currentClient;
}
// End Current Event ID

var GlobalWorkflow;

function getGlobalWorkflow(){
	return GlobalWorkflow;
}

function setGlobalWorkflow(a){
		GlobalWorkflow = a;
}
