//this script to get image from url and show into the cube
var url = "http://150.229.9.117/axis-cgi/jpg/image.cgi?resolution=CIF";
var cameraTexture : Texture2D ;
var wVideo : int = 384 ;
var hVideo : int = 288 ;
var www : WWW ;
var _testwww : boolean ;

function Start(){
    // Create a texture in DXT1 format
    cameraTexture = new Texture2D(wVideo,hVideo);
	captureVideo();
}

function Update()
{	
	testwww();

	if(_testwww == true)
	{
		// assign the downloaded image to the main texture of the object
		www.LoadImageIntoTexture(cameraTexture);
		captureVideo();
	}
}

function captureVideo () {
	// Start a download of the given URL
	www = new WWW(url); 
	// wait until the download is done
	//yield www; 
}

function testwww() {
	if(www.isDone) _testwww = true ;
	else _testwww = false ;
}

function OnGUI()
{
	GUI.Box (Rect (Screen.width - wVideo -30,10,wVideo+20,hVideo+10), cameraTexture);
	//GUI.Label (Rect (Screen.width - wVideo -20,20,wVideo,hVideo), cameraTexture);
}