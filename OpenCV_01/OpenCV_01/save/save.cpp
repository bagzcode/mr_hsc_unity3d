#include <iostream>
#include <highgui.h>
#include <cv.h>

int video()
{
    IplImage *img_clr ;
    CvCapture* capture = cvCreateCameraCapture( 0 );
    cvNamedWindow("video", CV_WINDOW_AUTOSIZE);
    char key = NULL;
  
    while(key != 'q')
    {
		cvGrabFrame( capture );
		img_clr = cvRetrieveFrame( capture );
		cvShowImage( "video", img_clr );
        key = cvWaitKey(10);
    }

    cvDestroyAllWindows();
	img_clr = NULL;
    cvReleaseCapture( &capture );
    return 0; 
}

int threshold()
{
    IplImage *src ;
    IplImage *dst ;
    CvCapture* capture = cvCreateCameraCapture( 0 );
    cvNamedWindow("video", CV_WINDOW_AUTOSIZE);
    char key = NULL;
  
    while(key != 'q')
    {
		cvGrabFrame( capture );
		src = cvRetrieveFrame( capture );
		dst = cvCreateImage(cvGetSize(src), src->depth, 1);
		

		// Allocate image planes
		IplImage* r = cvCreateImage( cvGetSize(src), IPL_DEPTH_8U, 1 );
		IplImage* g = cvCreateImage( cvGetSize(src), IPL_DEPTH_8U, 1 );
		IplImage* b = cvCreateImage( cvGetSize(src), IPL_DEPTH_8U, 1 );

		// Split image onto the color planes
		cvSplit( src, r, g, b, NULL );

		IplImage* s = cvCreateImage( cvGetSize(src), IPL_DEPTH_8U, 1 );
		
		// Add equally weighted rgb values
		cvAddWeighted( r, 1./3., g, 1./3., 0.0, s );
		cvAddWeighted( s, 2./3., b, 1./3., 0.0, s );

		// Truncate values over 100
		cvThreshold( s, dst, 50, 255, CV_THRESH_BINARY );

		cvShowImage( "video", dst );
        key = cvWaitKey(10);

		cvReleaseImage( &r );
		cvReleaseImage( &g );
		cvReleaseImage( &b );
		cvReleaseImage( &s );
	}

    cvDestroyAllWindows();
	src = NULL;
	cvReleaseImage( &dst );
    cvReleaseCapture( &capture );
    return 0; 
}

int ndg_inv()
{
    IplImage *img_clr ;
	IplImage *img_nvg ;
	IplImage *img_inv ;
	CvScalar scalaire;
    CvCapture* capture = cvCreateCameraCapture( 0 );
    cvNamedWindow("video", CV_WINDOW_AUTOSIZE);
    char key = NULL;
  
    while(key != 'q')
    {
		cvGrabFrame( capture );
		img_clr = cvRetrieveFrame( capture );
		img_nvg = cvCreateImage(cvGetSize(img_clr), img_clr->depth, 1);
		cvConvertImage(img_clr, img_nvg, 0);
		img_inv = cvCloneImage(img_nvg);

		for(int x=0; x<img_nvg->width; x++)
		{
			for(int y=0; y<img_nvg->height; y++)
			{
				scalaire=cvGet2D(img_nvg, y, x);
				scalaire.val[0]=255-scalaire.val[0];
				cvSet2D(img_inv, y, x, scalaire);
			}
		}

		cvShowImage( "video", img_inv );
        key = cvWaitKey(10);
    }

    cvDestroyAllWindows();
	img_clr = NULL;
    cvReleaseImage(&img_nvg);
    cvReleaseImage(&img_inv);
    cvReleaseCapture( &capture );
    return 0; 
}


void matPassage()
{
	cerr << "matPassage in" << endl;
	CvPoint2D32f Ou;
	CvPoint2D32f Ov;
	Ou.x = u.x - O.x;
	Ou.y = u.y - O.y;
	Ov.x = v.x - O.x;
	Ov.y = v.y - O.y;

	Lu = sqrt((float)(Ou.x*Ou.x + Ou.y*Ou.y));
	Lv = sqrt((float)(Ov.x*Ov.x + Ov.y*Ov.y));
	
	cvmSet( matP, 0, 0, Ou.x/Lu );
	cvmSet( matP, 0, 1, Ov.x/Lu );
	cvmSet( matP, 1, 0, Ou.y/Lv );
	cvmSet( matP, 1, 1, Ov.y/Lv );

	cerr << "matPassage out" << endl;
}

CvPoint2D32f changeBase(CvPoint m)
{
	CvPoint2D32f m_prime = cvPoint2D32f(gravity.x, gravity.y);

	if(axis){
		CvMat *m1 = cvCreateMat( 2, 2, CV_32FC1 );
		cvmSet( m1, 0, 0, m.x );
		cvmSet( m1, 0, 1, 0 );
		cvmSet( m1, 1, 0, m.y );
		cvmSet( m1, 1, 1, 0 );

		CvMat *matO = cvCreateMat( 2, 2, CV_32FC1 );
		cvmSet( matO, 0, 0, -O.x );
		cvmSet( matO, 0, 1, 0 );
		cvmSet( matO, 1, 0, -O.y );
		cvmSet( matO, 1, 1, 0 );

		CvMat *m2 = cvCreateMat( 2, 2, CV_32FC1 );
		CvMat *temp = cvCreateMat( 2, 2, CV_32FC1 );

		//cvMatMulAdd(matP, m1, matO, m2);
		cvInvert(matP,temp);
		cvMatMulAdd(temp, m1, matO, m2);

		m_prime.x = cvmGet(m2,0,0);
		m_prime.y = cvmGet(m2,1,0);

		//cerr << cvmGet(matP,0,0) << " "<<cvmGet(matP,0,1)<<" "<<cvmGet(matP,1,0)<<" "<<cvmGet(matP,1,1) << endl;

		cvReleaseMat( &m1 );
		cvReleaseMat( &matO );
		cvReleaseMat( &temp );
		cvReleaseMat( &m2 );
	}
	return m_prime;
}
