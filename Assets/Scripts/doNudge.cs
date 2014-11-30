//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

using UnityEngine;
using System.Collections;

public class doNudge : MonoBehaviour {

	float delay = 0.02f ; //20ms btw each points
	int nudgeCount = 0 ;

	void OnEnable()
	{
		StartCoroutine(goNudge());
	}
	
	IEnumerator goNudge()
	{
		GameObject gazeObject = GameObject.Find("Gaze Camera") ;
		controlGazeCamera gazeScript = gazeObject.GetComponent<controlGazeCamera>() ;
		gazeScript.enabled = false ;
		transform.position += new Vector3(0,0,1);
		yield return new WaitForSeconds (delay);
		transform.position += new Vector3(1,0,-1);
		yield return new WaitForSeconds (delay);
		transform.position += new Vector3(-1,0,-1);
		yield return new WaitForSeconds (delay);
		transform.position += new Vector3(-1,0,1);
		yield return new WaitForSeconds (delay);
		transform.position += new Vector3(1,0,1);
		yield return new WaitForSeconds (delay);
		transform.position += new Vector3(0,0,-1);
		yield return new WaitForSeconds (delay);
		nudgeCount++;
		gazeScript.enabled = true ;
		enabled = false ;
	}
	
}
