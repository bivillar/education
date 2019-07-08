//SPDX-License-Identifier: Apache-2.0

var bottle = require("./controller.js");

module.exports = function(app) {
  app.get("/get_tuna/:id", function(req, res) {
    bottle.get_tuna(req, res);
  });
  app.get("/get_bottle/:id", function(req, res) {
    bottle.get_bottle(req, res);
  });
  app.get("/add_tuna/:tuna", function(req, res) {
    bottle.add_tuna(req, res);
  });
  app.get("/add_bottle/:bottle", function(req, res) {
    bottle.add_bottle(req, res);
  });
  app.get("/get_all_bottles", function(req, res) {
    bottle.get_all_bottles(req, res);
  });
  app.get("/change_holder/:holder", function(req, res) {
    bottle.change_holder(req, res);
  });
  app.get("/change_used/:used", function(req, res) {
    bottle.change_used(req, res);
  });
};
