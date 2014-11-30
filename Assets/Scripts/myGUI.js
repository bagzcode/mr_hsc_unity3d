//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

var opencv : boolean ;
var sendudp : boolean ;
var facelab : boolean ;
var showgaze : boolean = false;
var showheight : boolean = false;
var headtracking : boolean ;
var eyetracking : boolean ;
var controlmirror : boolean ;
var springzoom : boolean ;

//var speedGaze : int ;
var speedGaze : int ;
var speedHead : int ;
var speedTip : float ;
var _fieldOfView : int ;

private var selectionGridInt : int = 0;
private var selectionGridStrings : String[] = ["none", "1Hz", "5Hz", "10Hz"];

var eyeTexture : Texture2D ;

//toggle scripts
private var sc1 : MonoBehaviour ;
private var sc2 : MonoBehaviour ;
private var sc3 : MonoBehaviour ;

function Start()
{
	sc1 = GameObject.Find("scripts").GetComponent("stonesUDP") ;
	sc2 = GameObject.Find("Gaze Camera").GetComponent("gazeUDP") ;
	sc3 = GameObject.Find("sphere_tip").GetComponent("sendUDP") ;

	sc1.enabled = false ; //opencv
	sc1.enabled = false ; //facelab
	sc3.enabled = false ; //sendudp
	
	speedGaze = GameObject.Find("Gaze Camera").GetComponent("gazeUDP").speedGaze;
	speedHead = GameObject.Find("Gaze Camera").GetComponent("gazeUDP").speedHead;
	_fieldOfView = 45 ;
	controlmirror = true ;
	springzoom = false ;
}

function OnGUI () {
	var start : int = 35 ;
	var it : int = 15 ;
	var gaze_x : int = GameObject.Find("Gaze Camera").GetComponent("gazeUDP").gaze_x;
	var gaze_y : int = GameObject.Find("Gaze Camera").GetComponent("gazeUDP").gaze_y;
	var nudgeCount : int = GameObject.Find("sphere_tip").GetComponent("doNudge").nudgeCount;
	
	// Make GUI window
	GUI.Box (Rect (10,10,140,195), "Scripts");
	GUI.Box (Rect (10,215,140,165), "Infos");
	GUI.Box (Rect (160,10,240,90), "Trackbars");
	sendudp = GUI.Toggle (Rect (25, start, 100, it), sendudp, "SendUDP");
	opencv = GUI.Toggle (Rect (25, start+it, 100, it), opencv, "OpenCV");
	facelab = GUI.Toggle (Rect (25, start+it*2, 100, it), facelab, "FaceLab");
	headtracking = GUI.Toggle (Rect (25, start+it*3, 100, it), headtracking, "HeadTracking");
	eyetracking = GUI.Toggle (Rect (25, start+it*4, 100, it), eyetracking, "EyeTracking");
	showgaze = GUI.Toggle (Rect (25, start+it*5, 100, it), showgaze, "ShowGaze");
	showheight = GUI.Toggle (Rect (25, start+it*6, 100, it), showheight, "ShowHeight");
	controlmirror = GUI.Toggle (Rect (25, start+it*7, 100, it), controlmirror, "ControlMirror");
	springzoom = GUI.Toggle (Rect (25, start+it*8, 100, it), springzoom, "SpringZoom");
	
	//Speed Gaze editable
	GUI.Label(Rect(170, start , 100, 20), "GazeCoeff : " + speedGaze);
	speedGaze = GUI.HorizontalSlider (Rect(270, start+5, 110, 10), speedGaze, 10, 120);
	//Speed Head
	GUI.Label(Rect(170, start+it , 100, 20), "HeadCoeff : " + speedHead);
	speedHead = GUI.HorizontalSlider (Rect(270, start+5+it, 110,10), speedHead, 1, 10);
	//fieldOfView
	GUI.Label(Rect(170, start+it*2 , 100, 20), "FieldOfView : " + _fieldOfView);
	_fieldOfView = GUI.HorizontalSlider (Rect(270, start+5+it*2, 110, 10), _fieldOfView, 2, 50);
	
	
	//Display fixed FPS >> FixedUpdate
	GUI.Label (Rect(25, start+it*14, 120, 30), "FixedUpdate : " + Time.fixedDeltaTime.ToString("f3"));
	// Display FPS with two fractional digits
	GUI.Label (Rect(25, start+it*15, 100, 30), "FPS : " + FPS.fps.ToString("f2"));
	//Display nudge count
	GUI.Label (Rect(25, start+it*16, 100, 30), "Nudges : " + nudgeCount);
	//Tip Tracking Delay
	GUI.Label(Rect(25, start+it*18 , 200, 20), "TipDelay");
	selectionGridInt = GUI.SelectionGrid  (Rect (25, start+it*19 +10 , 110, 38), selectionGridInt, selectionGridStrings, 2);

	//Display eye.png to follow the gaze
	if(showgaze && sc2.enabled) GUI.Label (Rect (gaze_x, gaze_y, 60, 60), eyeTexture);
	
	//Quit button
	if (GUI.Button (Rect (20,start+it*9+8,120,20), "Quit")) {
		Application.Quit();
	}
	
	//stephane bersot infos
	GUI.Button (Rect(Screen.width-250, Screen.height-50, 200, 30), "www.stephanebersot.com");
}

