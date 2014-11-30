var xScale : float;
var yScale : float;
var zScale : float;
var v1_x : float;
var v1_y : float;
var v1_z : float;
var timer : boolean = false;
var xStone : float ;
var zStone : float ;
var totalStone : float = 0 ; 
//var stone_ = new array();
var i : int ;
var b : int = 100;
function OnGUI ()
{
	// Make GUI window
	GUI.TextArea (Rect (72,7,115,20), ""); 
	GUI.Box (Rect (10,5,250,140), "~ Control Information ~");  	
	GUI.Label (Rect (30,30,230,20), "Click on stone to make robot move"); 
	GUI.TextArea (Rect (75,60,130,20), "~ Stone Information ~");  
	GUI.Label (Rect (22,85,230,20), "Total Stone : "+totalStone); 
	/*GUI.Label (Rect (22,100,230,20), "Stone 1 : " + stone_[1]); 
	GUI.Label (Rect (22,115,230,20), "Stone 2 : " + stone_[2]); 
	GUI.Label (Rect (22,130,230,20), "Stone 3 : " + stone_[3]); 
	GUI.Label (Rect (22,145,230,20), "Stone 4 : " + stone_[4]); */
	GUI.Label (Rect(22, 100, 90, 20), "FPS : " + FPS.fps.ToString("f2"));		
	GUI.Label (Rect(22, 125, 230, 20), "time : " + Time.realtimeSinceStartup); 
} 



