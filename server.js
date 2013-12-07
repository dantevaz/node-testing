//setup Dependencies
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var cache = {};
var port = 3000;
/************************************ HELPER FUNCTIONS ****************************************/

/*
    404 - NOT FOUND handler
 */
function send404(response){
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: NOT FOUND');
    response.end();
}

/*
    Serve file contents
 */
function sendFile(response, filePath, fileContents){
    response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

/*
   Serve static file contents
 */
function serveStatic(response, cache, absPath){
    if (cache[absPath]){
        sendFile(response, absPath, cache[absPath]);
    }else{
        fs.exists(absPath, function(exists){
            if (exists){
                fs.readFile(absPath, function(err, data){
                    if (err){
                        send404(response);
                    }else{
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                })
            }else{
                send404(response);
            }
        })
    }
}

/* Create server */
var server = http.createServer(function(request, response){
    var filePath = false;

    if (request.url == '/'){
        filePath = 'public/index.html';
    }else{
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(port, function(){
    console.log('Listening on http://0.0.0.0:' + port );
});

var chatServer = require('./lib/chat_server');
chatServer.listen(server);