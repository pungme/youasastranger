//AngularJS stuff

var codeArtApp = angular.module("codeArtApp",['ngRoute']);

codeArtApp.controller("speechController", function($scope,$http) {
    //$scope.isStartMic = false;
    
    startMic();
    startSpeechRegcog();
    
    $scope.strangerData;
    $scope.strangerImgName = ""; 
    $scope.strangerId;
    $scope.strangerEmail;
    $scope.numsent;
    
    $scope.final_transcript = "";
    
    $http({method: 'GET', url: 'php/getstranger.php'}).
      success(function(data, status, headers, config) {
          console.log(data);
          //$scope.data = data;
          $scope.strangerData = data[0];
          $scope.strangerImgName = data[0].imgpath;
          $scope.strangerId = data[0].id;
          $scope.numsent = data[0].numsent; 
          $scope.strangerEmail = data[0].email;
      }).
      error(function(data, status, headers, config) {
          console.log("AJAX Error.");
      });
    
    $scope.sendEmail = function(transcript){
        $http({
            method: 'POST', 
            url: 'php/sendmail.php',
            data : { 
                //id seems to have somthing wrong
                strangerMail : $scope.strangerEmail,
                text : transcript
            }
        }).
        success(function(data, status, headers, config) {
             $("#mymodal").modal("show")
             //update + 1 to numsent
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
    $scope.saveImage = function(){
        $scope.imgsrc = convertCanvasToImage(cameraCanvas);
        var imgsrc = $scope.imgsrc.split("data:image/png;base64,")[1];
        //console.log(imgsrc);
        $scope.uploadImage(imgsrc);
    }
    
    $scope.saveEmail = function(email){
//        if($scope.useremail){
//            $http({
//                method: 'POST', 
//                url: 'php/addemail.php',
//                data : { 
//                    email : $scope.useremail 
//                }
//            }).
//            success(function(data, status, headers, config) {
//            }).
//            error(function(data, status, headers, config) {
//                console.log("AJAX Error.");
//            });
//        }
        $("#snap-btn").css({"display":"inline-block"});
        $("#email-main").css({"display":"none"});
    }
   // $scope.currentPitch = 0;
    
    $scope.uploadImage = function(imgsrc){
        $http({
            method: 'POST', 
            url: 'php/uploadimg.php',
            data : { 
                //id seems to have somthing wrong
                base64data : imgsrc,
                email : $scope.useremail
            }
        }).
        success(function(data, status, headers, config) {
           // $scope.$apply( $location.path("speech"));
            //TODO: after success, go to another url
        }).
        error(function(data, status, headers, config) {
              console.log("AJAX Error.");
        });        
    }
});

codeArtApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'partials/camera.html',
    controller: 'cameraController'
  })
  .when('/speech', {
    templateUrl: 'partials/speech.html',
    controller: 'speechController'
  });
});