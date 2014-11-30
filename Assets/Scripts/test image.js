// Get the latest webcam shot from outside "Friday's" in Times Square
var url = "http://images.earthcam.com/ec_metros/ourcams/fridays.jpg";
function Start () {
     // Start a download of the given URL
    var www : WWW = new WWW (url);
    
    // Wait for download to complete
    yield www;
    
    // assign texture
    renderer.material.mainTexture = www.texture; 
}