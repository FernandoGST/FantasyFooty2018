// server.js
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();
const storage = require("node-persist");
const port = 8000;
const https = require("https");
var cors = require("cors");
const md5 = require("md5");
app.use(bodyParser.json());
app.use(cors());

app.post("/users", async (req, res) => {
  try {
    storage.init();
    const user = req.body;
    var app_data = await storage.getItem("app-data");
    if (app_data == null) {
      await storage.setItem("app-data", {});
      var app_data = await storage.getItem("app-data");
    }
    if (app_data.users == null) app_data.users = {};
    if (app_data.users[user.email] != null) {
      res.send(409);
      return;
    }
    user.password = md5(user.password);
    user.dob = "";
    user.favorite_tournaments = {};
    user.full_name = user.email;
    app_data.users[user.email] = user;
    await storage.setItem("app-data", app_data);
    res.send(user);
  } catch (e) {
    console.log(e);
  }
});

app.put("/users", async (req, res) => {
  try {
    storage.init();
    const user = req.body;
    var app_data = await storage.getItem("app-data");
    if (app_data == null) {
      await storage.setItem("app-data", {});
      var app_data = await storage.getItem("app-data");
    }
    if (app_data.users == null) app_data.users = {};
    app_data.users[user.email] = user;
    await storage.setItem("app-data", app_data);
    res.send(user);
  } catch (e) {
    console.log(e);
  }
});

app.get("/users", async (req, res) => {
  try {
    const email = req.query.email;
    storage.init();
    var app_data = await storage.getItem("app-data");
    if (app_data == null) {
      await storage.setItem("app-data", {});
      var app_data = await storage.getItem("app-data");
    }

    if (email == null) {
      res.send(app_data.users);
      return;
    }
    if (app_data.users == null) app_data.users = {};
    if (app_data.users[email] == null) {
      res.send("User Doesnt Exists");
      return;
    }
    app_data.users[email];
    res.send(app_data.users[email]);
  } catch (e) {
    console.log(e);
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const emailPassword = req.body;
    console.log(emailPassword);
    if (emailPassword == null) {
      res.send(null);
      return;
    }
    if (emailPassword[0] == null) {
      res.send(null);
      return;
    }
    if (emailPassword[1] == null) {
      res.send(null);
      return;
    }
    storage.init();
    var app_data = await storage.getItem("app-data");
    if (app_data == null) {
      await storage.setItem("app-data", {});
      var app_data = await storage.getItem("app-data");
    }
    const user = app_data.users[emailPassword[0]];
    if (user != null) {
      if (user.password === md5(emailPassword[1])) {
        res.send(user);
        return;
      }
    }
    res.send(null);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/users", async (req, res) => {
  try {
    const email = req.query.email;
    storage.init();
    var app_data = await storage.getItem("app-data");
    if (app_data == null) {
      await storage.setItem("app-data", {});
      var app_data = await storage.getItem("app-data");
    }
    if (app_data.users == null) app_data.users = {};
    if (app_data.users[email] == null) {
      res.send("User Doesnt Exists");
      return;
    }
    delete app_data.users[email];
    await storage.setItem("app-data", app_data);
    res.send(JSON.stringify("Ok"));
  } catch (e) {
    console.log(e);
  }
});

app.get("/rely", async (req, Ores) => {
  const url = req.query.request;
  if (url == null) return;
  console.log("relaying to " + url);
  https
    .get(url, res => {
      let data = "";
      // A chunk of data has been recieved.
      res.on("data", chunk => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      res.on("end", () => {
        Ores.send(data);
      });
    })
    .on("error", e => {
      console.error(e);
    });
});

app.listen(port, () => {
  console.log("We are live on " + port);
});