var target : Transform ;
var myScript : boolean = true ;

function Update () {

	transform.RotateAround(target.position, Vector3.up, -Input.GetAxis("cam_horizontal"));
	transform.RotateAround(target.position, transform.right, -Input.GetAxis("cam_vertical"));

	if(Input.GetButton("cam_zoom_pos"))
		camera.fieldOfView += 1 ;
	if(Input.GetButton("cam_zoom_neg"))
		camera.fieldOfView -= 1 ;
		
	if(myScript)
	{
		if (Input.GetButtonDown ("Fire2")) {
			GetComponent("gazeUDP").enabled = false;
			myScript = false ;
		}
	} else {
		transform.LookAt(target);
		if (Input.GetButtonDown ("Fire2")) {
			GetComponent("gazeUDP").enabled = true;
			myScript = true ;
		}
	}
}