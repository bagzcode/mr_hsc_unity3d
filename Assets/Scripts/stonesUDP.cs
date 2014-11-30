using UnityEngine;
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.IO;

public class stonesUDP : MonoBehaviour {

static IPEndPoint ep = new IPEndPoint(IPAddress.Any, 0);
static UdpClient udpClient = new UdpClient(28280);
static byte[] receiveBytes = new byte[64];
static string returnData = "";
static Thread receiveThread;
int Lu=384, Lv=288 ; //OpenCV video stream resolution
float Bu=29.4f , Bv=43.8f;
int nb_stones = 0, nb_stones_max = 0, nb_stones_it = 0;
public GameObject stonePrefab ;
Quaternion stoneAngle = new Quaternion(0,0,0,0);
	
	void Start()
	{
		udpClient.Client.ReceiveBufferSize =  64;
		ReceiveData(); //from OpenCV program
	}
	
	void Update()
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
		if(returnData.Contains("nostones"))
		{
			destroyStones(nb_stones, 0);
		}
		//translate datagram from OpenCV program		
		if(!returnData.Contains("nostones") && returnData != "")
		{ 	
			string [] splits = returnData.Split(new Char [] {';'});
		
			int[] stone = new int[5];
			stone[0] = Convert.ToInt32(splits[0]) ; //stone_ID
			stone[1] = Convert.ToInt32(splits[1]) ; //stone_x
			stone[2] = Convert.ToInt32(splits[2]) ; //stone_y
			stone[3] = Convert.ToInt32(splits[3]) ; //stone_width
			stone[4] = Convert.ToInt32(splits[4]); //stone_height
			countStones(stone[0]);
			instantiateStones(stone);
		}
	}
	
	void instantiateStones(int[] stone)
	{	//create new stone
		//first we test if the stone exists
		GameObject testStone = GameObject.Find("stone_"+ stone[0]);
		// -3f and +4f are manual adjustement values
		float scale_x = stone[3] *Bu/Lu ;
		float scale_z = stone[4] *Bv/Lv - 3f;
		float pos_x = stone[2] *Bv/Lv - Bv/2 + 4f;
		float pos_z = (stone[1]-Lu) *Bu/Lu + Bu/2;
		if(testStone == null)
		{  
			Vector3 stonePosition = new Vector3(0, 0, 0);
			GameObject newStone = (GameObject)Instantiate(stonePrefab, stonePosition, stoneAngle) ;
			newStone.renderer.enabled = false ;
			//the stones are children of the board so pos_x and pos_z are computed in the local transform
			newStone.transform.parent = GameObject.Find("polySurface1").transform ;
			newStone.transform.localPosition = new Vector3(pos_x, 6.66f, pos_z);
			newStone.transform.localScale = new Vector3( scale_x, 3 , scale_z);
			newStone.renderer.enabled = true ;
			newStone.name = "stone_"+ stone[0] ;
		} else {
			if(    Mathf.Abs(testStone.transform.localScale.x - scale_x)>1
				||Mathf.Abs(testStone.transform.localScale.z - scale_z)>1
				||Mathf.Abs(testStone.transform.localPosition.x - pos_x)>10
				||Mathf.Abs(testStone.transform.localPosition.z - pos_z)>10
				&& testStone
			  )
				{
					Destroy (GameObject.Find("stone_"+ stone[0]));
				}
			/*else 
				{
					testStone.transform.position = new Vector3(pos_x, 6.66f, pos_z);
				}*/
		}
	}
	
	void countStones(int stone_ID)
	{
		if(nb_stones_it < 20) //every n frames
		{
			if(stone_ID > nb_stones_max) nb_stones_max = stone_ID ;
			nb_stones_it++;
		} else {
			if(nb_stones > nb_stones_max)
			{
				destroyStones(nb_stones, nb_stones_max);
			}
			nb_stones = nb_stones_max ;
			nb_stones_it = 0 ;
			nb_stones_max = 0 ;
		}
	}
	
	void destroyStones(int nb, int nb_max)
	{
		int e = nb - nb_max ;
		for(int i=0 ; i < e ; i++)
		{
			int nb_des = nb_max+i +1;
			Destroy (GameObject.Find("stone_"+ nb_des));
		}
	}
	
	void video_resolution()
	{
		using (StreamReader sr = new StreamReader("video_resolution.txt")) 
		{
			string [] split = sr.ReadLine().Split(new Char [] {' '});
			Lu = Convert.ToInt32(split[0]);
			Lv = Convert.ToInt32(split[1]);
		}
	}
}

