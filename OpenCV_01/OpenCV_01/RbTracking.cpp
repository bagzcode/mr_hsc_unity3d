//suppress strncpy warnings
#define _CRT_SECURE_NO_DEPRECATE
#define _CRT_NONSTDC_NO_DEPRECATE
#include <winsock2.h>
#pragma comment(lib, "ws2_32.lib")
#include "RbTracking.h"

RbTracking::RbTracking(void)
{
	udpData.str("");
	black.val[0]=0;
	black.val[1]=0;
	black.val[2]=0;
	crop_t = 60 ;
	crop_b = 110 ;
	crop_r = 90 ;
	crop_l = 50 ;
	lowThresh = 90 ;
	highThresh = 60 ;
	kl1 = 3 ;
	kl2 = 9 ;
	kl3 = 10 ;
	whiteMini_c = 10;
	whiteMini_r = 10;
	key = NULL;
	gravity = cvPoint(0, 0);
	H = cvCreateMat( 3, 3, CV_32FC1 );
	right_click = 0 ;
	calibration = false ;
	Lu = 384 ; //video stream width
	Lv = 288; //video stream height
	r = 76 ;
	g = 175 ;
	b = 84 ;
	tolerance = 30 ;
	loadLastCalibration();
	placeCamera();

	//nota bene
	//capture frame from cam(0) and set cam format (width/height)
    //CvCapture* capture = cvCreateCameraCapture(0);
}

RbTracking::~RbTracking(void)
{
	cvDestroyAllWindows();
	src = NULL;
	cvReleaseCapture(&capture);
	cvReleaseImage(&bin);
	cvReleaseImage(&bin_tracking);
	cvReleaseImage(&hom);
}

