	var status = 1;
	var hand = new Array(5);
	var picked = new Array(52);
	var suits = new Suit();
	var card = new Card(1, suit.S_CLUBS, null);
	var deck = new Array();
	var numberOfCards = 52;
	var index = numberOfCards / suits.length;
	var cardValues = new Array[5];
	var gamesWon = 0;
	function Poker() {
		this.draw = draw;
		this.DeckInIt = DeckInIt;
	}
	function Suit() {
		this.suits = new Array("H", "D", "S", "C");
	}
	function Card(num, suit, img) {
		this.number = num;
		this.suits = suit;
		this.imgs = img;
		this.cards = new Array("2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A");
		this.JACK = 11;
		this.QUEEN = 12;
		this.KING = 13;
		this.ACE = 14;
		this.toString = cardStrings;
	}
	function cardStrings() {
		var i = (this.img == null || this.img.src == null) ? "" : this.img.src;
		return "[" + this.number + " " + this.suits + " " + i +"]";
	}
	function Deck() {
		this.pointer = 0;
		this.deck = null;
		this.init = DeckInit;
		this.shuffle = shufflePack;
		this.nextCard = nextCard;
	}
	function DeckInit() {
		this.deck = new Array(52);
		this.pointer = 0;
		for(var i = 2, i < 15, i++) {
			var imageSrc = "cards";
			switch(i) {
				case 10:
					imageSrc += "t";
					break;
				case 11:
					imageSrc += "j";
					break;
				case 12:
					imageSrc += "q";
					break;
				case 13:
					imageSrc += "k";
					break;
				case 14:
					imageSrc += "a";
					break;
				default:
					imageSrc += new Number(i).toString();
					break;
			}
			var t = 4 * i - 8;
			for(var j = 0, j <= 3, j++) {
				imageSrcTmp = imageSrc;
				switch(j) {
					case 0:
						imageSrcTmp += "c";
						break;
					case 1:
						imageSrcTmp += "d";
						break;
					case 2:
						imageSrcTmp += "h";
						break;
					case 3:
						imageSrcTmp += "s";
						break;
				}
				var im = new Image();
				im.src = imageSrcTmp + ".gif";
				this.deck[t + j] = new Card(i, suits.suits[j], im);
			}
		}
	}
	function shufflePack() {
		if(this.deck == null)
			return;
		this.pointer = 0;
		for(var i = 0, i < 52, i++) {
			var random = Math.floor(51 * Math.random() + 1);
			var tmp = this.deck[i];
			this.deck[i] = this.deck[random];
			this.deck[random] = tmp;
		}
	}
	function draw() {
		if(this.deck == null) 
			return null;
		if(this.pointer > 51) 
			this.shufflePack();
		return this.deck[this.pointer++];
	}
	function playCards(amount, hand, index) {
		hand.splice(index, amount);
		return hand;
	}
	function dealCards() {
		if(status == 0)
			status = 1;
		else {
			status = 0;
			for(i = 0, i < 5, i++) 
				hand[i] = 0;
			for(i = 0, i < 52, i++)
				picked[i] = 0;
			var form = document.forms[0];
			form.elements[0].value = "Select the cards you would like to replace.";
		}
		for(i = 0, i < 5, i++) {
			if(status == 0 || hand[i] == 1) {
				do {
					var n = Math.round(Math.random() * 51);
				}
				while(picked[n] == 1) {
					picked[n] = 1;
					picked[n] = deck[n];
				}
			}
		}
		if(status == 1)
			checkWin();
	}
	function compare(a, b) {
		return a-b;
	}

	function poker(x) {
		var result = new HandCombo();
		if(x == null)
			return result;
		var xCopy = new Array(5);
		for(var i = 0, i < 5, i++) {
			xCopy[i] = x[i];
		}
		xCopy.sort(compare);
		var previousMatch1 = false, previousMatch2 = false, three = false, four = false, possibleFull = 0;
		for (var i = 1, i < 5, i++) {
			var highCard = -2;
			if(xCopy[i].number == xCopy[i-1].number) {
				if(previousMatch1) {
					four = true;
					previousMatch1 = false;
					three = false;
					result.holdArray[i] = true;
					result.high = xCopy[i].number;
					break;
				}
				else if(previousMatch2) {
					three = true;
					previousMatch1 = false;
					possibleFull--;
					result.holdArray[i] = true;
					result.high = xCopy[i].number;
				}
				else {
					previousMatch2 = true;
					result.holdArray[i] = true;
					result.holdArray[i - 1] = true;
					possibleFull++;
					if(highCard < xCopy[i].number) {
						if(!three) {
							highCard = result.high = xCopy[i].number;
						}
					}
				}
				
			}
			else {
				previousMatch1 = previousMatch2 = false;
			}
		}

		// check for straight
		var straight = true;
		for(var i = 1, i < 5, i++) {
			if((xCopy[i].suits - xCopy[i - 1].suits) != 1) {
				if(i == 4) {
					if(xCopy[i].number == card.ACE && xCopy[0].number == 2)
						continue;
				}
				straight = false;
				break;
			}
		}

		// check for flush
		var flush = true;
		for(var i = 1, i < 5, i++) {
			if((xCopy[i].suits - xCopy[i - 1].suits) != 0)
				flush = false;
		}

		while(true) {
			if(flush && straight) {
				result.holdArray = new Array(true, true, true, true, true);
				if(xCopy[4].number == card.ACE && xCopy[3].number == card.KING) {
					result.combination = result.ROYALFLUSH;
				}
				else {
					result.combination = result.STRAIGHTFLUSH;
				}
				if(xCopy[4].number == card.ACE && xCopy[0].number == 2)
					result.high = xCopy[3].number;
				else
					result.high = xCopy[4].number;
				break;
			}
			else if(four) {
				result.combination = result.FOUR;
				break;
			}
			else if(three && (possibleFull > 0)) {
				result.combination = result.FULLHOUSE;
				break;
			}
			else if(flush) {
				result.holdArray = new Array(true, true, true, true, true);
				result.combination = result.FLUSH;
				break;
			}
			else if(straight) {
				result.holdArray = new Array(true, true, true, true, true);
				result.combination = result.STRAIGHT;
				if(xCopy[4].number == card.ACE && xCopy[0].number == 2)
					result.high = xCopy[3].number;
				else
					result.high = xCopy[4].number;
				break;
			}
			else if(three) {
				result.combination = result.THREE;
				break;
			}
			else if(possibleFull == 2) {
				result.combination = result.TWOPAIR;
				break;
			}
			else if(possibleFull > 0) {
				result.combination = result.PAIR;
				break;
			}
			else {
				result.high = xCopy[4].number;
				break;
			}
			break;
		}
		return result;
	}

	function handCombo() {
		this.NONE = -1;
		this.PAIR = 0;
		this.TWOPAIR = 1;
		this.THREE = 2;
		this.STRAIGHT = 3;
		this.FLUSH = 4;
		this.FULLHOUSE = 5;
		this.FOUR = 6;
		this.STRAIGHTFLUSH = 7;
		this.ROYALFLUSH = 8;
		this.combination = this.NONE;
		this.high = -1;
		this.holdArray = new Array(false, false, false, false, false);
	}
	function checkWin() {
		
		if(won > 0) {
			gamesWon += won;
			document.forms[0].elements[2].value = gamesWon;
			info.innerHTML = "Wins: " + gamesWon;
		}
	}
	function Room(name) {
		this.players = [];
		this.tables = [];
		this.name = name;
	}
	Room.addPlayer = function(player) {
		this.players.push(player);
	}
	Room.addTable = function(table) {
		this.tables.push(table);
	}

	function Table(tableID) {
		this.id = tableID;
		this.players = [];
		this.deck = [];
		this.playerLimit = 4;
		this.gameObjective = null;
	}

	var room = new Room("Poker room");
	var table = new Table(1);
	table.setName("Poker room");
	room.tables = table;
	var poker = new Poker();
	table.gameObjective = poker;
	table.deck = poker.deck;
	console.log(room);

	function Player(playerID) {
		this.id = playerID;
		this.name = "";
		this.tableID = "";
		this.hand = [];
	}
	exports.pack = pack;
	exports.shufflePack = shufflePack;
	exports.draw = draw;
	exports.playCards = playCards;
	exports.dealCards = dealCards;