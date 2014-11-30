#include "RbTracking.h"

int main()
{	
	RbTracking cap ;//object rbTracking loadLastCalibration() and placeCamera() in constructor

	cap.createCapture();//create src bin hom
	cap.setWindows();//create windows
	cap.mouseCallback(&cap);//create mouse callback linked to mouseEvent()

	//Image Processing / exit on key 'q'
    while(cap.key != 'q')
    {
		cap.queryFrame();//capture >> src
		cap.wrapAndBin();//wrap perspective and binarization
		//cap.doGravity();//compute white pixels gravity center and send value by UDP
		//cap.drawRectangle(); //draw rectangle on the gravity point
		cap.detectStones();
		cap.showImages();//display src bin hom		 
        cap.key = cap.waitKey(10);
    }

	//clear memory and windows    
	cap.~RbTracking();
	return 0; 
}