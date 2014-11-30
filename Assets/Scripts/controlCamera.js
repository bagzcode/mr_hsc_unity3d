var target : Transform ;

function Update () {

	transform.RotateAround(target.position, Vector3.up, -Input.GetAxis("cam_horizontal"));
	transform.RotateAround(target.position, transform.right, -Input.GetAxis("cam_vertical"));
	transform.LookAt(target);
	
	if(Input.GetButton("cam_zoom_pos"))
		transform.Translate(0,0,1);
	if(Input.GetButton("cam_zoom_neg"))
		transform.Translate(0,0,-1);		
}