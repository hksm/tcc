'use strict';

const httpServer = require('http-server');

const serv = httpServer.createServer({
	root: './' // default /public
});



// livereload code

var livereload = require('livereload');
var server = livereload.createServer({
	usePolling: true,
	originalPath: 'http://localhost:420',
}, () => {
	console.log('livereload ready to accept connections');
	
	serv.listen(420); // porta 420
});
server.watch('./'); // porta 35729 