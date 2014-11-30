
function Update () {
	var sphere_tip_ghost : Vector3 = GameObject.Find("sphere_tip_ghost").transform.position ;
	var orientation : Vector3 = sphere_tip_ghost - Vector3(0,0,0) ;
	orientation.y = 0 ;
	orientation.Normalize();
	var angle : float = Vector3.Angle(orientation, Vector3.forward);
	
	if(sphere_tip_ghost.x < 0) transform.eulerAngles.y = -angle ;
	else transform.eulerAngles.y = angle ;
		
	transform.eulerAngles.z = 0 ;
	transform.eulerAngles.x = GameObject.Find("tip").transform.eulerAngles.x ;
}