CvPoint RbTracking::calcGravity(IplImage *p_mask)
{
	int sommeX = 0;
	int sommeY = 0;
	int nbPixels = 0;

	for(int x = 0; x < p_mask->width; x++) {
		for(int y = 0; y < p_mask->height; y++) {
			if(((uchar *)(p_mask->imageData + y*p_mask->widthStep))[x] == 255) {
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

void RbTracking::loadLastCalibration()
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
	
	calibration = true;
	findHomography();
}


void RbTracking::findHomography()
{
	//find homography
	float a[] = {A.x, B.x, C.x, D.x,
				 A.y, B.y, C.y, D.y};
	//float b[] = {0, Lu, Lu, 0,
	//		     0, 0,  Lv, Lv};
	float b[] = {0, Lu, 250*Lu/294, 50*Lu/294,
		         0, 0,  280*Lv/438, 280*Lv/438}; //board dimension 294x438

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

void RbTracking::writeToFile()
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
void RbTracking::sendUDP()
{
	//previous version >> void RbTracking::sendUDP(CvPoint p_pt)
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
	//stringstream out ;
	//previous version >> out << p_pt.x << " " << p_pt.y << " " << Lu << " " << Lv ;
	//string str = out.str();
	string str = udpData.str();
	size_t size = str.size() + 1;
	char *buffer = new char[size];
	strncpy( buffer, str.c_str(), size );
	sendto(sock, buffer, 64, 0, (SOCKADDR *)&sin, sizeof(sin));
	closesocket(sock);
	WSACleanup();
}

void RbTracking::binarizeImage(IplImage* p_src, IplImage** p_bin)
{
	//*bin = cvCloneImage(src);
	IplImage *tmp = cvCloneImage(p_src);
	
	//start binarization
		IplImage *mask;
		mask = cvCreateImage(cvGetSize(tmp), p_src->depth, 1);
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
	
	*p_bin = cvCloneImage(mask);
	cvReleaseImage(&tmp);
	cvReleaseImage(&mask);
	cvReleaseStructuringElement(&kernel1);
	cvReleaseStructuringElement(&kernel2);
}
void RbTracking::setWindows()
{
	cvSetCaptureProperty( capture, CV_CAP_PROP_FRAME_WIDTH, Lu );
	cvSetCaptureProperty( capture, CV_CAP_PROP_FRAME_HEIGHT, Lv );
    //create an place windows
	cvNamedWindow("video_src", 0);
    cvNamedWindow("video_bin", 0);
    //cvNamedWindow("video_hom", 0);
    cvNamedWindow("trackbars", 0);
	//cvNamedWindow("video_bin_tracking", 0);
	cvResizeWindow("video_src", Lu*2, Lv*2);
	cvResizeWindow("video_bin", Lu, Lv);
	cvResizeWindow("trackbars", Lu, Lv*2);
	//cvResizeWindow("video_bin_tracking", Lu, Lv);
	//cvResizeWindow("video_hom", Lu, Lv);
	cvMoveWindow("video_src", 0, 0);
	cvMoveWindow("video_bin", Lu*2+13, 0);
	//cvMoveWindow("video_hom", Lu*2+13, Lv+41);

	cvCreateTrackbar("lowThresh", "trackbars", &lowThresh, 400 , NULL);
	cvCreateTrackbar("highThresh", "trackbars", &highThresh, 400 , NULL);
	cvCreateTrackbar("Dilate_1", "trackbars", &kl1, 20 , NULL);
	cvCreateTrackbar("Erode", "trackbars", &kl2, 20 , NULL);
	cvCreateTrackbar("whiteMini_c", "trackbars", &whiteMini_c, 40 , NULL);
	cvCreateTrackbar("whiteMini_r", "trackbars", &whiteMini_r, 40 , NULL);
	cvCreateTrackbar("crop_t", "trackbars", &crop_t, Lv-1 , NULL);
	cvCreateTrackbar("Dilate_2", "trackbars", &kl3, 20 , NULL);
	//cvCreateTrackbar("crop_b", "trackbars", &crop_b, Lv-1 , NULL);
	//cvCreateTrackbar("crop_r", "trackbars", &crop_r, Lu-1 , NULL);
	//cvCreateTrackbar("crop_l", "trackbars", &crop_l, Lu-1 , NULL);
}
void RbTracking::showImages()
{
	cvShowImage("video_src", src);
	cvShowImage("video_bin", bin);  
	//cvShowImage("video_bin_tracking", bin_tracking);  
	//cvShowImage("video_hom", hom); 
}
void RbTracking::drawRectangle()
{
	//draw a red square on the gravity center
	if(calibration) cvDrawRect(hom, cvPoint(gravity.x-20,gravity.y-20), cvPoint(gravity.x+20,gravity.y+20), CV_RGB(255, 0, 0), 2);
	else     cvDrawRect(src, cvPoint(gravity.x-20,gravity.y-20), cvPoint(gravity.x+20,gravity.y+20), CV_RGB(255, 0, 0), 2);
} 

void RbTracking::mouseCallback(RbTracking *p_rb)
{
	cvSetMouseCallback("video_src", mouseEvent, (void*)p_rb);
	//cvSetMouseCallback("video_bin_tracking", mouseEvent, (void*)p_rb);
}

void RbTracking::mouseEvent(int event, int x, int y, int flags, void *param )
{
	RbTracking *rb = (RbTracking*)param;
	//save pixel color on left-clic
	if(event == CV_EVENT_LBUTTONUP)	rb->getColorPixel(x, y);
	//save pixel coordinates on righ-clic (x4)
	if(event == CV_EVENT_RBUTTONUP) rb->get4Points(x, y);
}
void RbTracking::getColorPixel(int x, int y)
{
	CvScalar pixel;
	IplImage *bgr;

	bgr = cvCloneImage(src);
	pixel = cvGet2D(bgr, y, x);
	b = (int)pixel.val[0];
	g = (int)pixel.val[1];
	r = (int)pixel.val[2];
	cvReleaseImage(&bgr);
	cerr << "R" << r << " G" << g << " B" << b << "\n" << endl;
	cerr << "x:" << x << " y:" << y << endl;
}

void RbTracking::get4Points(int x, int y)
{
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
			calibration = true;
			findHomography(); //find homography matrix
			writeToFile(); //copy points into file
			break;
		}
	}
}

void RbTracking::createCapture()
{
	capture = cvCreateFileCapture("http://150.229.9.117/mjpg/video.mjpg");
	queryFrame();
	bin = cvCreateImage(cvGetSize(src), IPL_DEPTH_8U, 1);
	bin_tracking = cvCreateImage(cvGetSize(src), IPL_DEPTH_8U, 1);
	hom = cvCloneImage(src);
}



void RbTracking::doGravity()
{
	//compute white pixels gravity center and send value by UDP
	gravity = calcGravity(bin);
	gravity.x -= 10 ;
	//sendUDP(gravity); //send data on port 28280 for Unity3D
}



void RbTracking::placeCamera()
{
	//place the camera to see the board properly
	ShellExecute(NULL, "open", "http://150.229.9.117/axis-cgi/com/ptz.cgi?pan=-90&tilt=-34&zoom=0", NULL, NULL, SW_SHOWNORMAL);
}

void RbTracking::queryFrame()
{
	src = cvQueryFrame(capture);
}
int RbTracking::waitKey(int delay)
{
	return cvWaitKey(delay);
}
void RbTracking::wrapAndBin()
{
	if(calibration){//if calibration done
		cvWarpPerspective(src, hom, H); //find homography and wrap it on the window
		applyFilters(hom, bin);
		//binarizeImage(hom, &bin); //threshold hom > bin
	} else 	binarizeImage(src, &bin); 
}
void RbTracking::applyFilters(IplImage *p_src, IplImage *p_bin)
{
	cvCvtColor(p_src, p_bin, CV_BGR2GRAY);
	cvCanny(p_bin, p_bin, lowThresh, highThresh, 3);
	cropImage();

	IplConvKernel *kernel1;
	kernel1 = cvCreateStructuringElementEx(kl1+3, kl1+3, 2, 2, CV_SHAPE_ELLIPSE);
	cvDilate(p_bin, p_bin, kernel1, 1);
	IplConvKernel *kernel2;
	kernel2 = cvCreateStructuringElementEx(kl2+3, kl2+3, 2, 2, CV_SHAPE_ELLIPSE);
	cvErode(p_bin, p_bin, kernel2, 1);
	cvReleaseStructuringElement(&kernel2);

	doMyFilter();

	kernel1 = cvCreateStructuringElementEx(kl3+3, kl3+3, 2, 2, CV_SHAPE_ELLIPSE);
	cvDilate(p_bin, p_bin, kernel1, 1);
	cvReleaseStructuringElement(&kernel1);
	//cvSmooth(p_bin, p_bin, CV_GAUSSIAN, 3, 0);
}

void RbTracking::doMyFilter()
{
	//on the rows
	int way = 1 ;
	int c;
	for(int r=crop_t; r<Lv ; r++)
	{
		c=0;
		while(c<Lu)
		{
			if(isWhite(bin, r, c))
			{
				c += filterWhite(r, c, way);
			} else c++;
		}
	}
	//on the columns
	way = 2 ;
	int r;
	for(int c=0; c<Lu ; c++)
	{
		r=0;
		while(r<Lv)
		{
			if(isWhite(bin, r, c))
			{
				r += filterWhite(r, c, way);
			} else r++;
		}
	}
}

int RbTracking::filterWhite(int row, int column, int way)
{
	int count = 0;
	int it = 0;
	int pixel = 0;

	//iterator on the columns
	if(way==1){
		while(it+column < Lu && it<20)
		{
			if(isWhite(bin, row, it+column))
				count++ ;
			it++;
		}
		if(count < whiteMini_c)
		{
			for(int i=0 ; i<it ; i++)
			{
				if(way==1) cvSet2D(bin, row, column+i, black);
			}
		}
		return it;
	}

	//iterator on the rows
	if(way==2){
		while(it+row < Lv && it<20)
		{
			if(isWhite(bin, row+it, column))
				count++;
			it++;
		}
		if(count < whiteMini_r)
		{
			for(int i=0 ; i<it ; i++)
			{
				if(way==2) cvSet2D(bin, row+i, column, black);
			}
		}
		return it;
	}
	return 0;
}

bool RbTracking::isWhite(IplImage *p_src, int y, int x)
{
	CvScalar pixel;

	pixel = cvGet2D(p_src, y, x);
	if(	(int)pixel.val[0]==0 &&	(int)pixel.val[1]==0 &&	(int)pixel.val[2]==0 )
	{
		return false;
	} else {
		//cout << "white" << endl ;
		return true;
	}
}



void RbTracking::cropImage()
{
	//top
	cvDrawRect(bin, cvPoint(0,0), cvPoint(Lu, crop_t), black, -1);
}
void RbTracking::detectStones()
{
	bin_tracking = cvCloneImage(bin);
	CvPoint P = cvPoint(0,0) ;
	CvRect R ;
	udpData.str("");
	udpData << Lu << " " << Lv ;
	//look for first white pixel and detect white pixels groups
	while(P.x < Lu-1 && P.y < Lv-1)
	{
		P = findWhite();
		R = lookUpDown(P.x, P.y);

		cvDrawRect(bin_tracking, cvPoint(R.x, R.y), cvPoint(R.x + R.width, R.y + R.height), black, -1);
		
		if(R.width > 20)
		{
			cvDrawRect(bin, cvPoint(R.x, R.y), cvPoint(R.x + R.width, R.y + R.height), CV_RGB(150, 150, 150), 1); //-1 to fill it
			gravity.x = R.x + R.width/2 ;
			gravity.y = R.y + R.height/2 ;
			udpData << " " << gravity.x << " " << gravity.y;
		}
	}
	//cout << udpData.str() << endl ;
	sendUDP();
}
CvPoint RbTracking::findWhite()
{
	//look for first white pixel and return coordinates
	int i=0 ; int j=0;
	while(j<Lv-1 && !isWhite(bin_tracking, j, i) )
	{
		if(i<Lu-1) i++;
		else {
			if(j<Lv-1) i=0;
			j++;
		}
	}
	return cvPoint(i, j);
}

CvPoint RbTracking::lookRighLeft(int i, int j)
{
	CvPoint M ;
	int count, it ; 
	//look on the right and save i coordinate of the further pixel
	//stop when too many black pixels or and of the window
	count = 0;
	it = 1;
	int max_i = i; 
	while(i+it<Lu && count<whiteMini_c)
	{
		if(!isWhite(bin_tracking, j, i+it)) {
			count++;
		} else {
			if(max_i < i+it) max_i = i+it;
			count = 0;
		}
		it++;
	}

	//look on the left
	count = 0;
	it = 1;
	int min_i = i; 
	while(i-it>0 && count<whiteMini_c)
	{
		if(!isWhite(bin_tracking, j, i-it)) {
			count++;
		} else {
			if(min_i > i-it) min_i = i-it;
			count = 0;
		}
		it++;
	}

	M.x = min_i ;
	M.y = max_i ;
	
	return M ;
}
CvRect RbTracking::lookUpDown(int i, int j)
{
	CvRect R ;
	CvPoint M ;
	int min_i = i;
	int max_i = i;
	int min_j = j;
	int max_j = j; 
	int it = 0 ;
	int count = 0;
	int m ;

	while(j+it<Lv && count<whiteMini_r)
	{
		if(!isWhite(bin_tracking, j+it, i)) {
			count++;
		} else {
			if(max_j < j+it) max_j = j+it;
			M = lookRighLeft(i, j+it);
			if(min_i > M.x) min_i = M.x ;
			if(max_i < M.y) max_i = M.y ;
			count = 0;
		}
		it++;
	}

	for(int k=min_i ; k<=max_i ; k++)
	{
		m = 0;
		while(isWhite(bin_tracking, max_j+m, k))
		{
			if(max_j+m > max_j) max_j = max_j+m;
			m++;
		}
	}

	R.x = min_i ;
	R.y = min_j ;
	R.width = max_i - min_i ;
	R.height = max_j - min_j ;
	return R ;
}