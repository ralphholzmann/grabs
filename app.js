var express     = require("express");
var fs          = require("fs");
var path        = require("path");
var join        = path.join;
var moment      = require("moment");
var serveStatic = require('serve-static');
var multiparty  = require("multiparty");
var morgan      = require("morgan");
var config      = require("./config");
var lex         = require('greenlock-express');

var imageDir    = join( __dirname, "public");
var staticDir   = join( __dirname, "static");
var app         = module.exports = express();

var ONE_YEAR_MILLISECONDS = 3.154e10;
var OK                    = 200;

app.set("port", process.env.PORT || 8080);
app.set('view engine', 'jade');
app.use(morgan('tiny'));

function createRandomWriteStream (ext, callback) {
  var name = Math.random().toString(36).slice(2, 10) + ext; // \o/
  var imagePath = join(imageDir, name);

  fs.exists(imagePath, function (exists) {
    if (exists) {
      createRandomWriteStream(ext, callback);
    } else {
      callback(fs.createWriteStream(imagePath));
    }
  });
}

// Handle incoming post requests
app.post("/", function (req, res, next) {
  var form = new multiparty.Form();

  form.on('part', function (part) {
    if (part.name !== 'filedata') return part.resume();

    var ext = path.extname(part.filename);
    createRandomWriteStream(ext, function (writeStream) {
      part.pipe(writeStream).on("close", function () {
        res.writeHead(OK, {'content-type': 'text/plain'});
        res.end("http://" + config.domain + "/" + writeStream.path.split("/").pop());
      });
    });
  });

  form.on('error', next);

  form.parse(req);
});

// Static server
app.use(serveStatic(staticDir, {
  maxAge: ONE_YEAR_MILLISECONDS
}));

// Handle asciicinema files
app.get("/:id.rec.json", function (req, res, next) {
  var jsonPath = join(imageDir, req.params.id + ".rec.json");

  if (!req.query.s) {
    fs.stat(jsonPath, function(err, stats) {
      if (err) {
        return res.send('');
      }

      res.render(join(__dirname, "views", "asciicinema.jade"), {
        id: req.params.id,
        time: moment(stats.ctime).format("LLL"),
      });
    });
  } else {
    next();
  }
});

// Handler to check if request is from Twitter
app.get("/:id.png", function (req, res, next) {
  var ua = req.headers["user-agent"] || "";
  var isTwitterBot = ua.toLowerCase().indexOf("twitterbot") > -1 && !req.query.s;

  if (isTwitterBot) {
    var imgPath = join(imageDir, req.params.id + ".png");

    fs.stat(imgPath, function(err, stats) {
      res.render(join(__dirname, "views", "image.jade"), {
        id: req.params.id,
        time: moment(stats.ctime).format("LLL"),
        domain: config.domain,
        username: config.twitter_username
      });
    });
  } else {
    next();
  }
});

// Static server
app.use(serveStatic(imageDir, {
  maxAge: ONE_YEAR_MILLISECONDS
}));

// Start it up
if (!module.parent) {
  lex.create({
    server: 'production',
    email: config.email,
    agreeTos: true,
    approveDomains: [ config.domain ],
    app: app
  }).listen(8080, 9080)
}
