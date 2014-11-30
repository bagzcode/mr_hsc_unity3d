using UnityEngine;
using System.Collections;
using System;
using System.IO;

public class moveStone : MonoBehaviour {

String x, y ;
float pos_x = 0, pos_y = 0;
int Gx, Gy, Lu, Lv ;
	
	void Update ()
	{
		using (StreamReader sr = new StreamReader("G:\\ANU\\VS2005\\Projects\\OpenCV_01\\OpenCV_01\\gravity.txt")) 
		{
			String line;
			while ((line = sr.ReadLine()) != null) 
			{
				line = line.Replace('.',',');
				string [] split = line.Split(new Char [] {' '});
				Gy = Convert.ToInt32(split[0]);
				Gx = Convert.ToInt32(split[1]);
				Lv = Convert.ToInt32(split[2]);
				Lu = Convert.ToInt32(split[3]);
				pos_x = Gx *41/Lu +8;
				pos_y = (Lv-Gy) *26/Lv -14;
				
				transform.position = new Vector3(pos_y, -12.8f, pos_x);
			}
		}
	}
	
}
