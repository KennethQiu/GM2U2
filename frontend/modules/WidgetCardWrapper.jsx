import React, { Component, PropTypes } from 'react';
import TimeWidget from './widgets/TimeWidget.jsx';
import TrafficWidget from './widgets/TrafficWidget.jsx';
import WeatherWidget from './widgets/WeatherWidget.jsx';
import NewsWidget from './widgets/NewsWidget.jsx';
import QuotesWidget from './widgets/QuotesWidget.jsx';
import WidgetCardToolbar from './widgets/WidgetCardToolbar.jsx'


// dnd

import { DropTarget, DragSource } from 'react-dnd';

//material-ui
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward';
import DragHandle from 'material-ui/svg-icons/editor/drag-handle';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui/svg-icons/action/settings';
import { ItemTypes, WidgetTypes, WidgetIconImage, WidgetIconImageX96 } from './Constants.js';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

const widgetCardWrapperTarget = {
  canDrop(props, monitor) {
    console.log("dragging object is", monitor.getItem());
    return true;
  },
  drop(props, monitor) {
    console.log("droping here, props is", props);
    // dropping icon, then add widget
    const widgetType = monitor.getItem().widgetType;
    widgetType && props.onDropWidgetIcon(widgetType, props.position);
    // dropping widget, then move widget
    var old_index = monitor.getItem().old_index;
    if(old_index < props.position){
      var new_index = props.position-1;

    }else{
      var new_index = props.position;
    }
    console.log('old_index', old_index);
    console.log('new_index', new_index);
    Number.isInteger(old_index) && Number.isInteger(old_index) && props.onMove(old_index, new_index);
    props.expandAll();
  }
};

const widgetCardSource = {
  beginDrag(props, monitor){
    console.log('beginDrag, props are', props);
    console.log('beginDrag, monitor item is', monitor.getItem());
    props.collapseAll();
    return {old_index: props.position}
  },
  endDrag(props, monitor){
    console.log('endDrag props:', props);
  }
};


//material-ui for button
const styles = {
    collapisibleHead:{
      // lineHeight: '0rem',
      // padding: '0 0rem',
      minHeight: '0rem'
    },
    show:{
      position: 'relative',
      width: '100%',
      height: '100%'
    },
    hide:{
      display: 'none'
    }
  };

class WidgetCardWrapper extends Component {
  constructor(props){
    super(props);
    this.state={
      WidgetIconImage: WidgetIconImage,
      WidgetIconImageX96: WidgetIconImageX96,
    }
  }

  toggleSettingExpanded(){
    this.refs.widget.toggleSettingExpanded();
  };

  renderGreyBox(){
    // $('.greyBox').addClass("show");
    $(this.refs.greyBox).addClass("show");
  }

  hideGreyBox(){
    // $('.greyBox').removeClass("show");
    console.log("this refs greybox", this.refs.greyBox);
    $(this.refs.greyBox).removeClass("show");
  }

  handleMoveUp(){
    if(this.props.position !== 0){
    this.props.onMove(this.props.position, this.props.position-1);
    }
  }

  handleMoveDown(){
    this.props.onMove(this.props.position, this.props.position+1);
  }

  componentDidMount() {
    const img = new Image();
    console.log('component did mount, widget type is ', this.props.widget.widgetType)
    console.log('component did mount, widget image is ', img)
    img.src = this.state.WidgetIconImageX96[this.props.widget.widgetType];
    img.onload = () => {
      this.props.connectDragPreview(img)
    };

    //Initiate collapsible
    $(".collapsible").collapsible({accordion: false});
    // $('.collapsible').collapsible({
    //   accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    // });
  }

  renderSettingButton(){
    return (
      <IconButton  
        onTouchTap={this.toggleSettingExpanded.bind(this)} 
        tooltip="Setting" 
        touch={true} 
        tooltipPosition="top-center"
      >
        <Settings color='grey900'/>
      </IconButton>
    )
  }

