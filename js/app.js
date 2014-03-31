//AngularJS stuff

var codeArtApp = angular.module("codeArtApp",['ngRoute']);
var userID = 0;

codeArtApp.controller("speechController", function($scope,$http) {
    
    startMic();
    startSpeechRegcog();
    if(userID = 0){
        console.log("You are a stranger");
    }
    $scope.strangerData;
    $scope.strangerImgName = ""; 
    $scope.strangerId;
    $scope.numsent;
    $scope.final_transcript = "";
    
    $http({
        method: 'POST', 
        url: 'php/getstranger.php',
        data : { 
            userId : userID
        }
      }).
      success(function(data, status, headers, config) {
          $scope.strangerData = data[0];
          $scope.strangerImgName = data[0].imgpath;
          $scope.strangerId = data[0].id;
          $scope.numsent = data[0].numsent; 
      }).
      error(function(data, status, headers, config) {
          console.log("AJAX Error.");
      });
    
    $scope.sendEmail = function(transcript){
        $http({
            method: 'POST', 
            url: 'php/sendmail.php',
            data : { 
                strangerId : $scope.strangerId,
                text : transcript,
                numsent : parseInt($scope.numsent) + 1
            }
        }).
        success(function(data, status, headers, config) {
             $("#mymodal").modal("show")
        }).
        error(function(data, status, headers, config) {
              console.log("AJAX Error.");
        });        
    }
    $scope.currentPitch = 0;
    
});

codeArtApp.controller("cameraController", function($scope,$http,$location) {
    
    startCamera();
    
    $scope.imgsrc = "";
    $scope.useremail;
    $scope.userId;
    $scope.saveImage = function(){
        $scope.imgsrc = convertCanvasToImage(cameraCanvas);
        var imgsrc = $scope.imgsrc.split("data:image/png;base64,")[1];
        //console.log(imgsrc);
        $scope.uploadImage(imgsrc);
    }
    
    $scope.saveEmail = function(email){
        $("#snap-btn").css({"display":"inline-block"});
        $("#email-main").css({"display":"none"});
    }
    
    $scope.uploadImage = function(imgsrc){
        $http({
            method: 'POST', 
            url: 'php/uploadimg.php',
            data : { 
                base64data : imgsrc,
                email : $scope.useremail
            }
        }).
        success(function(data, status, headers, config) {
            userID = data;
        }).
        error(function(data, status, headers, config) {
              console.log("AJAX Error.");
        });        
    }
});

codeArtApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/first.html'
  })
  .when('/camera', {
    templateUrl: 'partials/camera.html',
    controller: 'cameraController'
  })
  .when('/speech', {
    templateUrl: 'partials/speech.html',
    controller: 'speechController'
  });
});
