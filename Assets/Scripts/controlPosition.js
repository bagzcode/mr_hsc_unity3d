//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

var rotation_speed : float = 1;
var translation_speed : float = 1;
var controlmirror : boolean = true ;

function Start()
{
	transform.position.y = -13 ;
}

function FixedUpdate () {

	if(transform.position.x < -15) transform.position.x = -15;
	if(transform.position.x > 15) transform.position.x = 15;
	if(transform.position.y < -13) transform.position.y = -13;
	if(transform.position.y > 0) transform.position.y = 0;
	if(transform.position.z < 16) transform.position.z = 16;
	if(transform.position.z > 35) transform.position.z = 35;

	if(controlmirror) move_simple() ;
	else move_mirror() ;

	var _up : float = Input.GetAxis("height_pos") * translation_speed ;
	var _down : float = -Input.GetAxis("height_neg") * translation_speed ;

	if(Input.GetButton("height_pos"))
	{		
		if(transform.position.y + _up > 0)
		{
		} else transform.Translate(0,_up, 0);
	}
	
	if(Input.GetButton("height_neg"))
	{
		if(transform.position.y + _down < -13)
		{
		} else transform.Translate(0,_down, 0);
	}

}

function move_mirror()
{
	var _translation : float = Input.GetAxis("Vertical") * translation_speed ;
	var _rotation : float = Input.GetAxis("Horizontal") * rotation_speed ;

	transform.Translate(0,0,_translation) ;
	transform.RotateAround(Vector3.zero, Vector3.up, _rotation);
/*
	if(transform.position.z + _translation < 16 || transform.position.z + _translation > 36
	||transform.position.x + _rotation < -15 || transform.position.x + _rotation > 15)
	{
		
	} else {
		transform.Translate(0,0,_translation) ;
		transform.RotateAround(Vector3.zero, Vector3.up, _rotation);
	}
*/
}

function move_simple()
{
	var _translation1 : float = Input.GetAxis("Vertical") * translation_speed ;
	var _translation2 : float = Input.GetAxis("Horizontal") * translation_speed ;
	
	var camera_pos : Vector3 = GameObject.Find("Gaze Camera").transform.position ;
	var vec_dir : Vector3 = transform.position - camera_pos;
	var vec_ortho : Vector3 = Vector3(1,0,1) ;
	
	var vec_norm : Vector3 = Vector3(vec_dir.x, 0, vec_dir.z);
	
	vec_dir.OrthoNormalize (vec_norm, vec_ortho) ;

	transform.Translate(vec_norm*_translation1) ;
	
	if(vec_norm.x > vec_norm.z) transform.Translate(-vec_ortho*_translation2) ;
	else transform.Translate(vec_ortho*_translation2) ;	
}




