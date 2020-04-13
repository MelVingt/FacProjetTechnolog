var io = require("socket.io");
var sockets = io.listen(3000);
//var sockets2 = io.listen(4000);
sockets.on('connection', function (socket) {
    socket.on('playerOne', function (data) {
        sockets.emit("move",data.player);     
    });
});

