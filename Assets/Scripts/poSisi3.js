var xScale : float = 0;
var zScale : float = 0;
var yScale : float = 0;

//edge of stone
var xEdgeTop : float = 0;
var zEdgeTop : float = 0;
var xEdgeBtm : float = 0;
var zEdgeBtm : float = 0;
var resetRocks : boolean = false;
var goUp: boolean = true;
var timer : boolean = false;
var click : boolean = false;
var repeat : boolean = true;

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
var yHole : float = -13;
var zHole : float = 32;

//position of rocks
var v1_x : float ;
var v1_y : float ;
var v1_z : float ;
var v1 : GameObject;

var yUp : float = -7;
var yDown : float;
var a : int = 1;
var i : int = 1 ;
var rocks : int ;
var xStone : float;
var zStone : float;
var totalStone : int ;

function Start()
{
	transform.position.y = -13 ;
	GameObject.Find("tip_ghost").renderer.enabled = true ;
}

function cekStone()
{
	for (a=1; a<5;a++)
	{
		if (GameObject.Find("stone_"+a))
		{ //get total stone
			totalStone = a;

		}		
	}
}

function getPosisiton()
{	
	for (i=1; i<=totalStone; i++)
	{		
		var v1 = GameObject.Find("stone_"+i);				
		clicking = v1.GetComponent("clickObject").click ;
		if (clicking == true)
		{			
			rocks = i ; 
			//position of rocks
			v1_x = v1.GetComponent("clickObject").xStone ;
			v1_y = v1.GetComponent("clickObject").yStone ;
			v1_z = v1.GetComponent("clickObject").zStone ;	
		
			//scale of rocks
			xScale = v1.GetComponent("clickObject").xScale ;
			yScale = v1.GetComponent("clickObject").yScale;
			zScale = v1.GetComponent("clickObject").zScale ;
			//to make program not looping
			i = totalStone+1;			
		}
	}
}

function reset()
{
	v1_x = 0 ;
	v1_y = -10;
	v1_z = 0 ;
}

function setPosition ()
{
		yDown = v1_y + (0.5*yScale) -5 ;
		
		// distance btw Z hole and Z Stone 
		var dZ : float = Mathf.Abs(zHole - v1_z);		
		
		// distance btw X hole and X Stone 
		var dX : float = Mathf.Abs(xHole - v1_x);
		
		//edge of rocks
		xEdgeTop = v1_x + (0.5*xScale);
		zEdgeTop = v1_z + (0.5*zScale);
		xEdgeBtm = v1_x - (0.5*xScale);
		zEdgeBtm = v1_z - (0.5*zScale);
		
		// distance btw Up side of hole and Up side of Stone on Z axis
		var dZ2 : float = Mathf.Abs(29 - zEdgeTop);
		// distance btw Bottom side of hole and Bottom side of Stone on Z axis
		var dZ3 : float = Mathf.Abs(23 - zEdgeBtm);
		
		//to set position of stone
		if (Mathf.Floor(v1_x) <= 0 )
		{
			if ( dX <= 1.5 )
				{
					// pararel on the TOP
					zStone  = v1_z + (zScale/2);
					xStone  = v1_x;		
				}
			else 
			{
				if ( dZ <= 1.5 || dZ3 <= 1.5 || dZ2 <=1.5  )
					{
						// parallel to the left
						xStone  = v1_x - (xScale/2);
						zStone  = v1_z ;						
					}
					else if ( dZ > 1.5 || dZ3 >1.5 || dZ2 >1.5 )
					{
						if (v1_z <25)
						{
							// if stone in left bottom
							xStone = v1_x - (xScale/2);
							zStone = v1_z - (zScale/2);
						}
						else
						{	// if stone in left top
							xStone = v1_x - (xScale/2);
							zStone = v1_z + (zScale/2);
						}
					}
			}
		}
		else if (Mathf.Floor(v1_x) > 0 )
		{
			if ( dX <= 1.5 )
			{
				// pararel on bottom
				zStone  = v1_z - (zScale/2);
				xStone  = v1_x;
			}
			else
			{
				if ( dZ <= 1.5  || dZ3 <= 1.5 || dZ2 <=1.5) 
				{
				// parallel to the right
					xStone  = v1_x + ( xScale/2);
					zStone  = v1_z ;
				}
				else  if ( dZ > 1.5 || dZ3 > 1.5 || dZ2 >1.5 ) 
				{
					if (v1_z <25)
						{	// if stone in right bottom
							xStone = v1_x + (xScale/2);
							zStone = v1_z - (zScale/2);
						}
					else
						{	// if stone in right top
							xStone = v1_x + (xScale/2);
							zStone = v1_z + (zScale/2);
						}
				}
			}
		}
}

function goHole ()
{
	var v3 : Vector3 = Vector3(xHole, transform.position.y, zHole) - transform.position ;
	transform.Translate(v3);						
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

function FixedUpdate () {
	
	cekStone();	
	if (Input.GetKey(KeyCode.Home))
	{	
		backPosition();	
		goUp = true;
	}
	if (Input.GetKey(KeyCode.Space))
	{	
		goHole ();	
		goUp = true;
		backPosition();	
	}	
	getPosisiton();
	setPosition();	
	
	if (repeat == true)
	{
		if (v1_x != 0 && v1_y != -13 && v1_z != 21.4)
		{		
			//move model to the position
			if (goUp == true)
			{
				//make robot Up
				var up : Vector3 = Vector3(transform.position.x, yUp+1, transform.position.z) - transform.position ;
				transform.Translate(up*0.1);				
				if (transform.position.y >= yUp
					|| Mathf.Floor(transform.position.y) == Mathf.Floor (yUp)) 
					{ goUp = false; 					
					}
				// catch stone
				var v2 : Vector3 = Vector3(xStone, transform.position.y , zStone) - transform.position ;
				transform.Translate(v2*0.1);					
			}else
			{
				// make robot down					
				var down : Vector3 = Vector3(xStone, yDown, zStone) - transform.position ;
				transform.Translate(down*0.1);	
				goUp = false;
				if (Mathf.Floor(transform.position.y) == -14)
				{ 
					resetRocks = true;					
					reset();
					GameObject.Find("stone_"+rocks).GetComponent("clickObject").click = false;							
					//set search stone to start again from 1 
					i=1;
					goUp = true;
				}
				else
				{
					repeat = true;					
				}		
			}
			resetRocks = false;
		}
	}
	resetRocks = false;
}