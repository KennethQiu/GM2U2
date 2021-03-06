import React, {Component} from 'react';

import Login from './Login.jsx';

const styles={
  navbar:{
    backgroundColor: '#575755'
  }
}
var handleSignout;

class Navbar extends Component {

  handleLogOut(e){
    e.preventDefault();
    window.localStorage.clear();
    this.props.loggedOut();
    $.getScript('https://apis.google.com/js/platform.js')
      .done(()=>{
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
      });
   
  
  };

  componentDidMount(){
    $.getScript('https://apis.google.com/js/platform.js')
    .done(()=>{
      gapi.load('auth2', function() {
              gapi.auth2.init();
      });
    })
  }

  render() {
    return (      
      <div className='navbar-fixed' >
        <nav style={styles.navbar}>
          {/* logo centered */}
          <a href="#" className="brand-logo center"> G&apos;Morning!</a>   
          {this.context.username &&
            <div>
              {/*  align-left items*/} 
              <ul className="left hide-on-small-only"> {/* on regular screens */}
                <li><a href="#" onClick={this.props.toggleSidebarLeft}><i className="material-icons left">library_add</i>Widgets</a></li>      
              </ul>
              <ul className="left hide-on-med-and-up"> {/* on mobile screens */}
                <li><a href="#" onClick={this.props.toggleSidebarLeft}><i className="material-icons">library_add</i></a></li>                         
              </ul>
              {/*  align-right items*/} 
              <ul className="right hide-on-small-only"> {/* on regular screens */}
                <li><a href="#"><i className="material-icons left">person_pin</i>{this.context.username}</a></li>
                <li><a href="#" onClick={this.props.toggleSidebarRight} className='button_slider_playlists'><i className="material-icons left">video_library</i>Playlists</a></li>
                <li><a href="#" onClick={this.handleLogOut.bind(this)}>Logout</a></li>
              </ul>
              <ul className="right hide-on-med-and-up"> {/* on mobile screens */}
                <li><a href="#"><i className="material-icons">person_pin</i></a></li>      
                <li><a href="#" onClick={this.props.toggleSidebarRight} className='button_slider_playlists'><i className="material-icons">video_library</i></a></li>      
                <li><a href="#" onClick={this.handleLogOut.bind(this)}>Logout</a></li>
              </ul>
            </div>
          }
        </nav>
      </div>
    );
  }

}
Navbar.contextTypes = {
  username: React.PropTypes.string
};
export default Navbar;
