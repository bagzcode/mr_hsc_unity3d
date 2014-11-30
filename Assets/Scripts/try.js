
function Update () {
	if(Input.GetMouseButtonDown(0))
	{
		clickMouse = true ;
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
			targetPoint.y = -13;
			targetPoint_z = targetPoint.z;	
			
			var move : Vector3 = Vector3(targetPoint_x, targetPoint.y , targetPoint_z) - transform.position ;
			transform.Translate(move);	
		}
	}
}