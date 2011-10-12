// Dependencies
var express     = require( "express" ),
    formidable  = require('formidable'),
    fs          = require('fs'),
    imagePath   = __dirname + "/public", 
    i           = fs.readdirSync( imagePath ).length;
    app         = express.createServer();

// Configure application
app.configure(function() {
    app.set('views',  __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static( __dirname + "/public" ));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Handle incoming image posts
app.post("/", function( req, res, next ) {

    var name  = "r" + (i++).toString( 36 ),
        form = new formidable.IncomingForm();

        form.parse( req, function(err, fields, files) {
            fs.rename( files.imagedata.path, imagePath + "/" + name + ".png" );
            res.writeHead( 200, {'content-type': 'text/plain'} );
            res.write("http://grabs.ralphholzmann.com/" + name + ".png");
            res.end();
        });

});

/** /
app.get("/:id", function( req, res ) {

    res.render("image", {
        image : req.params[0]
    }); 

});
/**/

module.exports = app;
