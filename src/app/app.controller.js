app.controller('BeaconController', [
  '$scope',
  '$rootScope',
  '$cordovaBeacon',
  
function ($scope, $rootScope, $cordovaBeacon) {
  $scope.regionConfig = {
    identifier: 'spaces',
    uuid: 'c9d2f215-adc3-411b-95fd-a5a543fea888',
    major: null,
    minor: null,
    notifyEntryStateOnDisplay: true // A Boolean indicating whether beacon notifications are sent when the device’s display is on.
  };

  var proximityStates = {
    IMMEDIATE: 'ProximityImmediate',
    NEAR: 'ProximityNear',
    FAR: 'ProximityFar',
    UNKNOWN: 'ProximityUnknown'
  };

  var proximityStateOrder = {
    'ProximityImmediate': 3,
    'ProximityNear': 2,
    'ProximityFar': 1,
    'ProximityUnknown': 0
  };

  var region;

  $scope.status = {
    cordova: false,
    monitoring: false,
    ranging: false,
    beacon: null
  };

  $scope.logStack = ['Startup'];

  var log = function () {
    var args = Array.prototype.slice.call(arguments);
    
    for (var i = 0; i < args.length; i++) {
      if (_.isObject(args[i]) || _.isArray(args[i]))
        args[i] = JSON.stringify(args[i]);
    }

    $scope.logStack.unshift(args.join(' ') + '\n');
    console.log(args.join(' '));
  };

  // Beacon plugin callbacks

  var onEnterRegion = function (pluginResult) {
    log('EnterRegion', pluginResult);
  };

  var onExitRegion = function (pluginResult) {
    log('ExitRegion', pluginResult);
    $scope.status.beacon = null;
  }

  var onBeaconsRanged = function (pluginResult) {
    var beacons = pluginResult.beacons;

    if (!beacons.length) {
      $scope.status.beacon = null;
      return;
    }

    log('BeaconsRanged', pluginResult);

    var sortFn = function (a, b) {
      // Descending
      return proximityStateOrder[b] - proximityStateOrder[a];
    };

    var sortedBeacons = beacons.sort(sortFn);
    console.log(sortedBeacons);

    var nearestBeacon = sortedBeacons[0];

    $scope.status.beacon = nearestBeacon;
  };

  var onDidDetermineStateForRegion = function (pluginResult) {
    log('DetermineStateForRegion', pluginResult);
  };

  var onMonitoringStarted = function (monitoringStatus) {
    log('StartMonitoringForRegion', monitoringStatus);
  };

  $scope.onStartMonitoringClick = function () {
    $cordovaBeacon.startMonitoringForRegion(region).then(function () {
      log('Start monitoring');
      $scope.status.monitoring = true;  
    });
  };

  $scope.onStopMonitoringClick = function () {
    $cordovaBeacon.stopMonitoringForRegion(region).then(function () {
      log('Stop monitoring');
      $scope.status.monitoring = false;        
    });
  };

  $scope.onStartRangingClick = function () {
    $cordovaBeacon.startRangingBeaconsInRegion(region).then(function () {
      log('Start ranging');
      $scope.status.ranging = true;  
    });
  };

  $scope.onStopRangingClick = function () {
    $cordovaBeacon.stopRangingBeaconsInRegion(region).then(function () {
      log('Stop ranging');
      $scope.status.ranging = false;  
    });
  };

  $scope.onRequestStateClick = function () {
    $cordovaBeacon.requestStateForRegion(region).then(function () {
      log('RequestStateForRegion');
    });
  };

  $scope.onClearConsoleClick = function () {
    $scope.logStack.length = 0;
  };

  // Init 
  if (window.cordova) {
    region = $cordovaBeacon.createBeaconRegion(
      $scope.regionConfig.identifier,
      $scope.regionConfig.uuid,
      $scope.regionConfig.major,
      $scope.regionConfig.minor,
      $scope.regionConfig.notifyEntryStateOnDisplay
    );

    $cordovaBeacon.setCallbackDidEnterRegion(onEnterRegion);
    $cordovaBeacon.setCallbackDidExitRegion(onExitRegion);

    $cordovaBeacon.setCallbackDidRangeBeaconsInRegion(onBeaconsRanged);
    $cordovaBeacon.setCallbackDidStartMonitoringForRegion(onMonitoringStarted);

    $cordovaBeacon.setCallbackDidDetermineStateForRegion(onDidDetermineStateForRegion);
  }  
}
]);