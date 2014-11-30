var rotation_speed : float = 1;
var translation_speed : float = 1;
var a : int = 0;
var i : int = 1 ;
//coordinate of hole
var xHole : float = 0;
var yHole : float = -14;
var zHole : float = 26;
//coordinate for move robot up and down
var yUp : float = -7;
var yDown : float = 0;
//coordinate of stone
var xStone : float = 0;
var zStone : float = 0;
//scale of stone
var xScale : float = 0;
var zScale : float = 0;
//edge of stone
var xEdgeTop : float = 0;
var zEdgeTop : float = 0;
var xEdgeBtm : float = 0;
var zEdgeBtm : float = 0;

var stoneUDP : boolean = true;
var goUp: boolean = true;
var sendServer : boolean = false;
var timer : boolean = false;
//distance or magnitude btw hole and stone
var dist : float = 0; 
var stonePosition = "none"; 
var projectile : Rigidbody;


InvokeRepeating("Run",2,0.1);
function Run()
{
	if(a<2){
		a++;
	}
	
	// find open cv and udp 	
	openCV = GameObject.Find("scripts").GetComponent("stonesUDP") ;
	sendRobot= GameObject.Find("sphere_tip").GetComponent("sendUDP") ;
	
	//openCV.enabled = true ; //opencv
	//sendRobot.enabled = true ; //sendUDP		
	
	if ( stoneUDP == false )
	{
			// get stone			
			Debug.Log( i + "i" );
			var v1 = GameObject.Find("stone_"+i);
			//var v1 = GameObject.Find("Cube"+i);
						
			//position of rocks
			v1_x = v1.GetComponent("controlPosition").xStone ;
			v1_y = v1.GetComponent("controlPosition").yStone ;
			v1_z = v1.GetComponent("controlPosition").zStone ;
			
			//make instance of stone
			instance = Instantiate (v1);
			
			//scale of rocks
			xScale = v1.GetComponent("controlPosition").xScale ;
			yScale = v1.GetComponent("controlPosition").yStone;
			zScale = v1.GetComponent("controlPosition").zStone ;
			/*
			var v1 : Vector3 = GameObject.Find("stone_"+i).transform.position;
			Debug.Log( v1.x + " xstone " + v1.y + " ystone " + v1.z + " zstone " );
			//var testStone : GameObject = GameObject.Find("Cube");			
			var testStone : GameObject = GameObject.Find("stone_"+i);
			
			//position of rocks
			xStone = GameObject.Find("stone_"+i).GetComponent("controlPosition").xStone ;
			yStone = GameObject.Find("stone_"+i).GetComponent("controlPosition").yStone ;
			zStone = GameObject.Find("stone_"+i).GetComponent("controlPosition").zStone ;
			
			//make instance of stone
			instance = Instantiate (testStone);
			
			//scale of rocks
			xScale = GameObject.Find("stone_"+i).GetComponent("controlPosition").xScale ;
			yScale = GameObject.Find("stone_"+i).GetComponent("controlPosition").yStone;
			zScale = GameObject.Find("stone_"+i).GetComponent("controlPosition").zStone ;
			*/
			yDown = v1_y + (0.5*yScale) - 2 ;  
			Debug.Log( yDown + " yDown " );
			/*
			//edge of rocks
			xEdgeTop = v1.x + (0.5*xScale);
			zEdgeTop = v1.z + (0.5*zScale);
			xEdgeBtm = v1.x - (0.5*xScale);
			zEdgeBtm = v1.z - (0.5*zScale);
			*/			
			// distance btw Z hole and Z Stone 
			var dZ : float = Mathf.Abs(zHole - v1_z);	
/*			
			// distance btw Up side of hole and Up side of Stone on Z axis
			var dZ2 : float = Mathf.Abs(29 - zEdgeTop);
			// distance btw Bottom side of hole and Bottom side of Stone on Z axis
			var dZ3 : float = Mathf.Abs(23 - zEdgeBtm);
*/			
			Debug.Log(dZ + " : d Z");
			
			// distance btw X hole and X Stone 
			var dX : float = Mathf.Abs(xHole - v1_x);
			Debug.Log(dX + " : d X ");
			Debug.Log(Mathf.Floor(v1_x) + " :Mathf.Floor(v1_x)  ");
					
			if (Mathf.Floor(v1_x) <= 0 )
				{
					if ( dX <= 1.5 )
					{
						// pararel on the TOP
						zStone  = v1_z + (zScale/3);
						xStone  = v1_x;
						Debug.Log(" top of hole " );				
					}
					else
					{		if ( dZ <= 1.5  )//|| dZ3 <= 1.5 || dZ2 <=1.5 
							{
								// parallel to the left
								xStone  = v1_x - (xScale/3);
								zStone  = v1_z ;
								Debug.Log("  parallel to the left" );		
								stonePosition = "~ parallel to the left ";								
							}
							else if ( dZ > 1.5  )//|| dZ3 >1.5 || dZ2 >1.5
							{
								if (v1_z <25)
								{
									// if stone in left bottom
									xStone = v1_x - (xScale/3);
									zStone = v1_z - (zScale/3);
									Debug.Log(" left bottom " );	
									stonePosition = "~ left bottom ";	
								}
								else
								{	// if stone in left top
									xStone = v1_x - (xScale/3);
									zStone = v1_z + (zScale/3);
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
						zStone  = v1_z - (zScale/3);
						xStone  = v1_x;
						Debug.Log(" bottom of hole " );	
						stonePosition = "~ bottom of hole ";	
					}
					else
					{
						if ( dZ <= 1.5 ) // || dZ3 <= 1.5 || dZ2 <=1.5
						{
							// parallel to the right
							xStone  = v1_x + ( xScale/3);
							zStone  = v1_z ;
							Debug.Log("  parallel to the left right " );	
							stonePosition = "~ parallel to the left right ";	
						}
						else  if ( dZ > 1.5   ) //|| dZ3 > 1.5 || dZ2 >1.5
						{
							if (v1_z <25)
							{	// if stone in right bottom
									xStone = v1_x + (xScale/3);
									zStone = v1_z - (zScale/3);
									Debug.Log(" right bottom " );	
									stonePosition = "~ right bottom ";	
							}
							else
							{	// if stone in right top
								xStone = v1_x + (xScale/3);
								zStone = v1_z + (zScale/3);
								Debug.Log(" right top " );	
								stonePosition = "~ right top ";	
							}
						}
					}
				}
				Debug.Log( xStone+ " xtip " + zStone+ " ztip " );
				stoneUDP = true;	
		}
		else
		{
				
				if (goUp == true)
				{
					//make robot UP
					var up : Vector3 = Vector3(transform.position.x, yUp+1, transform.position.z) - transform.position ;
					transform.Translate(up*0.1);	
					//instance.velocity =  up*0.1;	
					if (transform.position.y >=yUp)
					{
						goUp = false;						
					}
								
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
					var down : Vector3 = Vector3(transform.position.x, yDown, transform.position.z) - transform.position ;
					transform.Translate(down*0.1);
					timer = true;
					 //sending data to server
					if (transform.position.y <= yDown)
					{
						sendServer = true ; //sendUDP						
					}
					else
					{
						sendServer = false ; 
					}
				//Debug.Log("Send Server : " + sendServer);
				}
				
				if (Input.GetKey(KeyCode.Space))
					{
						//push to the hole
						var v3 : Vector3 = Vector3(xHole, yHole, zHole) - transform.position ;
						transform.Translate(v3*0.1);
						
						Debug.Log( "go to the hole " );
						stoneUDP = false;	
						goUp = true;						
					}	

				//set default position
				if(Input.GetKey(KeyCode.Delete))
				{
					var center = Vector3(-2.261853,-10.75,21.65002)-transform.position;
					transform.Translate(center *0.1);
				}
				/*
				//go to next rocks
				if(Input.GetKey(KeyCode.Home))
				{
					i = i+1;
					if (i>4)
					{
						i = 1 ; 
					}
				}
				*/
				
		}
	
}