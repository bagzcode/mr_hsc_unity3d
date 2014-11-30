var xScale : float;
var yScale : float;
var zScale : float;
var v1_x : float;
var v1_y : float;
var v1_z : float;
var timer : boolean = false;
var xStone : float ;
var zStone : float ;
var totalStone : float ; 
var i : int ;
var b : int = 100;
var opencv : boolean ;
var sendudp : boolean ;
var keyboard : boolean ;
var mouse : boolean ;
private var sc1 : MonoBehaviour ;
private var sc2 : MonoBehaviour ;
private var sc3 : MonoBehaviour ;
private var sc4 : MonoBehaviour ;

function Start()
{
	sc1 = GameObject.Find("scripts").GetComponent("stonesUDP") ;
	sc2 = GameObject.Find("sphere_tip_ghost").GetComponent("sendUDP") ;
	sc3 = GameObject.Find("sphere_tip_ghost").GetComponent("moveFromKeyboard") ;
	sc4 = GameObject.Find("sphere_tip_ghost").GetComponent("poSisi3") ;
	
	
	sc1.enabled = false ; //opencv
	sc2.enabled = false ; //sendudp
	sc3.enabled = false ; //keyboard
	sc4.enabled = false ; //mouse
	
}

function OnGUI ()
{
	// Make GUI window
	
	GUI.Box (Rect (5,5,160,230), "");  	
	GUI.TextArea (Rect (20,7,135,20), "~ Control Information ~");  
	sendudp = GUI.Toggle (Rect (20, 30, 100, 20), sendudp, "SendUDP");
	opencv = GUI.Toggle (Rect (20, 50, 100, 20), opencv, "OpenCV");
	//GUI.Label (Rect (35,60,230,20), "* Click on stone to make robot move * "); 
	
	GUI.TextArea (Rect (20,80,115,20), "~ Control Position  ~");  
	keyboard = GUI.Toggle (Rect (20, 100, 100, 20), keyboard, "keyboard");
	mouse = GUI.Toggle (Rect (20, 120, 100, 20), mouse, "mouse");
	
	GUI.TextArea (Rect (20,150,130,20), "~ Stone Information ~");  
	
	GUI.Label (Rect (22,170,230,20), "Total Stone : "+ totalStone); 
	GUI.Label (Rect(22, 185, 90, 20), "FPS : " + FPS.fps.ToString("f2"));		
	GUI.Label (Rect(22, 200, 230, 20), "Time : " + Time.realtimeSinceStartup); 
	
} 
function Update()
{
	totalStone = GameObject.Find("sphere_tip_ghost").GetComponent("poSisi3").totalStone ;
	if(opencv && !sc1.enabled) sc1.enabled = true;
	if(!opencv && sc1.enabled) sc1.enabled = false;	
	if(sendudp && !sc2.enabled) sc2.enabled = true;
	if(!sendudp && sc2.enabled) sc2.enabled = false;
	
	if(keyboard && !sc3.enabled) sc3.enabled = true;
	if(!keyboard && sc3.enabled) sc3.enabled = false;  
	
	if(mouse && !sc4.enabled) sc4.enabled = true;
	if(!mouse && sc4.enabled) sc4.enabled = false;
    
}

