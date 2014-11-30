var speed = 10.0;
var xMouse : float = 0;
var zMouse : float = 0;
var obj : boolean = false;
var clickMouse : boolean = false ;
var targetPoint : Vector3;
var targetPoint_x : float;
var targetPoint_y : float;
var targetPoint_z : float;

function Update () {
		//Debug.Log("Ball Position 1 : " + transform.position.x + "  -  " + transform.position.z);
		
		if(Input.GetMouseButtonDown(0))
		{
			//Debug.Log(" FILYAAAASssssssssssssssssss" );
			clickMouse = true ;
			xMouse = transform.position.x ;
			zMouse = transform.position.z ;	
			//Debug.Log("Ball Position 2 : " + transform.position.x + "  -  " + transform.position.z);
		}
		
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
			targetPoint.y = -13;
			targetPoint_z = targetPoint.z;
			//Debug.Log("TARGET POINT : " + targetPoint_x + "  " + targetPoint_y + "  " + targetPoint_x );
			
			// Determine the target rotation.  This is the rotation if the transform looks at the target point.
			var targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
			
			// make sphere only of in board
			transform.position.y = -13;
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

