var target : Transform ;
private var gazeUDP_script : Behaviour ;

function Update () {
	gazeUDP_script = gameObject.GetComponent("gazeUDP") ;

	transform.RotateAround(target.position, Vector3.up, -Input.GetAxis("cam_horizontal"));
	transform.RotateAround(target.position, transform.right, -Input.GetAxis("cam_vertical"));

	if(Input.GetButton("cam_zoom_pos"))
		camera.fieldOfView += 1 ;
	if(Input.GetButton("cam_zoom_neg"))
		camera.fieldOfView -= 1 ;
		
	if(gazeUDP_script.enabled)
	{	
		if (Input.GetButtonDown ("Fire2")) {
			GameObject.Find("scripts").GetComponent("myGUI").facelab = false;
			myScript = false ;
			
		}
	} else {
		transform.LookAt(target);
		if (Input.GetButtonDown ("Fire2")) {
			GameObject.Find("scripts").GetComponent("myGUI").facelab = true;
			myScript = true ;
		}
	}
}