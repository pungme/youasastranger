var cameraCanvas;

function startCamera(){

        cameraCanvas = document.getElementById("canvas");
        var context = cameraCanvas.getContext("2d");
        var video = document.getElementById("video");
        var videoObj = { "video": true };
        var errBack = function(error) {
            console.log(error); // show error
            //console.log("Video capture error: ", error.code); 
        };
        
        var showEmailForm = function(){
            $("#email-main").css({"display":"inline-block"});
            $("#please-allow-camera").css({"display":"none"});
        };
        // Put video listeners into place
        if(navigator.getUserMedia) { // Standard
            navigator.getUserMedia(videoObj, function(stream) {
                video.src = stream;
                video.play();
            }, errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia(videoObj, function(stream){
                video.src = window.webkitURL.createObjectURL(stream);
                video.play();
                showEmailForm();
                //console.log("user accept");
            }, errBack);
        }else if(navigator.mozGetUserMedia) { // Firefox-prefixed
            navigator.mozGetUserMedia(videoObj, function(stream){
                video.src = window.URL.createObjectURL(stream);
                video.play();
            }, errBack);
        }
        
        // Trigger photo take
        document.getElementById("snap-btn").addEventListener("click", function() {
            context.drawImage(video, 0, 0, 640, 480);
            video.pause();
            $("#snap-btn").css({"display":"none"});
            $("#retake-btn").css({"display":"inline-block"});
            $("#save-btn").css({"display":"inline-block"});
            convertCanvasToImage(cameraCanvas)
        });
    
        document.getElementById("retake-btn").addEventListener("click", function() {
            context.drawImage(video, 0, 0, 640, 480);
            video.play();
            $("#snap-btn").css({"display":"inline-block"});
            $("#retake-btn").css({"display":"none"});
            $("#save-btn").css({"display":"none"});
            convertCanvasToImage(cameraCanvas)
        });
    
        document.getElementById("save-btn").addEventListener("click", function() {
            context.drawImage(video, 0, 0, 640, 480);
            video.pause();
            convertCanvasToImage(cameraCanvas)   
        });
    
}

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = cameraCanvas.toDataURL("image/png");
    //console.log(image.src);
    //scope.imgsrc = image.src;
    return image.src;
}

