app.service("AuthServices",
  function ($http, $q, myConfig, $log) {

    var self = this;
    self.response = {};

    this.login = function(credenciales) {
      var promise = $q(function(resolve, reject){
        $http.post(myConfig.api + 'auth/login', credenciales).then(
          //Si el request funciona hago esto
          function(response){
            var result = response.data;
            self.response = result;
            resolve(); 
          },
          //Ocurrio un error en el request
          function(){
            reject();
          });
      });
      return promise;
    };

    this.CheckAccessToken = function(token) {
      var promise = $q(function(resolve, reject){
        $http.post(myConfig.api + 'auth/check-access-token', {access_token: token}).then(
          //Si el request funciona hago esto
          function(response){
            var result = response.data;
            self.userData = result;
            //console.log(typeof result.username);
            if(typeof result.username != "undefined"){
              resolve();
            }else{
              reject();
            }
              
          },
          //Ocurrio un error en el request
          function(){
            reject();
          });
      });
      return promise;
    };

    this.logout = function(token) {
      var promise = $q(function(resolve, reject){
        $http.post(myConfig.api + 'auth/logout', credenciales).then(
          //Si el request funciona hago esto
          function(response){
            var result = response.data;
            self.userData = result.userdata;
            if(result.status == "ok"){
              resolve();
            }else{
              reject();
            }
              
          },
          //Ocurrio un error en el request
          function(){
            reject();
          });
      });
      return promise;
    };

});