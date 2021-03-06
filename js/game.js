// For custom events in IE
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

// helper function for accessing local storage data
window.getLocalStorageValByKey = function( key ) {
  if( typeof( Storage ) !== "undefined" ) {
    return localStorage.getItem(key);
  } else {
    return null;
  }
}

var Pong = function( prop ) {
  window.requestFrame = null;
  require(['js/game_objects'], function(gameOM) {
    initGame( gameOM );
  });

  function initGame( gameOM ) {
    window.requestFrame = (function() {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback ) {
          return window.setTimeout(callback, 1000 / 60);
        };
    })();

    window.cancelRequestFrame = ( function() {
      return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
    })();

    // object parameters
    var wrapper_id = prop.wrapper_id;
    var mainNavElem = document.getElementById('game_nav_header') ? document.getElementById('game_nav_header') : null;

    // game components object
    var gameObjects = gameOM;
    var windowW = gameObjects.windowW;
    var windowH = gameObjects.windowH;
    var canvas = null;
    var ctx = gameObjects.ctx;

    this.GAME_STATE = "ACTIVE"; // ACTIVE, STOP
    this.POINTS = 0;
    window.RESET_GAME_EVENT = new CustomEvent('RESET_GAME');
    window.BEGIN_GAME_EVENT = new CustomEvent('BEGIN_GAME');

    if( document.getElementById('canvas_game') ) {
      var canvas = document.getElementById('canvas_game');
      canvas.parentNode.removeChild(canvas);
    }

    var canvas = gameObjects.canvas;
    var canvas_wrapper = document.getElementById( wrapper_id );
    if( typeof canvas_wrapper != 'undefined' && canvas_wrapper) {
      canvas_wrapper.appendChild( canvas );
    } else {
      document.body.appendChild( canvas );
    }

    canvas.addEventListener('mousemove', trackAndUpdate, false);
    document.addEventListener('keydown', trackKeyAndUpdate, false);
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('RESET_GAME', resetGame, false);
    window.addEventListener('BEGIN_GAME', beginGame, false);
    var keyPressed = 0;
    var initGameAnimation = null;

    var collisionSound = document.createElement( 'audio' );
    collisionSound.preload = true;
    collisionSound.src = 'sounds/pong.mp3';

    // GAME ELEMENT OBJECTS + SOME UI

    var paddles = gameObjects.paddles;
    var Ball = gameObjects.Ball;
    var Paddle = gameObjects.Paddle;
    var restartBtn = gameObjects.restartBtn;
    var beginBtn = gameObjects.beginBtn;

    paddles.push( new Paddle('top') );
    paddles.push( new Paddle('bottom') );

    // #############################
    resetGame(); // start game
    // #############################


    // DRAWING FUNCTIONS

    function drawGameCanvasFrame() {
      GAME_STATE = 'ACTIVE';
      initGameAnimation = requestFrame( drawGameCanvasFrame );
      drawCanvasBackground();
      drawPoints();
      drawCanvasPaddles();
      Ball.draw();

      checkCollisions();
    }

    function drawCanvasBackground() {
      ctx.fillStyle = '#' + ( getLocalStorageValByKey( 'bg_color_pick' ) === null ? 'ffffff' : getLocalStorageValByKey( 'bg_color_pick' ) );
      ctx.fillRect(0, 0, windowW, windowH);
    }

    function drawCanvasPaddles() {
      var paddle = null;
      for(var i=0; i<paddles.length; i++) {
        paddle = paddles[i];
        ctx.fillStyle = paddle.c;
        ctx.fillRect( paddle.x, paddle.y, paddle.w, paddle.h );
        //console.log('Paddle:  x: ' + paddle.x + ', y: ' + paddle.y + ', w: ' + paddle.w + ', h: ' + paddle.h );
      }
    }

    function drawPoints() {
      ctx.beginPath();
      ctx.fillStyle = 'grey';
      ctx.font = '60px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(POINTS, windowW/2, windowH/2);
    }

    // EVENT LISTENERS

    function trackAndUpdate(e) {
      var mouseX = e.pageX;
      var mouseY = e.pageY;

      if( mouseX && mouseY ) {
        var paddle = null;
        for( var i = 0; i < paddles.length; i++ ) {
          paddle = paddles[i];
          paddle.x = mouseX - paddle.w/2;
        }
      }
    }

    function trackKeyAndUpdate(e) {
      var key = e.keyCode;
      var keyDownTimer = null;

      // left = 37
      // right = 39
      if( keyPressed < 10 ) {
        if( key === 37 ) {
          var keyDownTimer = setInterval( function() {
            for( var i = 0; i < paddles.length; i++ ) {
              paddle = paddles[i];
              if( paddle.x >= 10 ) {
                paddle.x = paddle.x - 10;
              }
            }
          }, 1000/60 );
          keyPressed++;
        } else if( key === 39 ) {
          var keyDownTimer = setInterval( function() {
            for( var i = 0; i < paddles.length; i++ ) {
              paddle = paddles[i];
              if( paddle.x+paddle.w <= windowW-10 ) {
                paddle.x = paddle.x + 10;
              }
            }
          }, 1000/60 );
          keyPressed++;
        }
        document.addEventListener('keyup', function() { clearInterval( keyDownTimer ); keyPressed=0; } , false);
      }
    }

    // GAME OBJECT INTERACTION FUNCTIONS

    function checkCollisions() {
      var paddle1 = paddles[0];
      var paddle2 = paddles[1];
      paddle1.hit = false;
      paddle2.hit = false;

      if( collidesWithPaddle( Ball, paddles ) == false ) {
        collidesWithWall( Ball );
      }
    }

    function collidesWithWall( b ) {
      // horizontal walls
      if( b.y + b.rad > windowH ) {
        gameOver();
      } else if( b.y < 0 ) {
        gameOver();
      }

      // vertical walls
      if( b.x + b.rad > windowW ) {
        b.xVs = -b.xVs;
        b.x = windowW - b.rad;
      } else if( b.x - b.rad < 0 ) {
        b.xVs = -b.xVs;
        b.x = b.rad;
      }
    }

    function collidesWithPaddle(b, p) {
      var hit = false;
      for( var i=0; i<paddles.length; i++ ) {
        var p = paddles[i];
        if( b.x + b.rad >= p.x && b.x - b.rad <= p.x + p.w ) {
          if( b.y >= (p.y - p.h) && p.y > 0 ) {
            p.hit = true; // bottom paddle
            hit = true;
          } else if ( b.y - b.rad <= p.h && p.y == 0 ) {
            p.hit = true; // top paddle
            hit = true;
          }
        }
      }
      if( hit ) {
        b.yVs = -b.yVs;
        POINTS++;
        increaseSpeed();

        if( collisionSound ) {
          collisionSound.currentTime = 0;
          collisionSound.play();
        }
        return true;
      } else {
        return false;
      }
    }

    function increaseSpeed() {
      if( POINTS % 5 == 0 ) {
        if( Math.abs( Ball.xVs ) < 15 ) {
          Ball.xVs += (Ball.xVs < 0) ? -1 : 1;
          Ball.yVs += (Ball.yVs < 0) ? -2 : 2;
        }
      }
    }

    function gameOver() {
      mainNavElem.style.display = 'block';
      GAME_STATE = 'STOP';
      canvas.style.cursor = 'auto';
      restartBtn.draw();
      cancelRequestFrame( initGameAnimation );
    }

    function resetGame() {
      mainNavElem.style.background = '#' + ( getLocalStorageValByKey( 'top_header_color_pick' ) === null ? '000000' : getLocalStorageValByKey( 'top_header_color_pick' ) );
      mainNavElem.style.display = 'block';
      GAME_STATE = 'STOP';
      Ball.reset();
      paddles[0].reset();
      paddles[1].reset();
      POINTS = 0;
      beginBtn.draw();
    }

    function beginGame() {
      mainNavElem.style.display = 'none';
      GAME_STATE = 'STOP';
      Ball.reset();
      paddles[0].reset();
      paddles[1].reset();
      POINTS = 0;
      canvas.style.cursor = 'none';
      drawGameCanvasFrame(); // start the game drawing
      canvas.removeEventListener('click', beginBtn.clickButton, false );
    }

    function resizeCanvas(e) {
      mainNavElem.style.display = 'block';
      GAME_STATE = 'STOP';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      windowW = window.innerWidth;
      windowH = window.innerHeight;
      Ball.reset();
      paddles[0].reset();
      paddles[1].reset();
      cancelRequestFrame( initGameAnimation );
      beginBtn.draw();
    }
  }
}
