//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

var offset_x : float = 15.3;
var offset_z : float = -13.9;
private var pos_x : float ;
private var pos_z : float ;

function Start() {
	pos_x = transform.position.x;
	pos_z = transform.position.z;
	transform.position.x = pos_x + offset_x;
	transform.position.z = pos_z + offset_z;
}
