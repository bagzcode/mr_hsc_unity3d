// this code can make the model down to catch the stone but for move from 1 stone to the next stone, model cant go up
var xScale : float = 0;
var zScale : float = 0;
var yScale : float = 0;
//edge of stone
var xEdgeTop : float = 0;
var zEdgeTop : float = 0;
var xEdgeBtm : float = 0;
var zEdgeBtm : float = 0;
var resetRocks : boolean = false;
var stoneUDP : boolean = true;
var goUp: boolean = true;
var sendServer : boolean = false;
var timer : boolean = false;
var click : boolean = false;
var repeat : boolean = true;
var Klik : boolean = false;
//distance or magnitude btw hole and stone
var dist : float = 0; 
var stonePosition = "none"; 
var projectile : Rigidbody;

//coordinate deafult position
var xDef : float = 0;
var yDef : float = -13;
var zDef : float = 21.4;
//coordinate of hole
var xHole : float = 0;
var yHole : float = -14;
var zHole : float = 26;

//position of rocks
var v1_x : float ;
var v1_y : float ;
var v1_z : float ;
var v1 : GameObject;

var yUp : float = -7;
var yDown : float;
var a : int = 1;
var i : int = 1 ;

var xStone : float;
var zStone : float;


//InvokeRepeating("Run",2,1);
function getPosisiton()
{	
	
	for (i=1; i<=5; i++)
	{		
		
		var v1 = GameObject.Find("stone_"+i);
		Debug.Log(v1);
		clicking = v1.GetComponent("clickObject").click ;
		if (clicking == true)
		{
			//position of rocks
			v1_x = v1.GetComponent("clickObject").xStone ;
			v1_y = v1.GetComponent("clickObject").yStone ;
			v1_z = v1.GetComponent("clickObject").zStone ;
					
			//scale of rocks
			xScale = v1.GetComponent("clickObject").xScale ;
			yScale = v1.GetComponent("clickObject").yScale;
			zScale = v1.GetComponent("clickObject").zScale ;
			Klik = clicking;
			//instance = Instantiate (v1);	
			i = 6;
			//because different with model and real stone
			v1_z = v1_z - 5 ;
		}
	}
}

function reset()
{
	v1_x = 0 ;
	v1_y = 0;
	v1_z = 0 ;
	xScale = 0 ;
	yScale = 0;
	zScale = 0;
	clicking = false ;
}

function setPosition ()
{
		yDown = v1_y + (0.5*yScale) - 4 ;  
		Debug.Log( yDown + " yDown " );
		
		// distance btw Z hole and Z Stone 
		var dZ : float = Mathf.Abs(zHole - v1_z);		
		
		
		// distance btw X hole and X Stone 
		var dX : float = Mathf.Abs(xHole - v1_x);
		Debug.Log(dX + " : d X ");
		Debug.Log(Mathf.Floor(v1_x) + " desimal of v1_x  ");
		
		//edge of rocks
		xEdgeTop = v1_x + (0.5*xScale);
		zEdgeTop = v1_z + (0.5*zScale);
		xEdgeBtm = v1_x - (0.5*xScale);
		zEdgeBtm = v1_z - (0.5*zScale);
		
		// distance btw Up side of hole and Up side of Stone on Z axis
		var dZ2 : float = Mathf.Abs(29 - zEdgeTop);
		// distance btw Bottom side of hole and Bottom side of Stone on Z axis
		var dZ3 : float = Mathf.Abs(23 - zEdgeBtm);
		Debug.Log(dZ + " : d Z " + dZ2 + " dZ2 "+ dZ3 + " dZ3");
		//to set position of stone
		if (Mathf.Floor(v1_x) <= 0 )
		{
			if ( dX <= 1.5 )
				{
					// pararel on the TOP
					zStone  = v1_z + (zScale/10);
					xStone  = v1_x;
					Debug.Log(" top of hole " );				
				}
			else 
			{
				if ( v1_z >= 27 && v1_z <=35 )
					{
						// parallel to the left
						xStone  = v1_x - (xScale/10);
						zStone  = v1_z ;
						Debug.Log("  parallel to the left" );		
						stonePosition = "~ parallel to the left ";								
					}
					else 
					//if ( dZ > 1.5 || dZ3 >1.5 || dZ2 >1.5 )
					{
						if (v1_z < 27)
						{
							// if stone in left bottom
							xStone = v1_x - (xScale/10);
							zStone = v1_z - (zScale/10);
							Debug.Log(" left bottom " );	
							stonePosition = "~ left bottom ";	
						}
						else
						{	// if stone in left top
							xStone = v1_x - (xScale/10);
							zStone = v1_z + (zScale/10);
							Debug.Log(" left top " );	
							stonePosition = "~ left top ";	
						}
					}
			}
		}
		else if (Mathf.Floor(v1_x) > 0 )
		{
			if ( dX <= 1.5 )
			{
				// pararel on bottom
				zStone  = v1_z - (zScale/10);
				xStone  = v1_x;
				Debug.Log(" bottom of hole " );	
				stonePosition = "~ bottom of hole ";	
			}
			else
			{
				if ( v1_z >= 27 && v1_z <=35 )
				//( dZ <= 1.5  || dZ3 <= 1.5 || dZ2 <=1.5) 
				{
				// parallel to the right
					xStone  = v1_x + ( xScale/10);
					zStone  = v1_z ;
					Debug.Log("  parallel to the left right " );	
					stonePosition = "~ parallel to the left right ";	
				}
				else  
				//if ( dZ > 1.5 || dZ3 > 1.5 || dZ2 >1.5 ) 
				{
					if (v1_z <27)
						{	// if stone in right bottom
							xStone = v1_x + (xScale/10);
							zStone = v1_z - (zScale/10);
							Debug.Log(" right bottom " );	
							stonePosition = "~ right bottom ";	
						}
					else
						{	// if stone in right top
							xStone = v1_x + (xScale/10);
							zStone = v1_z + (zScale/10);
							Debug.Log(" right top " );	
							stonePosition = "~ right top ";	
						}
				}
			}
		}
}

