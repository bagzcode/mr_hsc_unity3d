var rotation_speed : float = 1;
var translation_speed : float = 1;
var a : int = 0;
var xHole : float = 0.13;
var yHole : float = -14.34;
var zHole : float = 25.92;
var yUp : float = -5;
var yDown : float = -10;



function Update () {
	if(a<2){
		//transform.position.y += 3 ;
		a++;
	}
			

	// how to get how much stone there	
	//var v1 : Vector3 = GameObject.Find("stone_1").transform.position;
	var v1 : Vector3 = GameObject.Find("Cube").transform.position;
	Debug.Log( v1.x + " xstone " + v1.y + " ystone " + v1.z + " zstone " );
	Debug.Log( transform.position.x + " xrobot " + transform.position.y + " yrobot " + transform.position.z + " zrobot " );
		if (v1.x < 0 )
		{
			if (v1.z <25)
			{
					var xStone : float = v1.x - (-v1.x/4);
					var zStone : float = v1.z - (v1.z/4);
			}
			else
			{
				xStone = v1.x - (-v1.x/4);
				zStone = v1.z + (v1.z/4);
			}
	
		}
		else if (v1.x > 0 )
		{
			if (v1.z <25)
			{
					xStone = v1.x + (v1.x/4);
					zStone = v1.z - (v1.z/4);
			}
			else
			{
				xStone = v1.x + (v1.x/4);
				zStone = v1.z + (v1.z/4);
			}
	
		}
	/*
	if (Input.GetKey(KeyCode.Q))
	//(Mathf.Floor(transform.position.y+1) != Mathf.Floor(yUp))
	//{	
	//if(transform.position.x != xStone)
	{
		//Debug.Log( Mathf.Floor(transform.position.x) + " xrobot " + Mathf.Floor(transform.position.y+1) + " yrobot " + Mathf.Floor(transform.position.z)+ " zrobot " );
		//Debug.Log( Mathf.Floor(xStone) + " xrobotS " + Mathf.Floor(yUp) + " yrobotS " + Mathf.Floor(zStone)+ " zrobots " );
		//move up
		var up : Vector3 = Vector3(transform.position.x, yUp, transform.position.z) - transform.position ;
		transform.Translate(up*0.1);
	}
	//Debug.Log( Mathf.Floor(transform.position.x) + " xrobotdf " + Mathf.Floor(transform.position.y+1) + " yrobotdf " + Mathf.Floor(transform.position.z)+ " zrobot " );
	//Debug.Log( Mathf.Floor(xStone) + " xrobotd " + Mathf.Floor(yUp) + " yrobotd " + Mathf.Floor(zStone)+ " zrobots " );
	
	if (Input.GetKey(KeyCode.W))
	//((Mathf.Floor(transform.position.y+1) == Mathf.Floor(yUp)||Mathf.Floor(transform.position.y+1) == Mathf.Floor(yUp)) && Mathf.Floor(transform.position.z)!=Mathf.Floor(zStone))
	{	
		//Debug.Log( Mathf.Floor(transform.position.x) + " xrobot " + Mathf.Floor(transform.position.y+1) + " yrobot " + Mathf.Floor(transform.position.z)+ " zrobot " );
		//Debug.Log( Mathf.Floor(xStone) + " xrobotSa " + Mathf.Floor(yUp) + " yrobotSa " + Mathf.Floor(zStone)+ " zrobotsa " );
		*/
		// catch stone
		var v2 : Vector3 = Vector3(xStone, yUp, zStone) - transform.position ;
		transform.Translate(v2*0.1);
	
	//if (Input.GetKey(KeyCode.E))
	//(Mathf.Floor(transform.position.y+1) == Mathf.Floor(yUp) && Mathf.Floor(transform.position.z)==Mathf.Floor(zStone))
	//{	
		//move down
		var down : Vector3 = Vector3(transform.position.x, yDown, transform.position.z) - transform.position ;
		transform.Translate(down*0.1);
		
	//}
/*
		var distX : int =  transform.position.x - xStone ;
		var distZ : int =  transform.position.z - zStone ;
		*/
		
		//will push to the hole if robot on the right position 
		/*
		if (distX==0)
		{
			if (distZ==0)
			{
			*/
			if (Input.GetKey(KeyCode.Space))
			{
				var v3 : Vector3 = Vector3(xHole, yHole, zHole) - transform.position ;
				transform.Translate(v3*0.01);
				Debug.Log( " SUccEESSS !!! masuk KE LObang !!!!" );
				var deft = Vector3(0,-10,-10)-transform.position;
				transform.Translate(deft *0.1);
				Debug.Log( " go to default positition hore " );
			}	/*
		}
		
		
	//}
	/*
	*/
	//set default position
	if(Input.GetKey(KeyCode.Delete))
	{
		var center = Vector3(0,-10,-10)-transform.position;
		transform.Translate(center *0.1);
	}
	
}