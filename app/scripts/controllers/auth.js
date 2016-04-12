app.controller('AuthController', function($scope, AuthServices, $location, $cookies, Notification) {

	$scope.preloader = false;
	$scope.sending = false;
	$scope.submitBtnTxt = "Acceder";
	$scope.LoginForm = function(){
		$scope.sending = true;
		$scope.submitBtnTxt = "Enviando";
		$scope.preloader = true;
		var promise = AuthServices.login({usuario: $scope.usuario, pwd: $scope.password});
			promise.then(function(){

				var data = AuthServices.response;

				if(data.status == "ok"){
					$scope.userData = data.user;
					var expireDate = new Date();
	  				expireDate.setDate(expireDate.getDate() + 1);
					$cookies.putObject("theCookie", {"access_token": data.user.access_token, "refresh_token":data.user.refresh_token}, {expires: expireDate});
					$cookies.putObject("cpUserData", {"nombre": data.user.nombre, "username":data.user.username, "id": data.user.id, "access_token": data.user.access_token});
					$scope.sending = false;
					$location.path("/");
				}else{
					/* Hay un error de logueo */
					Notification.error({message: data.alerta.mensaje, delay: 5000});
					$scope.logueado = false;
					$scope.sending = false;
				}

				
				//$scope.logueado = true;
			}, function(){
				Notification.error({message: 'Ocurrió un error al intentar ingresar.', delay: 5000});
	      	})
	      	.finally(function(){
	      		$scope.submitBtnTxt = "Acceder";
	      		$scope.sending = false;
	      		$scope.preloader = true;
	      });
	};

	$scope.LogOut = function(){
		$scope.userData = null;
        $cookies.remove('theCookie');
        $cookies.remove('cpUserData');
        $location.path("auth/login");
	}


	//Logout por routeo
	if($location.path() == "/auth/logout")
		$scope.LogOut();

});