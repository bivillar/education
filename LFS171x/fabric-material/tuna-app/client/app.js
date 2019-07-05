// SPDX-License-Identifier: Apache-2.0

"use strict";

var app = angular.module("application", []);

// Angular Controller
app.controller("appController", function($scope, appFactory) {
  //Sucesses
  $("#success_holder").hide();
  $("#success_create").hide();
  $("#success_used").hide();

  //Erros
  $("#error_holder").hide();
  $("#error_query").hide();
  $("#error_used").hide();
  $("#error_create").hide();

  // Loadings
  $("#holder_Loading").hide();
  $("#add_Loading").hide();
  $("#used_Loading").hide();

  $scope.allLoaded = false;
  $scope.singleLoaded = false;
  $scope.changed = false;
  $scope.used = false;
  $scope.bottleChanged = {};
  $scope.bottleAdded = {};
  $scope.bottleUsed = {};
  $scope.holderLoading = false;

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
    $scope.bottleAdded = $scope.bottle;
    $scope.bottle = {};
    $scope.bottle.used = "Sim";

    $("#add_Loading").show();
    $("#success_create").hide();
    appFactory.recordBottle($scope.bottleAdded, function(data) {
      $scope.create_bottle = data;
      $("#success_create").show();
      $("#add_Loading").hide();
    });
  };

  $scope.changeUsed = function() {
    $scope.usedForm.$setUntouched();
    $scope.bottleUsed = $scope.bottle;
    $scope.bottle = {};
    $scope.bottle.used = "Sim";
    $("#error_used").hide();
    $("#success_used").hide();
    $("#used_Loading").show();

    appFactory.changeUsed($scope.bottleUsed, function(data) {
      $scope.change_user = data;
      $("#used_Loading").hide();
      if ($scope.change_user == "Error: no bottle found") {
        $("#error_used").show();
        $("#success_used").hide();
      } else {
        $("#success_used").show();
        $("#error_used").hide();
      }
    });
  };

  $scope.changeHolder = function() {
    $scope.holderForm.$setUntouched();
    $scope.bottleChanged = $scope.holder;
    $scope.holder = {};
    $("#holder_Loading").show();
    $("#success_holder").hide();
    $("#error_holder").hide();

    appFactory.changeHolder($scope.bottleChanged, function(data) {
      $scope.change_holder = data;
      $("#holder_Loading").hide();
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
