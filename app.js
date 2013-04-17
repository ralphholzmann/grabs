// Dependencies
var express     = require( "express" ),
    formidable  = require('formidable'),
    fs          = require('fs'),
    join        = require('path').join,
    imageDir   = join( __dirname, "public"),
    moment      = require("moment"),
    app         = express.createServer();

// Configure application
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Handle incoming image posts
app.post("/", function( req, res, next ) {
  new formidable.IncomingForm().parse( req, function( err, fields, files ) {

    (function write() {
      var name = Math.random().toString(36).slice(2) + ".png",
          imagePath = join( imageDir, name );

      fs.exists( imagePath, function( exists ) {
        if ( exists ) {
          write();
        } else {
          fs.rename( files.imagedata.path, imagePath );
          res.writeHead( 200, {'content-type': 'text/plain'} );
          res.end("http://grabs.ralphholzmann.com/" + name );
        }
      });
    })();
  });
});

/**/
app.get("/:id-card.png", function( req, res ) {
  fs.exists(join(__dirname, "public", req.params.id + ".png"), function(exists) {
    if (exists) {
      fs.createReadStream(join(__dirname, "public", req.params.id + ".png")).pipe(res);
    } else {
      res.send(404);
    }
  })
});

app.get("/:id.png", function( req, res ) {
  var imgPath = join(__dirname, "public", req.params.id + ".png");
  fs.exists(imgPath, function(exists) {
    if (exists) {
      if (req.headers["user-agent"] && req.headers["user-agent"].toLowerCase().indexOf("twitterbot") > -1) {
        fs.stat(imgPath, function(err, stats) {
          res.render("image", {
            id: req.params.id,
            time: moment(stats.ctime).format("LLL")
          });
        });
      } else {
        fs.createReadStream(imgPath).pipe(res);
      }
    } else {
      res.send(404);
    }
  })
});
/**/

module.exports = app;

app.listen( 8080 );
