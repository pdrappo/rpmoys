/* Rutas*/
app.config(
  function($routeProvider, NotificationProvider,  $httpProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html'
      }).
      when('/auth/login', {
        templateUrl: 'views/auth/login.html',
        controller: 'AuthController'
      }).
      when('/auth/logout', {
        templateUrl: 'views/auth/login.html',
        controller: 'AuthController'
      }).
      
      when('/ordenes/cargar/:cuenta', {
        templateUrl: 'views/ordenes/cargar-orden.html',
        controller: 'CargarOrdenController'
      }).
      when('/ordenes/ver/:id', {
        templateUrl: 'views/ordenes/ver-orden.html',
        controller: 'VerOrdenesController'
      }).
      when('/ordenes/editar/:id', {
        templateUrl: 'views/ordenes/editar-orden.html',
        controller: 'EditarOrdenController'
      }).
      when('/clientes', {
        templateUrl: 'views/clientes/clientes.html',
        controller: 'ClientesController'
      }).
      when('/clientes/cargar', {
        templateUrl: 'views/clientes/cargar-cliente.html',
        controller: 'CargarClienteController'
      }).
      when('/clientes/ver/:id', {
        templateUrl: 'views/clientes/ver-cliente.html',
        controller: 'VerClienteController'
      }).
      when('/movimientos', {
        templateUrl: 'views/movimientos/movimientos.html',
        controller: 'MovimientosController'
      }).
      when('/movimientos/reporte/:id', {
        templateUrl: 'views/movimientos/reportes.html',
        controller: 'ReportesController'
      }).
      otherwise({
        redirectTo: '/'
      });

      NotificationProvider.setOptions({
          delay: 5000,
          startTop: 20,
          startRight: 10,
          verticalSpacing: 20,
          horizontalSpacing: 20,
          positionX: 'right',
          positionY: 'top'
      });
  });