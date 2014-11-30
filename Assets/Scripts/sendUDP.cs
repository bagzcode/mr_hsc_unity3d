using UnityEngine;
using System;
using System.Net;
using System.Text;
using System.Net.Sockets;
using System.Threading;

public class sendUDP : MonoBehaviour {
	//for datagram to send to robot
	uint empty_size = 0;
	short sequence_number = 0;
	int data_id = 0;
	
	byte[] sendBytes = new byte[34];
	byte[] receiveBytes = new byte[64];
	byte[] empty_size_bytes = new byte[4];
	byte[] sequence_number_bytes = new byte[2];
	byte[] data_id_bytes = new byte[4];
	byte[] x_bytes = new byte[8];
	byte[] y_bytes = new byte[8];
	byte[] z_bytes = new byte[8];

	int unit = 100; //units difference btw robot and unity
	int err_frame_mini = 0;
	
	//string test1, test2 ;
	
	float offset_x ;
	float offset_y ;
	float offset_z ;
	float z;
	//position of the 3D tip
	static double coord_x ;
	static double coord_y ;
	static double coord_z ;
	
	//coordinates received by robot
	byte[]  robot_x = new byte[8];
	byte[]  robot_y = new byte[8];
	byte[]  robot_z = new byte[8];

	static Thread receiveThread;	
	static IPEndPoint ep = new IPEndPoint(IPAddress.Any, 50002);	
	static UdpClient udpClient = new UdpClient(ep);
	//static IPAddress ip_rb = IPAddress.Parse("150.229.9.120");
	//static IPEndPoint ep = new IPEndPoint(ip_rb, 50002);
	
	Vector3 loc;
	bool test = true ;
//	bool test_enable = false ;
//	bool sendServer = false ; 
	
	void Start ()
	{		
		udpClient.Client.ReceiveBufferSize =  64;
		//Debug.Log(	udpClient.Client.ReceiveBufferSize);
		empty_size_bytes = BitConverter.GetBytes(empty_size);
		data_id_bytes = BitConverter.GetBytes(data_id);
		udpClient.Connect("150.229.9.120", 50002); //robot arm
	}
	
	void Update ()
	{	//locator1 represents the starting position, the cross on the playboard
		while(test==true)
		{
			loc = GameObject.Find("locator1").transform.position;
			offset_x = loc.x;
			offset_y = loc.y - 3;			
			offset_z = loc.z;
			transform.position = loc;
			test = false ;
		}
		
		//get sphere_tip position
		z = transform.position.z - 5;
		coord_x = z  - offset_z  ;
		coord_y = transform.position.x - offset_x ;
		coord_z = transform.position.y  - offset_y  ;
		
		Debug.Log(coord_x + " " + coord_y + " " + coord_z);

		sendData(-coord_y/unit, coord_z/unit, coord_x/unit);
		receiveData();
	}
	
	void sendData(double x, double y, double z)
	{
		sequence_number++;				
		sequence_number_bytes = BitConverter.GetBytes(sequence_number);		
		x_bytes = BitConverter.GetBytes(x);
		y_bytes = BitConverter.GetBytes(y);
		z_bytes = BitConverter.GetBytes(z);
		
		//4bytes empty + 2bytes seq nb + 4bytes ID + 8bytes X + 8bytes Y + 8bytes Z
		System.Buffer.BlockCopy(empty_size_bytes, 0, sendBytes, 0, 4);
		System.Buffer.BlockCopy(reverseBytes(sequence_number_bytes,2), 0, sendBytes, 4, 2);
		System.Buffer.BlockCopy(data_id_bytes, 0, sendBytes, 6, 4);
		System.Buffer.BlockCopy(reverseBytes(x_bytes,8), 0, sendBytes, 10, 8);
		System.Buffer.BlockCopy(reverseBytes(y_bytes,8), 0, sendBytes, 18,  8);
		System.Buffer.BlockCopy(reverseBytes(z_bytes,8), 0, sendBytes, 26, 8);
		
		//only send last position if already in right position, not every frames
		//if (sendServer == true)
		udpClient.Send(sendBytes, 34); //send to robot
		myThread(); //received from robot
		deltaUdp(); //delta btw robot and 3D values
		//displayBytes(sendBytes);
	}
	
