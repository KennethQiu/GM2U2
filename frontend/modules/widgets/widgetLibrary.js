  
//////////////////////////////
//AJAX CALL!!!!!Delete widget 
//////////////////////////////
export function handleDeleteWidget(){
    
  $.ajax({
      url: `${process.env.host}/api/widgets/${this.props.widget.widgetType}/${this.props.widget.id}`,
      method: "delete",
      headers: {
      'Authorization':  "Bearer " + window.localStorage.token
      }
    })
    .then(function(message) {
      console.log("message is", message);
      this.props.onWidgetChange();
    }.bind(this));
  }

  //////////////////////////////
  //AJAX CALL!!!!!update widget 
  //////////////////////////////
export function uploadSetting(){
    console.log("uploading setting");
    return $.ajax({
      url: `${process.env.host}/api/widgets/${this.props.widget.widgetType}/${this.props.widget.id}`,
      method: "put",
      data: {widget: JSON.stringify(this.state.widgetLocalCopy)},
      headers: {
      'Authorization':  "Bearer " + window.localStorage.token
      }
    }).done(function(playlist){
      console.log("updated playlist is", playlist);
        this.props.onWidgetChange();
    }.bind(this))
    .fail(function(err){
      console.log("request failed", err);
    });
  }