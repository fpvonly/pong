/*
	Author: Ari Petäjäjärvi
	2016
*/

// helper function for accessing local storage data
var getLocalStorageValByKey = function( key ) 
{
	if( typeof( Storage ) !== "undefined" ) 
	{
		return localStorage.getItem(key);
	}
	else
	{
		return null;
	}
}

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


var MainMenuBtn = React.createClass({
	getInitialState: function() {
		return null;
	},
	render: function() {
		return <div className="main_menu_btn" onClick={this.props.clickObj}>{this.props.text}</div>
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

		// hack for IEs redrawing bug in the main menu
		document.getElementById('fixed_wrapper').style.opacity='0.99';
		setTimeout( function(){ document.getElementById('fixed_wrapper').style.opacity='1'; }, 300 );	
	},
	getInfoPanelContent: function() {
		var c = 'This is a simple ping-pong game created using HTML5\'s Canvas element\n and plain Javascript. ';
		c += 'The main UI is created using React. ';
		c += 'Behind all this is running a Node.js server using Express framework. ';
		c += 'All animations are CSS3 animations exluding the game animations which are made in plain Javascript. ';
		c += 'Settings are stored in local storage. \n\n';
		c += 'NOTE: This game is made for modern desktop browsers that support Javascript and Canvas APIs properly. ';
		c += 'It is tested lightly on IE10, IE11, Edge, Chrome and Firefox desktop browsers (may contain some bugs ;) ';

		return c;
	},
	getLeaderboardPanelContent: function() {
		return 'Under development.';
	},
	getMultiplayerPanelContent: function() {
		return 'Under development. ETA:TBA';
	},
	getSettingsPanelContent: function() {
		return <div>
			<ColorPicker id="top_paddle_color_pick" label="Top paddle color:" />
			<ColorPicker id="bottom_paddle_color_pick" label="Bottom paddle color:" /> 
			<ColorPicker id="ball_color_pick" label="Ball color:"/>	
			<ColorPicker id="top_header_color_pick" label="Main menu header color:" /> 
			<ColorPicker id="bg_color_pick" label="Game Background color:" />			
		</div>;
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
		// hack for IEs redrawing bug
		document.getElementById('fixed_wrapper').style.opacity='0.99';
		setTimeout( function(){ document.getElementById('fixed_wrapper').style.opacity='1'; }, 300 );
		
	},
	render: function() {
		return <div id="sub_menu" className={ (this.state.open) ? 'active' : '' } ref="sub_menu_div">			
			<div className="sub_menu_btn" onClick={this.closeSubMenu}>Close</div>
			<h1>{this.state.menuTitle}</h1>
			<div className="sub_menu_content_panel">{this.state.content}</div>
		</div>
	}
});


var ColorPicker = React.createClass({
	saveSettingsAndUpdateGameVisuals: function( color ) {
		if( typeof( Storage ) !== "undefined" ) {
			var dom_object = this.refs.picker;
    		localStorage.setItem(dom_object.id, color);
    		window.dispatchEvent(window.RESET_GAME_EVENT);
		} else {
		    alert('No localstorage support! Update the browser.');
		}	
	},
	componentDidMount: function() {
		var colors_object = {
			'top_paddle_color_pick':'000000',
			'bottom_paddle_color_pick':'000000',
			'ball_color_pick':'000000',
			'top_header_color_pick':'000000',
			'bg_color_pick':'ffffff'
		};
		var reactContext = this;
		var input = this.refs.picker;	
		var color = ( getLocalStorageValByKey( input.id ) === null ? colors_object[ input.id ] : getLocalStorageValByKey( input.id ) );
		var picker = new jscolor( input, { value:color, onFineChange:function(){ reactContext.saveSettingsAndUpdateGameVisuals( this ); } } );
        //picker.fromHSV(360 / 100 * i, 100, 100);
 	},
 	render: function() { 		
		return <div className="color_picker_row">
			<div className="color_picker_label">{this.props.label}</div>
			<input id={this.props.id} ref="picker" className="jscolor" />
			</div>
	}
});



ReactDOM.render(<MenuBar />, document.getElementById('game_nav_header') );
