var app = angular.module('myBeacon', [
  'ngCordova',
  'LocalStorageModule',
  'ui.router'
]);

app.run(function($rootScope, $state, $timeout) {
  
});

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('mybeacon')
    .setStorageType('localStorage')
    .setNotify(true, true)
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
});