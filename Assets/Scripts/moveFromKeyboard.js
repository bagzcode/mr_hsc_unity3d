var target : Transform ;
var x : float;
var y : float;
var z : float;
var v3 : Vector3;

function Start()
{
	transform.position.y = -13 ;
	GameObject.Find("tip_ghost").renderer.enabled = true ;
}
function FixedUpdate () {

	if (Input.GetKey(KeyCode.Keypad2))
		{
			var right : Vector3 = Vector3(transform.position.x+1, transform.position.y, transform.position.z) - transform.position ;
			transform.Translate(right*0.1);			
		}
	if (Input.GetKey(KeyCode.Keypad8))
		{
			var left : Vector3 = Vector3(transform.position.x-1, transform.position.y, transform.position.z) - transform.position ;
			transform.Translate(left*0.1);	
		}
	//if (Input.GetKey(KeyCode.Keypad8) && Input.GetKey(KeyCode.RightControl )|| Input.GetKey(KeyCode.LeftControl) && Input.GetKey(KeyCode.Keypad8))
	if(Input.GetKey(KeyCode.KeypadPlus))
		{
			var up : Vector3 = Vector3(transform.position.x, transform.position.y+1, transform.position.z) - transform.position ;
			transform.Translate(up*0.1);			
		}
	//if (Input.GetKey(KeyCode.Keypad2) && Input.GetKey(KeyCode.RightControl )|| Input.GetKey(KeyCode.LeftControl) && Input.GetKey(KeyCode.Keypad2))
	if(Input.GetKey(KeyCode.KeypadMinus))
		{
			var down : Vector3 = Vector3(transform.position.x, transform.position.y-1, transform.position.z) - transform.position ;
			transform.Translate(down*0.1);	
		}
	if (Input.GetKey(KeyCode.Keypad6))
		{
			var forward : Vector3 = Vector3(transform.position.x, transform.position.y, transform.position.z+1) - transform.position ;
			transform.Translate(forward*0.1);	
		}
	if (Input.GetKey(KeyCode.Keypad4))
		{
			var backward : Vector3 = Vector3(transform.position.x, transform.position.y, transform.position.z-1) - transform.position ;
			transform.Translate(backward*0.1);	
		}	

}