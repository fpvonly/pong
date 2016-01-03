// init the canvas game logic
var pingPongGame = new Pong({wrapper_id : 'game_wrapper'});

// the wrapping Reactjs menu UI -->
var mainMenuInstance = null;
var MenuBar = React.createClass({
	getInitialState: function() {
		return { open:false };
	},
	handleMenuBtnClick: function(e) {
		var menuState = document.getElementById('fixed_wrapper').style.display;

		mainMenuInstance = ReactDOM.render( <MainMenu MenuBarBtnObj={this} />, document.getElementById('main_menu_wrapper') );
		if( menuState == 'block' )
		{
			document.getElementById('fixed_wrapper').style.display = "none";
			this.setState({open:false});
			mainMenuInstance.setState({open:false});
			mainMenuInstance.refs.sub_menu.setState({open:false});
		}
		else
		{
			document.getElementById('fixed_wrapper').style.display = "block";
			this.setState({open:true});
			mainMenuInstance.setState({open:true});
			mainMenuInstance.refs.sub_menu.setState({open:false});
		}
		
	},
	render: function() {
		return <nav id="navigation"><div><a ref="main_menu_btn" className={ (this.state.open) ? 'active' : '' } href="javascript:void(0);" onClick={this.handleMenuBtnClick}>Menu</a></div></nav>;
	}
});

var MainMenu = React.createClass({
	getInitialState: function() {
		return {open:false};
	},
	initGame: function(e) {
		// init the canvas game logic		
		window.dispatchEvent(window.RESET_GAME_EVENT);
		document.getElementById('fixed_wrapper').style.display = "none";
		this.props.MenuBarBtnObj.setState({open:false});
		this.setState({open:false});
		this.refs.sub_menu.setState({open:false});
	},
	closeMenu: function() {
		document.getElementById('fixed_wrapper').style.display = "none";
		this.props.MenuBarBtnObj.setState({open:false});
		this.setState({open:false});
		this.refs.sub_menu.setState({open:false});
	},
	showSubMenu: function() {
		this.refs.sub_menu.setState({open:true});
	},
	render: function() {
		return <div id="main_menu" className={ (this.state.open) ? 'active' : '' }>
			<MainMenuBtn clickObj={this.initGame} text={"New Game (solo)"} />
			<MainMenuBtn clickObj={this.showSubMenu} text="Multiplayer Game" />
			<MainMenuBtn clickObj={this.showSubMenu} text="Settings" />
			<MainMenuBtn clickObj={this.showSubMenu} text="Info" />
			<MainMenuBtn clickObj={this.closeMenu} text="Close" />
			
			<SubMenu ref="sub_menu" />
			
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

var SubMenu = React.createClass({
	getInitialState: function() {
		return {open:false};
	},
	closeSubMenu: function() {
		this.setState({open:false});
	},
	render: function() {
		return <div id="sub_menu" className={ (this.state.open) ? 'active' : '' } ref="sub_menu_div">
			<h1>{this.props.text}</h1>
			<div className="sub_menu_btn" onClick={this.closeSubMenu}>Close</div>
		</div>
	}
});



ReactDOM.render(<MenuBar />, document.getElementById('game_nav_header') );
