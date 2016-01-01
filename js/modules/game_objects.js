define(function () {

	this.windowW = window.innerWidth;
	this.windowH = window.innerHeight;

	this.canvas = document.createElement('canvas');
	canvas.id = 'canvas_game';
	canvas.width = windowW;
	canvas.height = windowH;
	//canvas.style.cursor = 'none';
	

	this.ctx = canvas.getContext('2d');

	this.paddles = [];

	this.Ball = {
		x:15,
		y:25,
		c:'#000000',
		rad:10,
		xVs:3,
		yVs:6,
		updatePos: function()
		{
			this.x += this.xVs;
			this.y += this.yVs;
		},
		draw: function()
		{				
			this.updatePos(); // update new Ball position for next frame drawing

			ctx.beginPath();					
			//ctx.lineWidth = 5;			
			//	ctx.strokeStyle = this.c;
			ctx.arc( this.x, this.y, this.rad, 0, Math.PI*2, false );
			//ctx.stroke();
			ctx.fillStyle = this.c;	
			ctx.fill();			
		},
		reset: function()
		{
			this.x = 15;
			this.y = 25;
			this.c = '#000000';
			this.rad = 10;
			this.xVs = 3;
			this.yVs = 6;
		}
	};

	this.Paddle = function( position )
	{
		 this.h = 10;
		 this.w = 150;

		 this.x = windowW/2 - this.w/2;
		 this.y = ( position == 'bottom' ) ? windowH-this.h : 0;

		 this.hit = false;

		 this.reset = function() {
		 	this.h = 10;
			this.w = 150;
		 	this.x = window.innerWidth/2 - this.w/2;
		 	this.y = ( position == 'bottom' ) ? window.innerHeight-this.h : 0;
		 }
		 //console.log('Position: ' + position + ', x: ' + this.x + ', y: ' + this.y);
	};

	this.restartBtn = {
		rad:150,
		c:'#000000',
		coords:{},		
		mouseStatus:'OUT',
		animInterval: null,
		draw: function() {
			ctx.beginPath();
			ctx.fillStyle = '#000000';
			ctx.arc( window.innerWidth/2, window.innerHeight/2, this.rad, 0, Math.PI*2, false );
			ctx.fill();
			
			ctx.font = '20px Arial, sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#ffffff';
			ctx.fillText('Game Over! Points: '+POINTS, window.innerWidth/2, window.innerHeight/2-15);
			ctx.fillText('Click here to restart!', window.innerWidth/2, window.innerHeight/2+15);	

			this.coords.X_a = ( window.innerWidth/2 )	- 150;	
			this.coords.X_b = ( window.innerWidth/2 )	+ 150;	
			this.coords.Y_a = ( window.innerHeight/2 )	- 150;	
			this.coords.Y_b = ( window.innerWidth/2 )	+ 150;	
			 
			restart_btn = this; // for event handler functions
			
			canvas.removeEventListener('click', beginBtn.clickButton,false );
			canvas.removeEventListener('click', this.clickButton,false );
			canvas.addEventListener('click', this.clickButton, false );
			canvas.addEventListener('mousemove', this.mouseOverBtn, false );			
		},
		clickButton: function(e)
		{
			var x = e.pageX;
			var y = e.pageY;
			
			if( x >= restart_btn.coords.X_a && x <= restart_btn.coords.X_b )
			{
				if( y >= restart_btn.coords.Y_a && y <= restart_btn.coords.Y_b )
				{
					if( GAME_STATE === 'STOP' )
					{
						console.log('RESET EVENT');
						canvas.removeEventListener('click', beginBtn.clickButton,false );
						window.dispatchEvent(window.RESET_GAME_EVENT);						
						canvas.removeEventListener('click', this.clickButton,false );
					}
				}
			}
		},
		mouseOverBtn: function(e)
		{
			var x = e.clientX;
			var y = e.clientY;
						
			if( x >= restart_btn.coords.X_a && x <= restart_btn.coords.X_b )
			{
				if( y >= restart_btn.coords.Y_a && y <= restart_btn.coords.Y_b )
				{
					if( GAME_STATE === 'STOP' )
					{
						clearInterval(restart_btn.animInterval);						
						over();				
					}
				}
				else
				{
					if( GAME_STATE === 'STOP' )
					{
						clearInterval(restart_btn.animInterval);						
						out();
					}
				}
			}
			else
			{
				if( GAME_STATE === 'STOP' )
				{
					clearInterval(restart_btn.animInterval);					
					out();
				}
			}

			function over()
			{
				var count = 0;
				var animInterval = setInterval( function() {
					ctx.beginPath();
					ctx.strokeStyle = '#000000';
					ctx.fillStyle = '#000000';
					ctx.lineWidth = 6;
					ctx.arc( window.innerWidth/2, window.innerHeight/2, 170+(count*5), 0, Math.PI*2, false );
					ctx.stroke();
					count++;

					if( count >= 10 )
					{
						clearInterval( animInterval );
					}
				}, 1000/100);		
			}

			function out()
			{
				var count = 0;
				var animInterval = setInterval( function() {
					ctx.beginPath();
					ctx.strokeStyle = '#ffffff';
					ctx.lineWidth = 10;
					ctx.arc( window.innerWidth/2, window.innerHeight/2, 170+(count*6), 0, Math.PI*2, false );
					ctx.stroke();
					count++;

					if( count >= 10 )
					{
						clearInterval( animInterval );
					}
				}, 1000/100);		
			}
		}
	};

	this.beginBtn = {
		rad:150,
		c:'#000000',
		coords:{},		
		mouseStatus:'OUT',
		animInterval: null,
		draw: function() {
			ctx.beginPath();
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

			ctx.fillStyle = '#000000';
			ctx.arc( window.innerWidth/2, window.innerHeight/2, this.rad, 0, Math.PI*2, false );
			ctx.fill();
			
			ctx.font = '30px Arial, sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#ffffff';
			ctx.fillText('Start!', window.innerWidth/2, window.innerHeight/2);

			this.coords.X_a = ( window.innerWidth/2 )	- 150;	
			this.coords.X_b = ( window.innerWidth/2 )	+ 150;	
			this.coords.Y_a = ( window.innerHeight/2 )	- 150;	
			this.coords.Y_b = ( window.innerWidth/2 )	+ 150;	
			 
			restart_btn = this; // for event handler functions
			
			canvas.removeEventListener('click', restartBtn.clickButton,false );
			canvas.removeEventListener('click', this.clickButton,false );
			canvas.addEventListener('click', this.clickButton,false );
			canvas.addEventListener('mousemove', this.mouseOverBtn,false );		

		},
		clickButton: function(e)
		{
			var x = e.pageX;
			var y = e.pageY;
			
			if( x >= beginBtn.coords.X_a && x <= beginBtn.coords.X_b )
			{
				if( y >= beginBtn.coords.Y_a && y <= beginBtn.coords.Y_b )
				{
					if( GAME_STATE === 'STOP' )
					{
						console.log('BEGIN EVENT');
						window.dispatchEvent(window.BEGIN_GAME_EVENT);
						canvas.removeEventListener('click', this.clickButton,false );
					}
				}
			}
		},
		mouseOverBtn: function(e)
		{
			var x = e.clientX;
			var y = e.clientY;
						
			if( x >= beginBtn.coords.X_a && x <= beginBtn.coords.X_b )
			{
				if( y >= beginBtn.coords.Y_a && y <= beginBtn.coords.Y_b )
				{
					if( GAME_STATE === 'STOP' )
					{
						clearInterval(beginBtn.animInterval);						
						over();				
					}
				}
				else
				{
					if( GAME_STATE === 'STOP' )
					{
						clearInterval(beginBtn.animInterval);						
						out();
					}
				}
			}
			else
			{
				if( GAME_STATE === 'STOP' )
				{
					clearInterval(beginBtn.animInterval);					
					out();
				}
			}

			function over()
			{
				var count = 0;
				var animInterval = setInterval( function() {
					ctx.beginPath();
					ctx.strokeStyle = '#000000';
					ctx.fillStyle = '#000000';
					ctx.lineWidth = 6;
					ctx.arc( window.innerWidth/2, window.innerHeight/2, 170+(count*5), 0, Math.PI*2, false );
					ctx.stroke();
					count++;

					if( count >= 10 )
					{
						clearInterval( animInterval );
					}
				}, 1000/100);		
			}

			function out()
			{
				var count = 0;
				var animInterval = setInterval( function() {
					ctx.beginPath();
					ctx.strokeStyle = '#ffffff';
					ctx.lineWidth = 10;
					ctx.arc( window.innerWidth/2, window.innerHeight/2, 170+(count*6), 0, Math.PI*2, false );
					ctx.stroke();
					count++;

					if( count >= 10 )
					{
						clearInterval( animInterval );
					}
				}, 1000/100);		
			}
		}
	};

	return {
		paddles: this.paddles,
		Ball: this.Ball,
		Paddle: this.Paddle,
		restartBtn: this.restartBtn,
		beginBtn: this.beginBtn,
		canvas: this.canvas,
		ctx: this.ctx,
		windowW: this.windowW,
		windowH: this.windowH
	};

});