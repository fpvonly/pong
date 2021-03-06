var express = require('express');
var path = require('path');
var fs = require('fs');
var url = require('url');

var app = express();
var server = app.listen(29, function() {
  console.log('Pong game server started');
  var host = server.address().address;
  var port = server.address().port;
});

app.use( '/css', express.static( path.join( __dirname, 'css') ) );
app.use( '/js', express.static( path.join( __dirname, 'js') ) );
app.use( '/sounds', express.static( path.join( __dirname, 'sounds') ) );

app.get( '/', function( req, res ) {
  res.sendFile(  __dirname+'/index.html' );
    //res.render( 'index' );
  }
);
