/*
	Author: Ari Petäjäjärvi
	copyright 2016
*/

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
			setTimeout(refresh.bind(this), 20);
			function refresh() {
				this.setState({open:true});
				mainMenuInstance.setState({open:true});
				mainMenuInstance.refs.sub_menu.setState({open:false});
			}
		}
		
	},
	render: function() {
		return <nav id="navigation"><div><a ref="main_menu_btn" className={ (this.state.open) ? 'active' : '' } href="javascript:void(0);" onClick={this.handleMenuBtnClick}>&#9776; Menu</a></div></nav>;
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
	showSubMenu: function( title ) {
		switch( title ) {
			case 'Info':
				var c = this.getInfoPanelContent();
			break;

			case 'Leaderboard':
				var c = this.getLeaderboardPanelContent();
			break;

			case 'Settings':
				var c = this.getSettingsPanelContent();
			break;

			case 'Multiplayer Game':
				var c = this.getMultiplayerPanelContent();
			break;
		}	

		this.refs.sub_menu.setState({open:true, menuTitle:title, content:c});		
	},
	getInfoPanelContent: function() {
		var c = 'This is a simple ping-pong game created using HTML5\'s Canvas element\n and plain Javascript. ';
		c += 'The main UI is created using React. ';
		c += 'Behind all this is running a Node.js server using Express framework. ';
		c += 'All animations are CSS3 animations exluding the game animations which are made in plain Javascript.\n\n';
		c += 'In future updates the following features are to be added: settings panel (localstorage saving), scoreboard (database saving) and multiplayer mode. \n\n';
		c += 'NOTE: This game is made for modern desktop browsers that support Javascript and Canvas APIs properly. ';
		return c;
	},
	getLeaderboardPanelContent: function() {
		return 'Under development';
	},
	getMultiplayerPanelContent: function() {
		return 'Under development';
	},
	getSettingsPanelContent: function() {
		return 'Under development';
	},
	render: function() {
		return <div id="main_menu" className={ (this.state.open) ? 'active' : '' }>
			<MainMenuBtn clickObj={this.initGame} text={"New Game (solo)"} />
			<MainMenuBtn clickObj={this.showSubMenu.bind(this, 'Multiplayer Game')} text="Multiplayer Game" />
			<MainMenuBtn clickObj={this.showSubMenu.bind(this, 'Leaderboard')} text="Leaderboard" />
			<MainMenuBtn clickObj={this.showSubMenu.bind(this, 'Settings')} text="Settings" />
			<MainMenuBtn clickObj={this.showSubMenu.bind(this, 'Info')} text="Info" />
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
		return {
			open:false,
			menuTitle:'',
			content:''
		};
	},
	closeSubMenu: function() {
		this.setState({open:false});
	},
	render: function() {
		return <div id="sub_menu" className={ (this.state.open) ? 'active' : '' } ref="sub_menu_div">			
			<div className="sub_menu_btn" onClick={this.closeSubMenu}>Close</div>
			<h1>{this.state.menuTitle}</h1>
			<div className="sub_menu_content_panel">{this.state.content}</div>
		</div>
	}
});



ReactDOM.render(<MenuBar />, document.getElementById('game_nav_header') );
