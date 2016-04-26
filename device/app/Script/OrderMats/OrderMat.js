function OnLoading(){
$.Add("OrderMatRef", Vars.getOrderMat());
}
function OnLoad(){
 GetOrderMatDetails();
}
function GetOrderMatDetails() {
	var OrderMat = Vars.getOrderMat();

	$.Description.Text = OrderMat.Number;

}
