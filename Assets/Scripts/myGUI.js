var opencv : boolean ;
var facelab : boolean ;
var sendudp : boolean ;
var xScale : boolean;
var yScale : boolean;
var zScale : boolean;
var v1_x : boolean;
var v1_y : boolean;
var v1_z : boolean;
var timer : boolean = false;
var xStone : float ;
var zStone : float ;
var stonePosition = ""; 
var clock  ; 
var i : int = 1 ;


function OnGUI ()
{
	// Make GUI window
	/*
	GUI.Box (Rect (10,5,250,130), "~ Stone Information ~");  
	GUI.TextArea (Rect (22,25,230,20), "Stone Position"+stonePosition); 
	GUI.TextArea (Rect (22,50,230,20), xScale + " xScale " + yScale + "yScale" + zScale+ "zScale"); 
	GUI.TextArea (Rect (22,75,230,20), v1_x + " xStone " + v1_y + "yStone" + v1_z + "zStone"); 
	GUI.Label (Rect(25, 90, 90, 20), "FPS : " + FPS.fps.ToString("f2"));	
	clock = Time.timeSinceLevelLoad.ToString();
	*/
	GUI.Label (Rect(25, 110, 230, 20), "time : " + Time.realtimeSinceStartup); 	
	

} 
function OnMouseDown () {
	Debug.Log("fILYA");
	
}

function Update()
{ 
			var v1 = GameObject.Find("stone_"+i);
			//var v1 = GameObject.Find("Cube"+i);
			/*			
			//position of rocks
			v1_x = v1.GetComponent("controlPosition").xStone ;
			v1_y = v1.GetComponent("controlPosition").yStone ;
			v1_z = v1.GetComponent("controlPosition").zStone ;
			
			//make instance of stone
			instance = Instantiate (v1);
			
			//scale of rocks
			xScale = v1.GetComponent("controlPosition").xScale ;
			yScale = v1.GetComponent("controlPosition").yStone;
			zScale = v1.GetComponent("controlPosition").zStone ;
			
			stonePosition = GameObject.Find("sphere_tip").GetComponent("controlPosition").stonePosition ;
			*/
}
