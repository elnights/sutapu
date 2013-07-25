(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to socket server...');
  }

  socket.on('connect', function socketConnected() {

    socket.on('message', function messageReceived(message) {

      log('New comet message received :: ', message);

    });

    log('socket connected');

  });

  window.socket = socket;

  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);

$.get('/auth/currentuser', function(data) {
  
});
