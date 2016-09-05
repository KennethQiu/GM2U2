import React, {Component} from 'react';
import Navbar from "./navbar.jsx";
import SidebarLeft from "./sidebar_left.jsx";
import SidebarRight from "./sidebar_right.jsx";
import ActivePlaylist from './active_playlist.jsx';
import Footer from './footer.jsx';

//Drag and drop
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

//material
import RaisedButton from 'material-ui/RaisedButton';

//For raise button
const style = {
  margin: 12,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uiState: { sidebarLeftOpen: false, sidebarRightOpen: false },
      username: window.localStorage.username,
      playlists: [],
      activePlaylist: null
    }
  }

  getChildContext() {
    return {username: this.state.username};
  }

  toggleSidebarLeft() {
    this.setState({
      uiState: {
        sidebarLeftOpen: !this.state.uiState.sidebarLeftOpen
      }
    })
  }

  toggleSidebarRight() {
    this.setState({
      uiState: {
        sidebarRightOpen: !this.state.uiState.sidebarRightOpen
        // sidebarLeftOpen: false,
      }
    })
  }

  loggedIn(username){
    this.setState({
      username: username
    })
  }

  addPlaylist(){
    console.log("Adding App playlists");
    $.ajax({
        url: "http://localhost:3000/api/playlists",
        method: "post",
        headers: {
        'Authorization':  "Bearer " + window.localStorage.token
        }
      })
      .then(function(playlist) {
        console.log("New Playlist is", playlist);
        this.updatePlaylist();
      }.bind(this));
  }

  updatePlaylist(){
    console.log("Updating App playlists");
    $.ajax({
        url: "http://localhost:3000/api/playlists",
        method: "get",
        headers: {
        'Authorization':  "Bearer " + window.localStorage.token
        }
      })
      .then(function(playlists) {
        console.log("Playlists is", playlists);
        this.setState({playlists: playlists});
        //set default active playlist
        if( !this.state.activePlaylist && this.state.playlists.length > 0 ){
          this.setState({activePlaylist: this.state.playlists[0]})
        }
        this.selectPlaylist(this.state.activePlaylist.id);
      }.bind(this));
  }

  deletePlaylist(id){
    console.log("Updating App playlists");
    $.ajax({
        url: `http://localhost:3000/api/playlists/${id}`,
        method: "delete",
        headers: {
        'Authorization':  "Bearer " + window.localStorage.token
        }
      })
      .then(function(message) {
        console.log("Delete playlist message is", message);
        this.updatePlaylist();
      }.bind(this));
  }

  selectPlaylist(id){
    console.log("select playlist");
    this.state.playlists.forEach(function(playlist){
      if(playlist.id === id){
        this.setState({activePlaylist: playlist})
      }
    }.bind(this));
  }
  componentDidMount() {
    console.log('App mounted');
    
    if(this.state.username){
      console.log("Getting all playlists to App component");
      this.updatePlaylist();
    }
  };

  render() {
    return (
      <div>
        {/* Navbar */}                
        <Navbar 
          toggleSidebarLeft={this.toggleSidebarLeft.bind(this)} 
          toggleSidebarRight={this.toggleSidebarRight.bind(this)} 
          loggedIn={this.loggedIn.bind(this)}
        />
        <div className="row">
          {/* sidebar left - widgets */}
          <SidebarLeft 
            open={this.state.uiState.sidebarLeftOpen} 
            toggleSidebarLeft={this.toggleSidebarLeft.bind(this)}
          />

          {/*If Playlists is falsy*/}
          {this.state.playlists.length === 0 &&
            <div className = 'col s12 m10 offset-m1 l8 offset-l2'>
              <RaisedButton 
                onClick={this.addPlaylist.bind(this)} 
                label="Add playlist" 
                primary={true} 
                style={style} />
            </div>
          }

          {/*If Playlist is []*/}
          {this.state.playlists && this.state.playlists.length === 0 &&
            <div className = 'col s12 m10 offset-m1 l8 offset-l2'>
              <RaisedButton 
                onClick={this.addPlaylist.bind(this)} 
                label="Add playlist" primary={true} 
                style={style} />
            </div>
          }

          {/* sidebar right - playlists */}
          {this.state.playlists && this.state.playlists.length > 0 && 
          <SidebarRight 
            onAddPlaylist={this.addPlaylist.bind(this)} 
            onDeletePlaylist={this.deletePlaylist.bind(this)} 
            toggleSidebarRight={this.toggleSidebarRight.bind(this)} 
            open={this.state.uiState.sidebarRightOpen} 
            playlists={this.state.playlists}
            onSelectPlaylist={this.selectPlaylist.bind(this)}
          />
          }

          {/* centered content - active playlist */}

          {this.state.activePlaylist && 
            <ActivePlaylist 
              playlist={this.state.activePlaylist} 
              id={this.state.activePlaylist.id} 
              onPlaylistChange={this.updatePlaylist.bind(this)} 
            />
          }          
          
        </div>
        {/* Footer */}
        <Footer/>
      </div>
    );
  }
}

App.childContextTypes = {
  username: React.PropTypes.string
};
export default DragDropContext(HTML5Backend)(App);
