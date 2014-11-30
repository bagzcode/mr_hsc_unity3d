using UnityEngine;
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public class capUDP : MonoBehaviour {

static IPEndPoint ep = new IPEndPoint(IPAddress.Any, 0);
static UdpClient udpClient = new UdpClient(28280);
static byte[] receiveBytes = new byte[32];
static string returnData = "";
static Thread receiveThread;
float pos_x = 0, pos_y = 0;
int Gx, Gy, Lu, Lv ;
	
	void Start () {
	}
	
	void Update () {
		receiveThread = new Thread(ReceiveData);
        receiveThread.IsBackground = true;
        receiveThread.Start();
        receiveThread.Abort();
		
		//hide cap for minimal values
		if(Gx <20 || Gy < 20)
		{
			renderer.enabled = false;
		} else
		{
			renderer.enabled = true;
			transform.position = new Vector3(pos_y, -12.8f, pos_x);
		}
	}
	
	void ReceiveData()
	{
		receiveBytes = udpClient.Receive(ref ep); 
		returnData = Encoding.ASCII.GetString(receiveBytes);
		if(returnData != "") moveStone(returnData);
	}
	
    void OnApplicationQuit() 
	{ 
    } 
	
	void moveStone(string data)
	{
		string [] split = data.Split(new Char [] {' '});
		Gy = Convert.ToInt32(split[0]);
		Gx = Convert.ToInt32(split[1]);
		Lv = Convert.ToInt32(split[2]);
		Lu = Convert.ToInt32(split[3]);
		pos_x = Gx *41/Lu +8;
		pos_y = (Lv-Gy) *26/Lv -14;
	}
	
}

