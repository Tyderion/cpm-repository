express = require("express");
redis = require("redis");

app = express();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.logger());
});

function getCode (name) {
  return "ACode"+Math.random();
}

app.param('name', function(req,res, next, name){
  //do something with id
  //store id or other info in req object
  //call next when done
  req.info = { name: name, code: getCode(name) }
  next();
});

app.get("/test", function (req, res) {
  res.send("Hello World")
});

app.get("/api/v1/getCode/:name", function (req, res) {
  res.send(req.info)
});

app.get("/api/v1/list", function (req, res) {
  res.send(["cpm", "master", "slave"]);
});

function saveNewProgram (name, code) {
  // body...
}

app.post("/api/v1/publish", function(req, res) {
  name = req.body.name
  code = req.body.code
  if (typeof name !== "undefined" && name !== null) {
    if (typeof code !== "undefined" && code !== null) {
      saveNewProgram(name, code)
      res.send("Saved")
    }
  }
  res.send("Need name and code to save the program")
});


app.listen(3000);


