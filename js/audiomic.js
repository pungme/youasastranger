//console.log(window.innerWidth, window.innerHeight);
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var radius = 80;
var mainsvg;
//var mainsvg = d3.select("#circle")
//        .append("svg:circle")
//		.attr("cx", (window.innerWidth/2))
//		.attr("cy", (window.innerHeight/2))
//		.attr("r", radius)
//        //.style("fill", "#dd4601"); 
//        .style("fill", "#D47F24");

//success callback when requesting audio input stream
var audioContext = new AudioContext();
var analyser;
// Create an AudioNode from the stream.
var mediaStreamSource;
var buflen = 2048;
var buf = new Uint8Array( buflen );
var currentPitch = 0;

function updateVolume(pitch){
    var scope = angular.element($("#current-volume")).scope();
    scope.$apply(function(){
        scope.currentPitch = pitch;
    })
}

function gotStream(stream) {
    
    mediaStreamSource = audioContext.createMediaStreamSource( stream );
    // Connect it to the destination to hear yourself (or any other node for processing!)
    mediaStreamSource.connect( audioContext.destination );

    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);
    
  listenAudio(audioContext,mediaStreamSource);    
    //console.log(audioContext,mediaStreamSource);
}
function startMic(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia( {audio:true}, gotStream );
    
    //draw microphone
    mainsvg = d3.select("#circle")
        .append("svg:circle")
		.attr("cx", (window.innerWidth-120))
		.attr("cy", (window.innerHeight-120))
		.attr("r", radius)
        //.style("fill", "#dd4601"); 
        .style("fill", "#D47F24");
    
}

function autoCorrelate( buf, sampleRate ) {
	var MIN_SAMPLES = 4;	// corresponds to an 11kHz signal
	var MAX_SAMPLES = 1000; // corresponds to a 44Hz signal
	var SIZE = 1000;
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;

	confidence = 0;
	currentPitch = 0;
	if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
		return;  // Not enough data

	for (var i=0;i<SIZE;i++) {
		var val = (buf[i] - 128)/128;
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);

	for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<SIZE; i++) {
			correlation += Math.abs(((buf[i] - 128)/128)-((buf[i+offset] - 128)/128));
		}
		correlation = 1 - (correlation/SIZE);
		if (correlation > best_correlation) {
			best_correlation = correlation;
			best_offset = offset;
		}
	}
   // currentPitch = sampleRate/best_offset;
    
    //var decibel = 20 * (Math.log(rms) / Math.log(10));
    //console.log(decibel);
    var volume = rms*16453;
    
    mainsvg.transition()
    .duration(100)
    .attr("r", volume);
    
    updateVolume(volume);
    
}

function listenAudio(){
    analyser.getByteTimeDomainData(buf) // buffer data (I'm not quite get this yet..)
    autoCorrelate(buf,audioContext.sampleRate);
	
    //loop this function infinitely
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	rafID = window.requestAnimationFrame( listenAudio );
}