//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

using UnityEngine;
using System;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Text;

public class gazeUDP : MonoBehaviour {

static IPEndPoint ep = new IPEndPoint(IPAddress.Any, 28281);
static UdpClient udpClient = new UdpClient(ep);
static byte[] receiveBytes ;
static string returnData = "";
static Thread receiveThread;
	
bool headtracking = false ;
bool eyetracking = false ;
	
static float gaze_x=0, gaze_y=0, head_x=0, head_z=0 ; // head_y=0
static int gaze_width = 1280 , gaze_height = 1024 ;
float gaze_angle =0;
public float speedGaze = 1; //divided by - the real value comes from the GUI trackbar
public float speedHead = 1 ; //divided by - the real value comes from the GUI trackbar
float speedHead2 = 10f ; //multiplied by - value of the script used
public int zoom_0 = 12 ;
	
	void Awake()
	{
		udpClient.Client.ReceiveBufferSize =  64;
	}
	
	void FixedUpdate ()
	{
		gaze_angle = camera.fieldOfView ;
		myThread(); 
		if(returnData != "") splitString();
		controlCamera();
	}
	
	void ReceiveData()
	{
		receiveBytes = udpClient.Receive(ref ep); 
		returnData = Encoding.ASCII.GetString(receiveBytes);
	}
	
	void myThread()
	{
		receiveThread = new Thread(ReceiveData);
        receiveThread.IsBackground = true;
		receiveThread.Start();
        receiveThread.Abort();		
	}
	
	void splitString()
	{	//translate datagram from coredata program
		string [] splits = returnData.Split(new Char [] {' '});
		int i=0 ;
		foreach(string split in splits)
		{
			if(split != "")
			{
				if(i == 0 ) gaze_x = Convert.ToSingle(split);
				if(i == 1 ) gaze_y = Convert.ToSingle(split);
				if(i == 2 ) head_x = Convert.ToSingle(split);
				//if(i == 3 ) head_y = Convert.ToSingle(split);
				if(i == 4 ) head_z = Convert.ToSingle(split);
				i++;
			}
		}
	}
	
	void controlCamera()
	{
		if(eyetracking)
		{
			float angle_width = 0, angle_height = 0 ;
			
			if(gaze_x!=0 || gaze_y!=0)
			{
				angle_width = Mathf.Abs(gaze_width/2 - gaze_x) *gaze_angle/gaze_width /speedGaze;
				angle_height = Mathf.Abs(gaze_height/2 - gaze_y) *(gaze_angle*gaze_height/gaze_width)/gaze_height /speedGaze;
				if(gaze_x<gaze_width/2)
				{
					transform.RotateAround(transform.position, Vector3.up, -angle_width);
				} else {
					transform.RotateAround(transform.position, Vector3.up, angle_width);
				}
				
				if(gaze_y<gaze_height/2)
				{
					transform.Rotate(new Vector3(-angle_height,0,0));
				} else {
					transform.Rotate(new Vector3(angle_height,0,0));
				}
			}
		}
		
		if(headtracking)
		{
			//rotation
			if(head_x > 40)
				transform.RotateAround(GameObject.Find("sphere_tip").transform.position, Vector3.up, -1/speedHead*speedHead2);
			if(head_x < -50)
				transform.RotateAround(GameObject.Find("sphere_tip").transform.position, Vector3.up, 1/speedHead*speedHead2);
			//zoom in / out
			
			float zoom_in = zoom_0-(550-head_z)*(7/4)/speed_zoom() ;
			float zoom_out= zoom_0+(head_z-660)*(7/4);
			
			if(head_z < 550)
				if(zoom_in > 2) {
					camera.fieldOfView = zoom_in ;
				} else camera.fieldOfView = 2 ;
			else if(head_z > 660)
				if(zoom_out < 50) {
					camera.fieldOfView = zoom_out ;
				} else camera.fieldOfView = 50 ;
			else camera.fieldOfView = zoom_0;
		}
	}
	
	int speed_zoom()
	{
		if(zoom_0 > 0 && zoom_0 < 15) return 8 ;
		else if(zoom_0 >= 15 && zoom_0 < 35) return 4 ;
		else if(zoom_0 >= 35 && zoom_0 < 60) return 2 ;
		else return 4 ;
	}
	
}