	byte[] reverseBytes(byte[] myBytes, int nb)
	{	//to reverse byte : 00-01 >> 01-00
		byte[] networkBytes = new byte[nb];
		
		for(int i=0 ; i<nb ; i++)
		{
			networkBytes[nb-1-i] = myBytes[i];
		}
		return networkBytes;
	}
	
	void displayBytes(byte[] myBytes)
	{	//display datagram in th console
		string myString = "";
		myString = BitConverter.ToString(myBytes);
		Debug.Log(myString);
	}
	
	void receiveData()
	{	//receive data from robot
		//try
		//{
			receiveBytes = udpClient.Receive(ref ep);
		//}
		/*catch (SocketException socketException)
		{
			//Debug.Log(socketException.Message);
		}*/
	}
	
	void deltaUdp()
	{	//calcule delta btw robot and 3D and display tip_ghost if error > 1
		double er_x, er_y, er_z ;
		System.Buffer.BlockCopy(receiveBytes, 10, robot_x, 0, 8);
		System.Buffer.BlockCopy(receiveBytes, 18, robot_y, 0, 8);
		System.Buffer.BlockCopy(receiveBytes, 26, robot_z, 0, 8);
		er_x = -coord_y - BitConverter.ToDouble(reverseBytes(robot_x, 8), 0)*unit;
		er_y = coord_z - BitConverter.ToDouble(reverseBytes(robot_y, 8), 0)*unit;
		er_z = coord_x - BitConverter.ToDouble(reverseBytes(robot_z, 8), 0)*unit;
		//Debug.Log("er_x = " + er_x +"   er_y = "+ er_y +"   er_z = "+ er_z);
		
		if(Mathf.Abs((float)er_x)>1 || Mathf.Abs((float)er_y)>1 || Mathf.Abs((float)er_z)>1)
		{ 
			if(err_frame_mini < 10) // if error last more than n frames, solve last buffer issues
			{
				err_frame_mini++;
			}
			else {
				GameObject.Find("tip_ghost").renderer.enabled = true ;
				float a = (float)BitConverter.ToDouble(reverseBytes(robot_x, 8), 0) *unit;
				float b = (float)BitConverter.ToDouble(reverseBytes(robot_y, 8), 0) *unit;
				float c = (float)BitConverter.ToDouble(reverseBytes(robot_z, 8), 0) *unit;
				
				GameObject.Find("sphere_tip_ghost").transform.position = new Vector3( -a, b-20.5f+7, c+21.4f ) ;
				GameObject.Find("tip_ghost").transform.rotation = GameObject.Find("tip").transform.rotation ;
			}
		} else {
			err_frame_mini = 0;
			GameObject.Find("tip_ghost").renderer.enabled = false ;
		}
		
		//test1 = "er_x = " + er_x.ToString("f2") +"   er_y = "+ er_y.ToString("f2") +"   er_z = "+ er_z.ToString("f2") ;
		//test2 = (-coord_y).ToString("f2") + "      " + (BitConverter.ToDouble(reverseBytes(robot_x, 8), 0)*unit).ToString("f2");
	}
	
	void myThread()
	{	//receive from robot thread
		receiveThread = new Thread(receiveData);
        receiveThread.IsBackground = true;
		receiveThread.Start();
        receiveThread.Abort();	 
	}
	
	//~ void OnGUI ()
	//~ {
		//~ GUI.Label (new Rect (10, 20, 400, 20), test1);
		//~ GUI.Label (new Rect (10, 30, 400, 20), test2);
	//~ }
}