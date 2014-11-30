
//coordinate of stone in default position
var xStone : float = 0;
var yStone : float = -13;
var zStone : float = 21.4;
//scale of stone
var xScale : float = 0;
var zScale : float = 0;
var yScale : float = 0;
var obj : boolean = false;
var click : boolean = false ;

function OnMouseDown () {
	
	click = true ;
	var rockPosition : Vector3 = transform.position ;	
	Debug.Log("The rock position is : " + rockPosition.x + " " + rockPosition.y + " " + rockPosition.z);
	//position of rocks
		xStone = rockPosition.x ;
		yStone = rockPosition.y ;
		zStone = rockPosition.z ;
		
	var rockScale : Vector3 = transform.localScale ;	
	//scale of rocks
		xScale = rockScale.x ;
		yScale = rockScale.y ;
		zScale = rockScale.z ;		
	Debug.Log("The rock scale is : " + rockScale.x + " " + rockScale.y + " " + rockScale.z);	
	

}

