//suppress strncpy warnings
#define _CRT_SECURE_NO_DEPRECATE
#define _CRT_NONSTDC_NO_DEPRECATE

#include <winsock2.h>
#include "highgui.h"
#include "cv.h"
#include <iostream>
#include <string>
#include <sstream>
#include <fstream>
#pragma comment(lib, "ws2_32.lib")
using namespace std;

IplImage *src, *bin, *hom ;
CvPoint gravity = cvPoint(0, 0);
CvPoint A, B, C, D;
CvMat *H = cvCreateMat( 3, 3, CV_32FC1 );
int right_click = 0, axis = 0;
float Lu = 704, Lv = 576;
int r = 76, g = 175, b = 84, tolerance = 30;
char key = NULL;

int sendUDP(CvPoint Mp)
{
	WSADATA WSAData; //start WSAStartup()
    SOCKET sock; //init socket
    SOCKADDR_IN sin; //infos socket
    WSAStartup(MAKEWORD(2,2), &WSAData); //enable socket use
    sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP); //create socket

	// obtain the name of the host computer
	char chHostName[20];
	gethostname(chHostName, sizeof chHostName);
	// get the IP address of the host
	hostent* pHostent = gethostbyname(chHostName);	
	*(unsigned long*)&sin.sin_addr = *(unsigned long*)pHostent->h_addr_list[0];

    sin.sin_addr.s_addr = *(unsigned long*)&sin.sin_addr;
    //sin.sin_addr.s_addr = inet_addr("150.229.9.123");
	//sin.sin_addr.s_addr = htonl(INADDR_ANY); //address server
    sin.sin_family = AF_INET; //type socket
    sin.sin_port = htons(28280); //port nb
	stringstream out ;
	out << Mp.x << " " << Mp.y << " " << Lu << " " << Lv ;
	string str = out.str();
	size_t size = str.size() + 1;
	char *buffer = new char[size];
	strncpy( buffer, str.c_str(), size );
	sendto(sock, buffer, 32, 0, (SOCKADDR *)&sin, sizeof(sin));
	closesocket(sock);
	WSACleanup();
    return 0;
}

void writeToFile()
{
		//71 19 590 26 662 377 29 370
        ofstream file("calibration_points.txt", ios::out | ios::trunc);
		if(file){
			file << A.x << " " << A.y << " "
				<< B.x << " " << B.y << " "
				<< C.x << " " << C.y << " "
				<< D.x << " " << D.y ;
			file.close();
		} else {
			cerr << "Error opening calibration_points.txt" << endl;
		}
}

void findHomography()
{
	//find homography
	float a[] = {A.x, B.x, C.x, D.x,
				 A.y, B.y, C.y, D.y};
	//float b[] = {0, Lu, Lu, 0,
	//		     0, 0,  Lv, Lv};
	float b[] = {0, Lu, 598.64, 119.73,
		         0, 0,  368.22, 368.22};

	CvMat srcPoints = cvMat( 2, 4, CV_32FC1 , a );
	CvMat dstPoints = cvMat( 2, 4, CV_32FC1 , b );

	cvFindHomography(&srcPoints, &dstPoints, H, 0);

	//display homography matrix
	for(int i=0 ; i<3 ; i++)
	{
		for(int j=0 ; j<3 ; j++){
			cout << cvmGet(H, i,j)<< " " ;
		}
		cout << endl;
	}
	cout << "\n" << endl;
}


void mouseEvent(int event, int x, int y, int flags, void *param = NULL)
{
	CvScalar pixel;
	IplImage *bgr;
 
	//save pixel color on left-clic
	if(event == CV_EVENT_LBUTTONUP)	{
		bgr = cvCloneImage(src);
		pixel = cvGet2D(bgr, y, x);
		b = (int)pixel.val[0];
		g = (int)pixel.val[1];
		r = (int)pixel.val[2];
    	cvReleaseImage(&bgr);
		cerr << "R" << r << " G" << g << " B" << b << "\n" << endl;
		//cerr << "x:" << x << " y:" << y << endl;
	}

	//save pixel coordinates on righ-clic (x4)
	if(event == CV_EVENT_RBUTTONUP) {
		switch(right_click)
		{
			case 0:
			case 4:{
				A.x = x;
				A.y = y;
				right_click = 1;
				cerr << "A " << A.x << " " << A.y << endl;
				break;
			}
			case 1:{
				B.x = x;
				B.y = y;
				right_click++;
				cerr << "B " << B.x << " " << B.y << endl;
				break;
			}
			case 2:{
				C.x = x;
				C.y = y;
				right_click++;
				cerr << "C " << C.x << " " << C.y << endl;
				break;
			}
			case 3:{
				D.x = x;
				D.y = y;
				right_click++;
				cerr << "D " << D.x << " " << D.y << "\n" << endl;
				axis = 1;
				findHomography(); //find homography matrix
				writeToFile(); //copy points into file
				break;
			}
		}
	}
}


