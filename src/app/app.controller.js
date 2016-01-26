app.controller('BeaconController', [
  '$scope',
  '$rootScope',
  '$cordovaBeacon',
  
function ($scope, $rootScope, $cordovaBeacon) {
  $scope.region = {
    identifier: 'mybeacon',
    uuid: 'd418d958-c41c-11e5-9912-ba0be0483c18',
    major: '12345',
    minor: '1'
  };

  $scope.status = {
    cordova: false,
    broadcasting: false,
    bluetoothEnabled: false
  };

  document.addEventListener("deviceready", function () {
    $scope.$apply(function () {
      $scope.status.cordova = true;
    });
  });

  $scope.$watch('status.cordova', function () {
    console.log('Cordova initialized. Device ready.');
  });

  $scope.onBroadcastClick = function () {
    $scope.broadcasting = true;
    $cordovaBeacon.startAdvertising($scope.region);
  };

  $scope.onStopClick = function () {
    $scope.broadcasting = false;
    $cordovaBeacon.stopAdvertising();
  };
}
]);