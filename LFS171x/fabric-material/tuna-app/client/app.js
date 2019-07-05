// SPDX-License-Identifier: Apache-2.0

"use strict";

var app = angular.module("application", []);

// Angular Controller
app.controller("appController", function($scope, appFactory) {
  $("#success_holder").hide();
  $("#success_create").hide();
  $("#error_holder").hide();
  $("#error_query").hide();
  $scope.allLoaded = false;
  $scope.singleLoaded = false;
  $scope.added = false;
  $scope.changed = false;
  $scope.used = false;
  $scope.bottleChanged = {};
  $scope.bottleAdded = {};
  $scope.bottleUsed = {};

  $scope.bottle = { used: "Sim" };

  $scope.items = ["Sim", "Não"];

  $scope.allBottlesButton = "Show";

  $scope.queryAllBottles = function() {
    if ($scope.allLoaded) {
      $scope.allLoaded = false;
      $scope.allBottlesButton = "Show";
    } else {
      appFactory.queryAllBottles(function(data) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
          parseInt(data[i].Key);
          data[i].Record.Key = parseInt(data[i].Key);
          array.push(data[i].Record);
        }
        array.sort(function(a, b) {
          return parseFloat(a.Key) - parseFloat(b.Key);
        });
        $scope.all_bottles = array;
        $scope.allLoaded = true;
        $scope.allBottlesButton = "Hide";
      });
    }
  };

  $scope.queryBottle = function() {
    var id = $scope.bottle_id;

    appFactory.queryBottle(id, function(data) {
      $scope.query_bottle = data;
      $scope.singleLoaded = true;
      console.log(data);
      if ($scope.query_bottle == "Could not locate bottle") {
        $("#error_query").show();
      } else {
        $("#error_query").hide();
      }
    });
  };

  $scope.recordTuna = function() {
    appFactory.recordTuna($scope.tuna, function(data) {
      $scope.create_tuna = data;
      $("#success_create").show();
    });
  };

  $scope.recordBottle = function() {
    $scope.idForm.$setUntouched();
    $scope.added = true;
    $scope.bottleAdded = $scope.bottle;
    $scope.bottle = {};
    $scope.bottle.used = "Sim";

    appFactory.recordBottle($scope.bottleAdded, function(data) {
      console.log("recordBottle-app.js -- ", data);
      $scope.create_bottle = data;
      $("#success_create").show();
    });
  };

  $scope.changeUsed = function() {
    $scope.usedForm.$setUntouched();
    $scope.used = true;
    $scope.bottleUsed = $scope.bottle;
    $scope.bottle = {};
    $scope.bottle.used = "Sim";

    appFactory.changeUsed($scope.bottleUsed, function(data) {
      $scope.change_user = data;
      if ($scope.change_user == "Error: no bottle found") {
        $("#error_holder").show();
        $("#success_holder").hide();
      } else {
        $("#success_holder").show();
        $("#error_holder").hide();
      }
    });
  };

  $scope.changeHolder = function() {
    $scope.holderForm.$setUntouched();
    $scope.changed = true;
    $scope.bottleChanged = $scope.holder;
    $scope.holder = {};

    appFactory.changeHolder($scope.bottleChanged, function(data) {
      $scope.change_holder = data;
      if ($scope.change_holder == "Error: no bottle found") {
        $("#error_holder").show();
        $("#success_holder").hide();
      } else {
        $("#success_holder").show();
        $("#error_holder").hide();
      }
    });
  };
});

// Angular Factory
app.factory("appFactory", function($http) {
  var factory = {};

  factory.queryAllBottles = function(callback) {
    $http.get("/get_all_bottles/").success(function(output) {
      callback(output);
    });
  };

  factory.queryTuna = function(id, callback) {
    $http.get("/get_tuna/" + id).success(function(output) {
      callback(output);
    });
  };

  factory.queryBottle = function(id, callback) {
    $http.get("/get_bottle/" + id).success(function(output) {
      callback(output);
    });
  };

  factory.recordTuna = function(data, callback) {
    var tuna =
      data.id +
      "-" +
      data.date +
      "-" +
      data.holdertype +
      "-" +
      data.holder +
      "-" +
      data.vessel;

    $http.get("/add_tuna/" + tuna).success(function(output) {
      callback(output);
    });
  };

  factory.recordBottle = function(data, callback) {
    var bottle =
      data.id +
      "-" +
      data.date +
      "-" +
      data.holdertype +
      "-" +
      data.holder +
      "-" +
      data.used;

    $http.get("/add_bottle/" + bottle).success(function(output) {
      callback(output);
    });
  };

  factory.changeHolder = function(data, callback) {
    var holder = data.id + "-" + data.name + "-" + data.type;

    $http.get("/change_holder/" + holder).success(function(output) {
      callback(output);
    });
  };

  factory.changeUsed = function(data, callback) {
    var used = data.id + "-" + data.used;

    $http.get("/change_used/" + used).success(function(output) {
      callback(output);
    });
  };

  return factory;
});
