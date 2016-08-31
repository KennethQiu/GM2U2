$(function(){
  //Search bar listener
  $("#search-bar").on("keyup",function(){
    event.preventDefault();
    var $this = $(this);
    var keyword = $this.val();
    searchCity(keyword, listCities);
  });

  //Autocomplete on WU API
  function searchCity(keyword, callback){
    $(".search").append(template_loader_icon);
    $.ajax({
      url: "http://autocomplete.wunderground.com/aq",
      method: "get",
      data: {query: keyword},
      dataType: "jsonp",
      jsonp: "cb",
      success: function(cities){
        $(".search").find("#loader").remove();
        callback(cities.RESULTS);
      }
    });
  }

  //Initialize templates
  var cities = $("#template_cities").html();
  var city = $("#template_city").html();
  var template_cities = Handlebars.compile(cities);
  var template_city = Handlebars.compile(city);
  var loader_icon = $("#loader_icon_template").html();
  var template_loader_icon = Handlebars.compile(loader_icon);

  //List cities on screen
  function listCities(cities){
    $(".cities").remove();
    var $cities = $(template_cities());
    cities.forEach(function(city){
      var $city = $(template_city({city_name: city.name, query: city.l}));
      $cities.append($city);
    });
    $(".search").append($cities);
  }

  //Listenner to click on each city
  $("body").on("click", ".city > a", function(){
    event.preventDefault();
    $this = $(this);
    var query = $this.data("query");

    //loader 
    $(".city_info_wrapper").html(template_loader_icon);

    $.ajax({
      url: "/weather/city",
      method: "get",
      data: {query: query},
      dataType: "json",
      success: function(city){
        // console.log(city);
        showDetail(city);
        readWeather(city);
      }
    });
  });

    //Initialize templates
  var city_info = $("#template_city_info").html();
  var template_city_info = Handlebars.compile(city_info);
  var city_forecast = $("#template_forecast_day").html();
  var template_city_forecast = Handlebars.compile(city_forecast);

  //show city weather detail
  function showDetail(city){
    var forecast = "";
    for(i=0;i<4;i++){
      var text = city.forecast.txt_forecast.forecastday[i];
      var simple = city.forecast.simpleforecast.forecastday[i];
      var day = {
        title: text.title,
        icon_url: text.icon_url,
        fcttext_metric: text.fcttext_metric,
        low: simple.low.celsius,
        high: simple.high.celsius
      }
      var dayDiv = template_city_forecast(day);
      forecast += dayDiv;
    }

    var current = city.current_observation;
    var info = {
        name: current.display_location.full,
        icon_url: current.icon_url,
        weather: current.weather,
        temp_c: current.temp_c,
    };
    var $city_info = template_city_info(info);
    $(".city_info_wrapper").html("");
    $(".city_info_wrapper").append($city_info);
    $(".city_info_wrapper .city_info").append(forecast);
  }

  function readWeather(city){
    var current = city.current_observation
    var info = {
        name: current.display_location.full,
        icon_url: current.icon_url,
        weather: current.weather,
        temp_c: current.temp_c,
    };
    speak("City is " + info.name);
    speak("Current weather is" + info.weather);
    speak("Temperature is " + info.temp_c + "degree");
    // speak(speech("Ken is awesome."))
  }

});

  

  