function Update()
{
	if (Input.GetKeyDown(KeyCode.JoystickButton1)) 
	{
		if(headtracking) headtracking = false ;
		else headtracking = true ;
	}
	
	if (Input.GetKeyDown(KeyCode.JoystickButton0)) 
	{
		if(eyetracking) eyetracking = false ;
		else eyetracking = true ;
	}
	
	if (Input.GetKeyDown(KeyCode.JoystickButton3)) 
	{
		if(showgaze) showgaze = false ;
		else showgaze = true ;
	}
	
	if (Input.GetKeyDown(KeyCode.JoystickButton2))
		GameObject.Find("sphere_tip").GetComponent("doNudge").enabled = true ;
	
	if(eyetracking) selectionGridInt = 0 ;
	
	if(opencv && !sc1.enabled) sc1.enabled = true;
	if(!opencv && sc1.enabled) sc1.enabled = false;
	if(facelab && !sc2.enabled) sc2.enabled = true;
	if(!facelab && sc2.enabled) sc2.enabled = false;
	if(sendudp && !sc3.enabled) sc3.enabled = true;
	if(!sendudp && sc3.enabled) sc3.enabled = false;
	
	GameObject.Find("Gaze Camera").GetComponent("gazeUDP").speedGaze = speedGaze ;
	GameObject.Find("Gaze Camera").GetComponent("gazeUDP").speedHead = speedHead ;
	GameObject.Find("Height_help").renderer.enabled = showheight ;
	GameObject.Find("Gaze Camera").GetComponent("gazeUDP").headtracking = headtracking;
	GameObject.Find("Gaze Camera").GetComponent("gazeUDP").eyetracking = eyetracking;
	GameObject.Find("Gaze Camera").GetComponent("gazeUDP").zoom_0 = _fieldOfView;
	GameObject.Find("Gaze Camera").GetComponent("controlGazeCamera").zoom_0 = _fieldOfView;
	GameObject.Find("Gaze Camera").GetComponent("controlGazeCamera").springZoom = springzoom;
	GameObject.Find("sphere_tip").GetComponent("controlPosition").controlmirror = controlmirror;
	
	if(selectionGridInt == 0) GameObject.Find("tipTrackingTarget").GetComponent("tipTrackingTarget").delay = 0 ;
	if(selectionGridInt == 1) GameObject.Find("tipTrackingTarget").GetComponent("tipTrackingTarget").delay = 1 ;
	if(selectionGridInt == 2) GameObject.Find("tipTrackingTarget").GetComponent("tipTrackingTarget").delay = 0.2 ;
	if(selectionGridInt == 3) GameObject.Find("tipTrackingTarget").GetComponent("tipTrackingTarget").delay = 0.1 ;
	
	//print(selectionGridInt);
}