app.run(function($rootScope, $location, $cookies, AuthServices) { 
  $rootScope.userData = null;
  $rootScope.credenciales = null;
  $rootScope.preloader = true;
  
  var goLocation = $location.path();
  var cpUserData = $cookies.getObject('cpUserData');
  var theCookie = $cookies.getObject('theCookie');
  //Compruebo si existe la Cookie
  if (typeof cpUserData == "undefined") {
    if(typeof theCookie == "undefined"){
      $location.path("auth/login");
    }else{
      var promise = AuthServices.CheckAccessToken(theCookie.access_token);

      promise.then(function(data){
        var data = AuthServices.userData;
        $rootScope.userData = data;
        $cookies.putObject("cpUserData", data);

      }, function(){
        //Error en request
        })
        .finally(function(){
          //El request Termino
      });
    }
  }else{
      $rootScope.userData = cpUserData;
  }

});