// Code by @lynnocheu

$(function() {
	// Démarrage du Jeu...
	setTimeout(function()
	{
		Game.Start();
		Game.canStart = true;
	}, 2500);
});


var Game = {
	Remodal: false,
	canStart: false,
	Top: new Array(20, 21, 22, 23, 24),
	Bottom: new Array(0, 1, 2, 3, 4),
	Left: new Array(4, 9, 14, 19, 24),
	Right: new Array(0, 5, 10, 15, 20),
	moves: 0,
	
	Move: function(direction)
	{
		if( !this.canStart )
			return;

		var current = this.getPivotPosition();

		if( direction == -1 && $.inArray(current, Game.Right) != -1 ){
			console.log("Déplacement interdit...");
			return;
		}
		else if( direction == 1 && $.inArray(current, Game.Left) != -1 ){
			console.log("Déplacement interdit...");
			return;
		}
		else if( direction == -5 && $.inArray(current, Game.Bottom) != -1 ){
			console.log("Déplacement interdit...");
			return;
		}
		else if( direction == 5 && $.inArray(current, Game.Top) != -1 ){
			console.log("Déplacement interdit...");
			return;
		}
		else{
			// autre = ".gametable td:nth-child("+ eval( current + direction ) +")";
			if( current >= 0 && current < 25  ){
				chevalier = document.querySelectorAll(".gametable td")[ eval( current + direction ) ];
				pivot = document.querySelectorAll(".gametable td")[ eval( current ) ];
				
				chevalierID = $(chevalier).attr('data-valid');
				pivotID = $(pivot).attr('data-valid');

				$(pivot).html( $(chevalier).find('button') ).removeClass("pivot").attr('data-valid', chevalierID );
				$(chevalier).addClass("pivot").attr('data-valid', pivotID);

				Game.isWin() ? Game.displayMessage() : false;
			}
		}
	},

	getPivotPosition: function()
	{
		var i = 0;
		var tds = document.querySelectorAll(".gametable td");
		while( ( i < 25 && i >= 0 ) && tds[i].getAttribute('class') != 'pivot' )
		{
			i++;
		}
		return i;
	},

	isWin: function()
	{
		var i = 0; win = true;
		var tds = document.querySelectorAll(".gametable td");
		while( i < 25 )
		{
			if( parseInt( tds[i].getAttribute('data-valid'), 10 ) != i ){
				// console.log("ID = "+tds[i].getAttribute('data-valid')+" et i = "+i);
				win = false
			}	
			i++;
		}
		return win;
	},

	random: function(min, max, integer)
	{
		if (!integer) {
			return Math.random() * (max - min) + min;
		} else {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
	},

	permutation: function(index1, index2, callback){
		var elmt1 = $( document.querySelectorAll(".gametable td")[ eval( index1 ) ] );
		var elmt2 = $( document.querySelectorAll(".gametable td")[ eval( index2 ) ] );
		// Permutation...
		var temp = elmt1.clone();
		
		elmt1.attr('data-valid', elmt2.attr('data-valid')).html( elmt2.clone().html() );
		elmt2.attr('data-valid', temp.attr('data-valid')).html( temp.html() );

		if( elmt1.hasClass("pivot") )
		{
			elmt1.removeClass("pivot");
			elmt2.addClass("pivot");
		}
		else if( elmt2.hasClass("pivot") )
		{
			elmt2.removeClass("pivot");
			elmt1.addClass("pivot");
		}
		
		var func = ( callback == null ) ? null : callback();
	},

	Start: function(){
	    var self = this;
	    self.moves = 0;
		Game.canStart = true;

        if( $(".remodal-wrapper")[0] || Game.Remodal ){
			Game.Remodal.close();	
		}
		
		
		for (var i = 0; i < 64; i++) {
			Game.permutation( Game.random(0, 24, true), Game.random(0, 24, true) );
		}
		
		
		$(".gametable td").each(function(){
            $(this).find('button').attr("onclick", "Game.playme(this)");
        });
		
	},
	
	getMyPosition: function(elmt){
	    var i = 0;
		var tds = $(".gametable td");
		while( ( i < 25 && i >= 0 ) && !$(tds[i]).hasClass('active') ){
			i++;
		}
		return i;
	},
	
	playme: function(e){
		var self = this;
		$(".gametable td").removeClass("active");
		var move = $("#counter");
        $(e).parent("td").addClass("active");
        
        var me = this.getMyPosition();
        var pivot = this.getPivotPosition();
        
        if( !this.isVoisin(me, pivot) ){
	        //console.log("NO WAY");
	    }
	    else{
	        this.permutation(me, pivot, function(){
	        	if( Game.isWin() ){ 
	        		Game.displayMessage();
        		}
        		else {
        			self.moves++;
        		}
        		move.find("span").text(self.moves);
	        });
	    }
	},

    isVoisin: function(me, pivot){
        var tds = $(".gametable td");
        var conTop = $( tds[eval(me + 5)] ).hasClass("pivot") && $.inArray( eval(me + 5), Game.Bottom) == -1;
        var conDown = $( tds[eval(me - 5)] ).hasClass("pivot") && $.inArray( eval(me - 5), Game.Top) == -1;
        
        var conLeft = $( tds[eval(me - 1)] ).hasClass("pivot") && $.inArray( eval(me - 1), Game.Left) == -1;
        
        var conRight = $( tds[eval(me + 1)] ).hasClass("pivot") && $.inArray( eval(me + 1), Game.Right) == -1;
      
        if( !conTop ){
            if( !conDown ){
                if( !conLeft ){
                    if( !conRight ){
                        return false;
                    }
                }
            }
        }
        
        return true;
    },

	displayMessage: function(){
		var name = playerDetail.a;
        alert("Congratulations");
	},
};