  toggleCollapsible(){

    var $collapsible = $(`.collapsible-${this.props.widget.id}`);
    var $header = $(`.collapsible-header-${this.props.widget.id}`);
    var isActive = $header.hasClass("active");
    if(isActive){
      $header.removeClass("active");
      $collapsible.collapsible({accordion: true});
      $collapsible.collapsible({accordion: false});
    }else{
      $header.addClass("active");
      $collapsible.collapsible({accordion: false});
    }
  }
  render() {

    const { connectDropTarget, connectDragPreview, connectDragSource, isOver, canDrop, isDragging } = this.props;
    
    var showOrHide={};
    if (isDragging) {
      showOrHide = styles.hide;
    }else{
      showOrHide = styles.show;
    }

    return connectDropTarget(
      <div style={showOrHide} id={this.props.widget.id} className="widgetCardWrapper">        
        {/* Drop target grey box*/}
        {isOver && canDrop && this.renderGreyBox()}
        {!isOver && this.hideGreyBox()}
        <div className="greyBox" ref="greyBox"></div>
        {/* Widget wrapped in a div */}
        {this.props.widget.widgetType && 
          
          <div style={{
            position: 'relative',
            width: '100%'
            }}
          >
          <ul className={`collapsible collapsible-${this.props.widget.id}`} data-collapsible="expandable">
            <li>
              <div>
                <WidgetCardToolbar 
                  widget={this.props.widget}
                  onWidgetChange={this.props.onWidgetChange} 
                  ref='toolbar'
                >
                {connectDragSource(
                  <div>
                    <IconButton tooltip="Drag" touch={true} tooltipPosition="top-center">
                      <DragHandle className="dragHandle"/>
                    </IconButton>
                  </div>
                  )}
                <IconButton onTouchTap={this.toggleCollapsible.bind(this)}>
                  <NavigationExpandMoreIcon />
                </IconButton>
                {this.renderSettingButton()}
                </WidgetCardToolbar>
              </div>

              <div className={`collapsible-header active collapsible-header-${this.props.widget.id} active`} style={styles.collapisibleHead}>
              </div>
                {( ()=>{switch(this.props.widget.widgetType){
                  case WidgetTypes.time:
                    return (
                      <div className="collapsible-body">
                        <TimeWidget 
                          widget={this.props.widget} 
                          onWidgetChange={this.props.onWidgetChange}
                          ref = 'widget'
                        />
                      </div>
                    )
                  break
                  case WidgetTypes.weather:
                    return (
                      <div className="collapsible-body">
                        <WeatherWidget 
                          widget={this.props.widget} 
                          onWidgetChange={this.props.onWidgetChange}
                          ref = 'widget'
                        />
                      </div>
                    )
                  break
                  case WidgetTypes.traffic:
                    return (
                      <div className="collapsible-body">
                        <TrafficWidget 
                          widget={this.props.widget} 
                          onWidgetChange={this.props.onWidgetChange}
                          ref = 'widget'
                        />
                      </div>
                    )
                  break
                  case WidgetTypes.news:
                    return (
                      <div className="collapsible-body">
                        <NewsWidget 
                          widget={this.props.widget} 
                          onWidgetChange={this.props.onWidgetChange}
                          ref = 'widget'
                        />
                      </div>
                    )
                  break
                  case WidgetTypes.quotes:
                    return (
                      <div className="collapsible-body">
                        <QuotesWidget 
                          widget={this.props.widget} 
                          onWidgetChange={this.props.onWidgetChange}
                          ref = 'widget'
                        />
                      </div>
                    )
                  break
                  default:
                    return <div style={{minHeight:"150px", width:"100%"}}></div> 
                  break
                }})()}
            </li>
          </ul>
          </div>
          
        }
        {!this.props.widget.widgetType && 
          <div style={{minHeight:"100px", width:"100%"}}></div>
        }

      </div>
    ); 
  }
}

WidgetCardWrapper.propTypes = {
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default DropTarget(ItemTypes.WIDGETICON, widgetCardWrapperTarget, (connect, monitor)=>({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
  (DragSource(ItemTypes.WIDGETICON, widgetCardSource, (connect, monitor)=>({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }))
    (WidgetCardWrapper)
);