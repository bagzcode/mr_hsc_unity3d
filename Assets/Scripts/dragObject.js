var send_UDP : boolean = false;

function Start()
{
	transform.position.y = -13.73238 ;
	GameObject.Find("tip_ghost").renderer.enabled = true ;
}

function OnMouseDrag()
{
	GameObject.Find("sphere_tip_ghost").GetComponent("sendUDP").enabled = false;
	// Generate a plane that intersects the transform's position with an upwards normal.
		var playerPlane = new Plane(Vector3.up, transform.position);
		
		// Generate a ray from the cursor position
		var ray = Camera.main.ScreenPointToRay (Input.mousePosition);   

		var hitdist = 0.0;
		// If the ray is parallel to the plane, Raycast will return false.
		if (playerPlane.Raycast (ray, hitdist)) 
		{
			// Get the point along the ray that hits the calculated distance.	
			targetPoint = ray.GetPoint(hitdist);			
			targetPoint_x = targetPoint.x;
			targetPoint_z = targetPoint.z;
			
			var targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
			
			// make sphere only of in board
			transform.position.y = -13.73238;
			if (transform.position.x <-14) { transform.position.x = -14; }
			else if(transform.position.x > 14) {transform.position.x = 14;}
			
			if (transform.position.z <10) { transform.position.z = 10; }
			else if(transform.position.z > 51) {transform.position.z = 51;}
			
			
			// Smoothly rotate towards the target point.
			transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, 100 * Time.deltaTime);
				
			// Move the object forward.
			transform.position += transform.forward  * Time.deltaTime * 20 ; //* Time.deltaTime	
		}
}

function OnMouseUp () {
	send_UDP = true;
    Debug.Log("Send UDP");
	//GameObject.Find("sphere_tip_ghost").GetComponent("sendUDP").enabled = true;
}
