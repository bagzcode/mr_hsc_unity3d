var target : Transform ;
var x : float;
var y : float;
var z : float;
var v3 : Vector3;
function Update () {

if (Input.GetKey(KeyCode.UpArrow))
	{
		transform.RotateAround(target.position, transform.right, 20 *  Time.deltaTime);
	}
	if (Input.GetKey(KeyCode.DownArrow))
	{
		transform.RotateAround(target.position, transform.right, - 20 *  Time.deltaTime);
	}

	if (Input.GetKey(KeyCode.RightArrow))
	{
		transform.RotateAround(target.position, Vector3.up, 20 *  Time.deltaTime);
	}
	if (Input.GetKey(KeyCode.LeftArrow))
	{
		transform.RotateAround(target.position, Vector3.up, - 20 *  Time.deltaTime);	
	}
	
	transform.LookAt(target);	
	if(Input.GetKey(KeyCode.PageUp))
		{transform.Translate(0,0,1);}
	if(Input.GetKey(KeyCode.PageDown))
		{transform.Translate(0,0,-1);}
		
}