//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

var target : Transform ;
private var delay : float = 0 ;
private var timer : float ;
var speed_rotate : float = 1;
var speed_zoom : float = 0.8;
var eyetracking : boolean = false ;
var springZoom : boolean ;
var zoom_0 : int = 12;

function Start(){
	timer = delay ;
}

function FixedUpdate () {

	transform.RotateAround(target.position, Vector3.up, -Input.GetAxis("cam_horizontal")*speed_rotate);
	transform.RotateAround(target.position, transform.right, -Input.GetAxis("cam_vertical")*speed_rotate);

	if(Input.GetButton("cam_zoom_neg")) {
		if(camera.fieldOfView < 50 || !springZoom) camera.fieldOfView += 1*speed_zoom ;
	} else {
		if(Input.GetButton("cam_zoom_pos")) {
			if(camera.fieldOfView > 5) camera.fieldOfView -= 1*speed_zoom ;
		} else zoom_ini();
	}
		
	eyetracking = GameObject.Find("Gaze Camera").GetComponent("gazeUDP").eyetracking ;
	if(!eyetracking) transform.LookAt(target);
}

function zoom_ini()
{
	if(springZoom) {
		if(camera.fieldOfView < zoom_0) camera.fieldOfView += 1*speed_zoom ;
		if(camera.fieldOfView > zoom_0) camera.fieldOfView -= 1*speed_zoom ;
	}
}