void setPoints()
{
	string str;
	ifstream file("calibration_points.txt", ios::in);
	if(file.is_open())
	{
		while(!file.eof())
		{
			getline(file, str) ;
		}
	}

	char *cstr, *p = NULL;

	cstr = new char[str.size()+1];
	strcpy(cstr, str.c_str());

	p = strtok(cstr, " ");
	int count = 0 ;

	while(p != NULL)
	{
		switch(count)
		{
			case 0:{
				A.x = atoi(p);
				break;
			}
			case 1:{
				A.y = atoi(p);
				break;
			}
			case 2:{
				B.x = atoi(p);
				break;
			}
			case 3:{
				B.y = atoi(p);
				break;
			}
			case 4:{
				C.x = atoi(p);
				break;
			}
			case 5:{
				C.y = atoi(p);
				break;
			}
			case 6:{
				D.x = atoi(p);
				break;
			}
			case 7:{
				D.y = atoi(p);
				break;
			}
		}
		p = strtok(NULL, " ");
		count++;
	}
	
	cout << "A " << A.x << " " << A.y << endl ;
	cout << "B " << B.x << " " << B.y << endl ;
	cout << "C " << C.x << " " << C.y << endl ;
	cout << "D " << D.x << " " << D.y << "\n" << endl ;
	
	axis = 1;
	findHomography();
}

void binarizeImage(IplImage *src, IplImage **bin)
{
	//*bin = cvCloneImage(src);
	IplImage *tmp = cvCloneImage(src);
	
	//start binarization
		IplImage *mask;
		mask = cvCreateImage(cvGetSize(tmp), src->depth, 1);
		cvInRangeS(tmp, cvScalar(b - tolerance, g - tolerance, r - tolerance, 0), 
						cvScalar(b + tolerance, g + tolerance, r + tolerance, 255), mask);

		IplConvKernel *kernel1;
		IplConvKernel *kernel2;
		kernel1 = cvCreateStructuringElementEx(3, 3, 2, 2, CV_SHAPE_ELLIPSE);
		kernel2 = cvCreateStructuringElementEx(10, 10, 2, 2, CV_SHAPE_ELLIPSE);

		cvErode(mask, mask, kernel1, 1);
		cvDilate(mask, mask, kernel2, 1);
		cvSmooth(mask, mask, CV_GAUSSIAN, 3, 0);
	//end binarization
	
	*bin = cvCloneImage(mask);
	cvReleaseImage(&tmp);
	cvReleaseImage(&mask);
	cvReleaseStructuringElement(&kernel1);
	cvReleaseStructuringElement(&kernel2);
}

CvPoint calcGravity(IplImage *mask)
{
	int sommeX = 0;
	int sommeY = 0;
	int nbPixels = 0;

	for(int x = 0; x < mask->width; x++) {
		for(int y = 0; y < mask->height; y++) {
			if(((uchar *)(mask->imageData + y*mask->widthStep))[x] == 255) {
				sommeX += x;
				sommeY += y;
				nbPixels++;
			}
		}
	}
	if(nbPixels > 0)
		return cvPoint((int)(sommeX/nbPixels), (int)(sommeY/nbPixels));
	else
		return cvPoint(0,0);
}



int main()
{
	//capture frame from cam(0) and set cam format (width/height)
    //CvCapture* capture = cvCreateCameraCapture(0);
	//http://150.229.9.117/axis-cgi/com/ptz.cgi?pan=-90&tilt=-34&zoom=0
	CvCapture* capture = cvCreateFileCapture("http://150.229.9.117/mjpg/video.mjpg");
	cvSetCaptureProperty( capture, CV_CAP_PROP_FRAME_WIDTH, Lu );
	cvSetCaptureProperty( capture, CV_CAP_PROP_FRAME_HEIGHT, Lv );
    //create an place windows
	cvNamedWindow("video_src", CV_WINDOW_AUTOSIZE);
    cvNamedWindow("video_bin", 0);
    cvNamedWindow("video_hom", 0);
	cvResizeWindow("video_bin", Lu/2, Lv/2);
	cvResizeWindow("video_hom", Lu/2, Lv/2);
	cvMoveWindow("video_src", 0, 0);
	cvMoveWindow("video_bin", Lu+13, 0);
	cvMoveWindow("video_hom", Lu+13, Lv/2+41);
    
	//define IplImage* src et bin
	src = cvQueryFrame(capture);
	bin = cvCreateImage(cvGetSize(src), IPL_DEPTH_8U, 1);
	hom = cvCloneImage(src);

	//create mouse callback linked to mouseEvent()
	cvSetMouseCallback("video_src", mouseEvent);
	cvSetMouseCallback("video_hom", mouseEvent);

	setPoints();

	//Image Processing
    while(key != 'q') //exit on key 'q'
    {
		src = cvQueryFrame(capture);

		if(axis){
			cvWarpPerspective(src, hom, H);
			binarizeImage(hom, &bin);
		} else {
			binarizeImage(src, &bin); //threshold hom > bin
		}

		//compute white pixels gravity center and write value into file
		gravity = calcGravity(bin);
		gravity.x -= 10 ;
		sendUDP(gravity);

		//draw a red square on the gravity center
		if(axis) cvDrawRect(hom, cvPoint(gravity.x-20,gravity.y-20), cvPoint(gravity.x+20,gravity.y+20), CV_RGB(255, 0, 0), 2);
		else     cvDrawRect(src, cvPoint(gravity.x-20,gravity.y-20), cvPoint(gravity.x+20,gravity.y+20), CV_RGB(255, 0, 0), 2);

		//display src and bin
		cvShowImage("video_src", src);
		cvShowImage("video_bin", bin);  
		cvShowImage("video_hom", hom); 
		 
        key = cvWaitKey(10);
    }

	//clear memory
    cvDestroyAllWindows();
	src = NULL;
	cvReleaseCapture(&capture);
	cvReleaseImage(&bin);
	cvReleaseImage(&hom);
    return 0; 
}