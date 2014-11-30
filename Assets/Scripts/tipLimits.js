//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

function FixedUpdate () {
	if(transform.position.x < -15) transform.position.x = -15;
	if(transform.position.x > 15) transform.position.x = 15;
	if(transform.position.y < -13) transform.position.y = -13;
	if(transform.position.y > 0) transform.position.y = 0;
	if(transform.position.z < 16) transform.position.z = 16;
	if(transform.position.z > 36) transform.position.z = 36;
}