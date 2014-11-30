//////////////////////////////////////
// Created by Stephane Bersot - 2010
// www.stephanebersot.com
//////////////////////////////////////

using UnityEngine;
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.IO;

public class clickUDP : MonoBehaviour {

static IPEndPoint ep = new IPEndPoint(IPAddress.Any, 0);
static UdpClient udpClient = new UdpClient(28281);
static byte[] receiveBytes = new byte[64];
static string returnData = "";
static Thread receiveThread;
	
	void Start()
	{
		udpClient.Client.ReceiveBufferSize =  64;
		ReceiveData(); //from OpenCV program
	}
	
	void FixedUpdate()
	{
		myThread(); //thread to receive from OpenCV
		handleData();
	}
	
	void myThread()
	{
		receiveThread = new Thread(ReceiveData);
        receiveThread.IsBackground = true;
		receiveThread.Start();
        receiveThread.Abort();		
	}
	
	void ReceiveData()
	{
		receiveBytes = udpClient.Receive(ref ep); 
		returnData = Encoding.ASCII.GetString(receiveBytes);
	}
	
	void handleData()
	{	
		if(returnData.Contains("nodata")) print("nodata");
		//translate datagram from OpenCV program		
		if(!returnData.Contains("nodata") && returnData != "")
		{ 	
			string [] splits = returnData.Split(new Char [] {';'});
		
			int[] coord = new int[4];
			coord[0] = Convert.ToInt32(splits[0]) ; //down.x
			coord[1] = Convert.ToInt32(splits[1]) ; //down.y
			coord[2] = Convert.ToInt32(splits[2]) ; //up.x
			coord[3] = Convert.ToInt32(splits[3]) ; //up.y
			print(coord[0] + " " + coord[1] + " " + coord[2] + " " + coord[3]);
		}
	}

}

