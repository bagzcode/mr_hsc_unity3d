var x : float = 0;
var z : float = 0;
var a : float = 0;
var b : float = 0;

function Start()
{
	transform.position.y = -12.5 ;
	GameObject.Find("tip_ghost").renderer.enabled = true ;
}

function Update () {	
	
	var v1 = GameObject.Find("dragShadow") ;
	transform.position.x = v1.transform.position.x;
	transform.position.z = v1.transform.position.z;
	/*
	a = Mathf.Abs(v1.transform.position.x -transform.position.x);
	b = Mathf.Abs(v1.transform.position.z - transform.position.z);
	
	
	Debug.Log("posisi shadow x  " + v1.transform.position.x  + " posisi z " + v1.transform.position.z);
	Debug.Log("posisi jib x  " + transform.position.x  + " posisi z " + transform.position.z);
	Debug.Log("beda posisi x " + a + " beda posisi y " + b );
	
	if(Mathf.Floor(transform.position.x) == Mathf.Floor(v1.transform.position.x) 
	   && Mathf.Floor(transform.position.z) == Mathf.Floor(v1.transform.position.z) )
	{
		Debug.Log("SAMAAAAAAAAAAAAAAAAAAAAAAAA");
	}else
	{
		var move : Vector3 = Vector3(v1.transform.position.x, transform.position.y, v1.transform.position.z) - transform.position ;
		transform.Translate(move*0.1);
	}
	*/
}