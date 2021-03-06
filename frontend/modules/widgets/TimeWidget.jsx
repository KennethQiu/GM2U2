import React, {Component} from 'react';
import {handleDeleteWidget} from './widgetLibrary.js';
import { WidgetTypes, WidgetIconImage, ClockFace } from '../Constants';
//material-ui
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import WidgetCardToolbar from './WidgetCardToolbar.jsx'

//utils
import newId from '../utils/newid.js'
//moment
var moment = require('moment');

const styles = {
  date:{
    color: '#333',
    fontSize: '2.5em' 
  },
  radioButton: {
    marginBottom: 16,
  },
  clockWrapper:{
    maxWidth: '500px',
    margin:'auto'
  }
};

class TimeWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      clockId: 'clock',
    };
  }

  toggleSettingExpanded(){
    this.setState({expanded: !this.state.expanded});
  };

  componentWillMount(){
    var clockId = newId();
    this.clockId = clockId;
  }

  componentDidMount() {
     var clock =$(`#${this.clockId}`).FlipClock({
        clockFace: ClockFace.TwentyFourHourClock
    });
  };

  updateClockFace(event, clockFace){
    console.log("tragging event", event);
    console.log("tragging clock", clockFace);
   var clock =$(`#${this.clockId}`).FlipClock({
        clockFace: clockFace
    });
  }



   render() {
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>

    //Setting
    <CardText expandable={true}>
      <RadioButtonGroup onChange={this.updateClockFace.bind(this)} name="clockhour" defaultSelected={ClockFace.TwentyFourHourClock}>
        <RadioButton
          value={ClockFace.TwentyFourHourClock}
          label="24h"
          style={styles.radioButton}
        />
        <RadioButton
          value={ClockFace.TwelveHourClock}
          label="12h"
          style={styles.radioButton}
        />
      </RadioButtonGroup>
    </CardText>

    //Main Content
    <CardText>
      <div className="col s12 center-align" style={styles.date}>
        {moment().format('dddd MMMM Do')}
      </div>
        <div className="row" style={styles.clock}>
          <div className="clockWrapper" style={styles.clockWrapper}>
            <div id={this.clockId}></div>
          </div>
        </div>
    </CardText>
      </Card>
    );
  }
}
export default TimeWidget;
