
var xMouse : float;
var zMouse : float;
var clickMouse : boolean = false;

function Start()
{
	transform.position.y = -13 ;
	GameObject.Find("tip_ghost").renderer.enabled = true ;
}


function FixedUpdate () {
	var v1 = GameObject.Find("catchMouse").GetComponent("catchMouse");
	clickMouse = v1.clickMouse;
	xMouse = v1.xMouse;
	zMouse = v1.zMouse;	
	
	if (clickMouse == true)
	{
		Debug.Log(" Mouse Position : " + xMouse + "   " + zMouse);
		var move : Vector3 = Vector3(xMouse, transform.position.y, zMouse) - transform.position ;
		transform.Translate(move);	
		
		GameObject.Find("catchMouse").GetComponent("catchMouse").clickMouse = false ;
	}
	Debug.Log("Tip Position : " + transform.position.x + "   " + transform.position.z);
}
