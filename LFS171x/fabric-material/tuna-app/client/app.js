// SPDX-License-Identifier: Apache-2.0

"use strict";

var app = angular.module("application", []);

// Angular Controller
app.controller("appController", function($scope, appFactory) {
  $("#success_holder").hide();
  $("#success_create").hide();
  $("#error_holder").hide();
  $("#error_query").hide();

  $scope.queryAllBottles = function() {
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
    });
  };

  $scope.queryTuna = function() {
    var id = $scope.tuna_id;

    appFactory.queryTuna(id, function(data) {
      $scope.query_tuna = data;

      if ($scope.query_tuna == "Could not locate tuna") {
        $("#error_query").show();
      } else {
        $("#error_query").hide();
      }
    });
  };

  $scope.queryBottle = function() {
    var id = $scope.bottle_id;

    appFactory.queryBottle(id, function(data) {
      $scope.query_bottle = data;
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
    appFactory.recordBottle($scope.bottle, function(data) {
      console.log("recordBottle-app.js -- ", data);
      $scope.create_bottle = data;
      $("#success_create").show();
    });
  };

  $scope.changeHolder = function() {
    appFactory.changeHolder($scope.holder, function(data) {
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
    data.location = data.longitude + ", " + data.latitude;

    var tuna =
      data.id +
      "-" +
      data.location +
      "-" +
      data.timestamp +
      "-" +
      data.holder +
      "-" +
      data.vessel;

    $http.get("/add_tuna/" + tuna).success(function(output) {
      callback(output);
    });
  };

  factory.recordBottle = function(data, callback) {
    data.location = data.longitude;

    var bottle =
      data.id +
      "-" +
      data.location +
      "-" +
      data.timestamp +
      "-" +
      data.holder +
      "-" +
      data.used;

    $http.get("/add_bottle/" + bottle).success(function(output) {
      callback(output);
    });
  };

  factory.changeHolder = function(data, callback) {
    var holder = data.id + "-" + data.name;

    $http.get("/change_holder/" + holder).success(function(output) {
      callback(output);
    });
  };

  return factory;
});
