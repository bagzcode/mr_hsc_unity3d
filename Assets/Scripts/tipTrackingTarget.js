//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

private var delay : float = 0 ;
private var timer : float ;
private var speed : float = 0.8;
private var endPoint : Vector3 ;
private var _fieldOfView : float ;
private var previous_fieldOfView : float ;
private var zooming_in : boolean ;
private var changeTarget_on : boolean ;
private var started : boolean ;

function Start()
{
	timer = delay ;
	endPoint = GameObject.Find("sphere_tip").transform.position ;
	started = false ;
}

function FixedUpdate () {
	_fieldOfView = GameObject.Find("Gaze Camera").camera.fieldOfView ;
	
	var startPoint : Vector3 = transform.position ;
	var _direction : Vector3 = endPoint - startPoint ;
	
	if(previous_fieldOfView > _fieldOfView) zooming_in = true ;
	else zooming_in = false ;
	
	previous_fieldOfView = _fieldOfView ;
	
	//if eye tracking disabled then tip tracking
	if(!GameObject.Find("Gaze Camera").GetComponent("gazeUDP").eyetracking)
	{
		if(_fieldOfView > 45 || changeTarget_on) changeTarget() ;
		
		if(!changeTarget_on){
			//delay the tip tracking
			if(delay != 0){
				transform.Translate(_direction * Time.deltaTime);
				trackTip();
			} else transform.position = GameObject.Find("sphere_tip").transform.position ;
		}
	}
}

function trackTip () {
    while (Time.time < timer) {
        yield; //wait one frame but the rest of the Update function continues
    }
	timer = Time.time + delay;
	endPoint = GameObject.Find("sphere_tip").transform.position ;
}

function changeTarget()
{
	changeTarget_on = true ;
	if(GameObject.Find("Gaze Camera").camera.fieldOfView < 47 && zooming_in || started)
	{
		started = true ;
		endPoint = GameObject.Find("sphere_tip").transform.position ;
		var startPoint : Vector3 = transform.position ;
		var _direction : Vector3 = endPoint - startPoint ;
		var e : float = Mathf.Abs(startPoint.x - endPoint.x) + Mathf.Abs(startPoint.y - endPoint.y) + Mathf.Abs(startPoint.y - endPoint.y) ;
		
		if(e > 0.4) transform.Translate(_direction.normalized /2);
		else {
			changeTarget_on = false ;
			started = false ;
		}
	}
}