var io = require("socket.io"), poker = require("./poker");
var socket = io.listen("localhost", 3000);
var players = {};
var start = false;
var deck = poker.shufflePack(poker.pack());
Object.size = function(object) {
	var size = 0;
	var key;
	for(key in object) {
		if(object.hasOwnProperty(key))
			size++;
	}
	return size;
}
socket.on('connection', function(client) {
	client.on('addPlayer', function(player) {
		players[client.id] = player;
		console.log("Player" + player + "has logged on.");
		console.log(Object.size(players));
		for(var key in players) {
			console.log("Players: " + key + players[key]);
		}
	});
	client.on('disconnect', function() {
		console.log("Player" + player + " has disconnected.");
		delete players[client.id];
		deck = poker.shufflePack(poker.pack());
	});
	client.on('dealCards', function(){
		var cards = poker.draw(deck, 5, "", true);
		client.emit('showCards', cards);
	});
});