function goHole ()
{
	var v3 : Vector3 = Vector3(xHole, yHole, zHole) - transform.position ;
	transform.Translate(v3*0.1);						
	Debug.Log( "go to the hole " );
	stoneUDP = false;	
	goUp = true;	
}

function backPosition()
{
	if (goUp == true)
			{
				//make robot Up
				var up : Vector3 = Vector3(transform.position.x, yUp+1, transform.position.z) - transform.position ;
				transform.Translate(up*0.1);				
				if (transform.position.y >=yUp) { goUp = false; }
				// catch stone
				var v2 : Vector3 = Vector3(xDef, transform.position.y , zDef) - transform.position ;
				transform.Translate(v2*0.1);	
			}else
			{
				// make robot down					
				var down : Vector3 = Vector3(xDef, yDef , zDef) - transform.position ;
				transform.Translate(down*0.1);	
				goUp = false;
			}	
}

function Update () {
	//var timeNow : float = Time.realtimeSinceStartup;
	
	getPosisiton();
	Debug.Log("x y z : " + v1_x +"  "+ v1_y +"  "+ v1_z);
	Debug.Log("Scale of x y z : " + xScale +"  "+ yScale +"  "+ zScale);
	
	if (repeat == true)
	{
		if (v1_x != 0 && v1_y != -13 && v1_z != 21.4)
		{
			setPosition();
			Debug.Log( "will move to "+ xStone + " in x axis and "+ zStone + " in z axis ");
			
			//move model to the position
			if (goUp == true)
			{
				//make robot Up
				var up : Vector3 = Vector3(transform.position.x, yUp+1, transform.position.z) - transform.position ;
				transform.Translate(up*0.1);				
				if (transform.position.y >=yUp) { goUp = false; }
				// catch stone
				var v2 : Vector3 = Vector3(xStone, transform.position.y , zStone) - transform.position ;
				transform.Translate(v2*0.1);	
			}else
			{
				if (v2.magnitude > 1)
				{  // if jib move far from stone, this code will make more near
					var filya : Vector3 = (v2 / 5.0 );
					transform.Translate(filya*0.1);					
					Debug.Log( " long magnitude " );
				}
				// make robot down					
				var down : Vector3 = Vector3(xStone, yDown, zStone) - transform.position ;
				transform.Translate(down*0.1);	
				goUp = false;
				if (transform.position.x == xStone && transform.position.z == zStone)
				{ 
					repeat = false; 
					Debug.Log( "no repeat "); 
					resetRocks = true;
					i=1;
					reset();
					Debug.Log( "resetRocks" + resetRocks );						
				}				
				
			}	
		
			//push to the hole
			if (Input.GetKey(KeyCode.Space))
			{		
				Debug.Log("fILYAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");	
				goHole ();	
				goUp = true;
				resetRocks = true;
				backPosition();
			}	
		}
	}
}