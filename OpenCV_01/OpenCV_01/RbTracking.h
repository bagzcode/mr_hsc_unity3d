#pragma once
#include "highgui.h"
#include "cv.h"
#include <string>
#include <iostream>
#include <sstream>
#include <fstream>
using namespace std;

class RbTracking
{
public:
	RbTracking(void);
	~RbTracking(void);

	char key;
	
	void detectStones();
	void createCapture();
	void queryFrame();
	void wrapAndBin();
	void doGravity();
	void showImages();
	void setWindows();
	void drawRectangle();
	int waitKey(int delay);
	void mouseCallback(RbTracking *p_rb);
	
private:
	stringstream udpData;
	CvScalar black;
	int lowThresh, highThresh, kl1, kl2, kl3, whiteMini_r, whiteMini_c ;
	int crop_t, crop_b, crop_r, crop_l ;
	bool calibration;
	CvCapture* capture ;
	IplImage *src, *bin, *hom, *bin_tracking ;
	CvPoint gravity ;
	CvMat *H ;
	int r, g, b, tolerance ; //colors
	float Lu, Lv ; //image size
	int right_click ; //click counter
	CvPoint A, B, C, D; //calibration points
	static void mouseEvent(int event, int x, int y, int flags, void *param);//on mouse callback

	CvPoint lookRighLeft(int i, int j);
	CvRect lookUpDown(int i, int j);
	void cropImage();
	int filterWhite(int row, int column, int way);
	void placeCamera();
	void binarizeImage(IplImage *p_src, IplImage **p_bin);
	void sendUDP();
	void findHomography();
	void writeToFile();//save calibration data
	void loadLastCalibration();
	void getColorPixel(int x, int y);
	bool isWhite(IplImage *p_src, int x, int y);
	void get4Points(int x, int y);//for calibration
	CvPoint calcGravity(IplImage *p_mask); //white gravity center of the binarized image
	void applyFilters(IplImage *p_src, IplImage *p_bin);
	void doMyFilter();
	CvPoint findWhite();
};

