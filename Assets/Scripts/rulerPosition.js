var xHole : float = -0.45;
var yHole : float = -11;
var zHole : float = 40;

function Update () {

		//v1 for get position of stone
		var ruler : Vector3 = GameObject.Find("Ruler").transform.position;
		var xRuler : float = ruler.x;
		var yRuler : float = ruler.y;
		
		var v1 : Vector3 = GameObject.Find("Cube").transform.position;
		var yStone : float = v1.y ;
		var xStone : float = v1.x ;
		
		//find angle for rotate and catch rock
		var distc : float = Mathf.Sqrt(((xStone-xRuler)*(xStone-xRuler))+((yStone-yRuler)*(yStone-yRuler)));
		var distc2 : float = distc/2;
		var  alpha : float = Mathf.Sin (30/distc2);
		var alpha2 : float = 2*alpha;
		
		var yTarget : float = v1.y + 2;
		var xTarget : float = v1.x + 2;
		Debug.Log("distance : " + distc2 + "alpha 2 : " + alpha2 + "x,y target : " + xTarget + yTarget );
		//v2 for rotate rule to catch stone
	
	if(Input.GetKey(KeyCode.Space))
	{ 	
		var v2 : Vector3 = Vector3(v1.x, v1.y, v1.z) - transform.position ;
		transform.Rotate(0,alpha2*0.1,0);
		//transform.Translate(v2*0.1);
	}

}