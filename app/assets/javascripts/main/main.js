$(document).ready(function(){
  $(window).on("user_loggedin",function(){
    var login_button = $(".home-container .controls-container .login-button");
    var search_controls = $(".home-container .controls-container .search");
    login_button.removeClass("visible").addClass("hide");
    search_controls.removeClass("hide").addClass("visible");
  });
      $(".home-container .controls-container .login-button input").on("click", function(){
      window.fblogin();
    });

  var animateHomeBG = function(){
    var visibleImg = $(".home-container .home-images.visible");
    var nextImg = visibleImg.next();
    visibleImg.fadeOut("slow", function(){
      $(this).removeClass("visible");
      $(this).addClass("hide");
    });
    nextImg.css("opacity",0);
    nextImg.removeClass("hide");
    nextImg.addClass("visible");
    nextImg.fadeIn("slow", function(){

    });
  };
  //var t = setInterval(animateHomeBG, 10000);
  list = new cityList({
    elementSelector: ".city-input" 
  });
  window.x = new fbData({});
  $(".go").click(function(e){
    showMapPage();
    y.config.address = list.selectedCity();
    $(".map-page-container .name-container .city").text(list.selectedCity());
    y.load();
    x.getProfileInfo(list.selectedCity());
    $(window).on('data_filtered',createFriendHolders);
  });
  window.y = new map({
    address: "Bangalore, India"
  });
  $(".bakwaas").on("click", function(){
    FB.ui({
      method: 'feed',
      link: 'https://developers.facebook.com/docs/dialogs/',
      caption: 'An example caption',
    }, function(response){});
  });

  var createFriendHolders = function(){
    var count = 0;
    for(var index in x.filteredFriends){
      if(!x.filteredFriends.hasOwnProperty(index)){
        continue;
      }
    var friend = x.filteredFriends[index];
      var friendHolder = $(".friends-holder .friend-holder").first().clone();
      friendHolder.find(".header img").attr("src", friend.pic);
      friendHolder.find(".header .name").text(friend.name);
      var action_text = "";
      var city = list.selectedCity().split(",")[0];
      switch(friend.searchType){
      case "location":
        action_text = "Has Lived in " + city;
        break;
      case "work":
        action_text = "Has worked in " + city;
        break;
      case "hometown":
        action_text = city + " is his hometown";
        break;
      case "album":
        action_text = "Has a " + city + " album";
        break;
      default:
        action_text = "Has been to " + city;
        break;
      }
      friendHolder.find(".header .action").text(action_text);
      if(!friend.link){
        friendHolder.find(".bottom .view-album").addClass("hide");
      } else{
        friendHolder.find(".bottom .view-album").attr("href", friend.link);
      }
      var message_url = "http://www.facebook.com/dialog/feed?app_id=604743509613601&to=" + index  + "&name=hello&description=world" + "&redirect_uri=" + encodeURIComponent("http://localhost:3333");
      friendHolder.find(".send-message").on("click", function(e){
        e.stopPropagation();
        e.preventDefault();
        window.open(message_url,"height=250,width=400,menubar=no");
      });
      friendHolder.removeClass("hide");
      $(".friends-holder").append(friendHolder);
    }
  }
        

  var showMapPage = function(){
    $(".home-container").removeClass("visible");
    $(".home-container").addClass("hide");
    $(".map-page-container").removeClass("hide");
    $(".map-page_container").addClass("visible");
  };
});
