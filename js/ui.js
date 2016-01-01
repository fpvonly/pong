// init the canvas game logic
var pingPongGame = new Pong({wrapper_id : 'game_wrapper'});

// the wrapping Reactjs menu UI -->
var MenuBar = React.createClass({
	getInitialState: function() {
		return { menuStateClass:'inactive' };
	},
	handleMenuBtnClick: function(e){
		var menuState = document.getElementById('fixed_wrapper').style.display;
		if( menuState == 'block' )
		{
			document.getElementById('fixed_wrapper').style.display = "none";
		}
		else
		{
			document.getElementById('fixed_wrapper').style.display = "block";
		}
		ReactDOM.render( <MainMenu />, document.getElementById('main_menu_wrapper') );
	},
	render: function() {
		return <nav id="navigation" className={this.state.menuStateClass}><div><a href="javascript:void(0);" onClick={this.handleMenuBtnClick}>Menu</a></div></nav>;
	}
});

var MainMenu = React.createClass({
	getInitialState: function() {
		return null;
	},
	initGame: function(e) {
		// init the canvas game logic		
		window.dispatchEvent(window.RESET_GAME_EVENT);
		document.getElementById('fixed_wrapper').style.display = "none";
	},
	closeMenu: function(e) {
		document.getElementById('fixed_wrapper').style.display = "none";
	},
	render: function(){
		return <div id="main_menu">
			<MainMenuBtn clickObj={this.initGame} text="New Game (solo)" />
			<MainMenuBtn text="Multiplayer Game" />
			<MainMenuBtn text="Settings" />
			<MainMenuBtn text="Info" />
			<MainMenuBtn clickObj={this.closeMenu} text="Close" />
		</div>;
	}
});

var MainMenuBtn = React.createClass({
	getInitialState: function() {
		return null;
	},
	render: function() {
		return <div className="main_menu_btn" onClick={this.props.clickObj}>{this.props.text}</div>
	}
});

ReactDOM.render(<MenuBar />, document.getElementById('game_nav_header') );
