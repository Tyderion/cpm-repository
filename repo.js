express = require("express");
redis = require("redis");

app = express();


store_prefix = "programs:"
listname = "programlist"
client = redis.createClient()

github = "github"
pastebin = "pastebin"


// Add my programs to the store
saveNewProgram("cpm", "g:Tyderion/6296195")
saveNewProgram("master", "g:Tyderion/6298100")
saveNewProgram("slave", "g:Tyderion/6298113")
saveNewProgram("relay", "g:Tyderion/6297743")
saveNewProgram("client", "g:Tyderion/6298116")
saveNewProgram("order", "g:Tyderion/6298119")
saveNewProgram("tunnel", "p:MjqSE2RC")
saveNewProgram("rect", "p:MzRUZcw6")
saveNewProgram("archie", "p:H19M3mwm") // API

// client.set("blabla", "ABCDEF")

app.configure(function(){
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.logger());
});


// app.param('name', function(req,res, next, name){
//   console.log("Got parameter!!!")
//   client.get(store_prefix+name, function (error, code) {
//     console.log("got code: " + code)
//     if (code !== null) {
//       res.send({ name: name, code: code})
//     } else {
//       next("Code does not exist for " + name)
//     }
//       });
// });

app.get("/test", function (req, res) {
  res.send("Hello World")
});

app.get("/test/:name")

app.get("/api/v1/get/:([A-Za-z]+)", function(req, res) {
  console.log(req.params);
  name = req.params[0];
    client.get(store_prefix+name, function (error, code) {
      print("error: " + error)
    if (error)
      next(error)
    console.log("got code: " + code);
    provider = "";
    if (code[0] == "p") {
      provider = pastebin;
    } else if (code[0] == "g") {
      provider = github;
    }
    if (code !== null) {
      res.send({ name: name, code: code.substring(2), provider: pastebin});
    } else {
      next("Code does not exist for " + name)
    }
      });
});

app.get("/api/v1/getSimple/:([A-Za-z]+)", function(req, res) {
  console.log(req.params);
  name = req.params[0];
    client.get(store_prefix+name, function (error, code) {
        if (error)
          next(error)
        console.log("got code: " + code);
        provider = "";
        if (code[0] == "p") {
          provider = pastebin;
        } else if (code[0] == "g") {
          provider = github;
        }
        if (code !== null) {
          res.send(code);
        } else {
          next("Code does not exist for " + name)
        }
      });
});

// app.get("/api/v1/get/:name");

app.get("/api/v1/list", function (req, res) {
  client.smembers(listname, function (error, result) {
      res.send(result)
  })
});

function saveNewProgram (name, code) {
  console.log("Saving " + code + " as " + name)
  client.sadd(listname, name)
  client.set(store_prefix+name, code)
}

app.post("/api/v1/publish", function(req, res) {
  name = req.body.name
  code = req.body.code
  if (typeof name !== "undefined" && name !== null) {
    if (typeof code !== "undefined" && code !== null) {
      saveNewProgram(name, code)
      res.send("Saved " + name)
    }
  }
  res.send("Need name and code to save the program")
});



app.listen(3000);


