var fbData = function(config){
  this.config = config;
  this.init();
  this.bindEvents();
  this.allFriendsHash = {};
  this.filteredFriends = {};
};

fbData.prototype.bindEvents = function(){
  $(window).on("user_loggedin", this.getProfileInfo);
};

fbData.prototype.init = function(){
  var that = this;
  this.filteredFriends = [];
  	$('body').prepend('<div id="fb-root"></div>');
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '604743509613601',
      channelUrl : "//localhost:3333/channel.html",
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });
    FB.Event.subscribe('auth.statusChange', that.handleLoginEvents);
  };
  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js"
   ref.parentNode.insertBefore(js, ref);
  }(document));
  /* make the API call */
};

//window.open("http://www.facebook.com/dialog/feed?app_id=604743509613601&to=567162593&name=hello&description=world" + "&redirect_uri=" + encodeURIComponent("http://localhost:3333"))

fbData.prototype.handleLoginEvents = function(response){
  if (response.status === 'connected') {
    $(window).trigger("user_loggedin");
  } else if (response.status === 'not_authorized') {
    FB.login();
  } else {
    FB.login();
  }
};

window.fblogin = function(){
  FB.login();
};

fbData.prototype.getProfileInfo = function(city){
  var that = this;
  FB.api(
    "/me?fields=name,picture,location,hometown,work",
    function (response) {
      if (response && !response.error) {
        that.me = response;
      }
    }
  );
  // FB.api(
  //   "me/friends?fields=name,picture,location,hometown,work",
  //   function(response){
  //     if(response && !response.error){
  //       that.friends = response;
  //     }
  //   }
  // );
  FB.api('/fql', {
    q:{
      "query1":"SELECT uid, name, current_location, hometown_location, work, pic_square from user where uid IN (select uid2 from friend where uid1 = me())",
      "query2":"SELECT object_id, owner, name, link FROM album WHERE owner IN (SELECT uid FROM #query1)"
    }
  }, 
         function(response) {
           that.friends = response.data[0].fql_result_set;
           that.albums = response.data[1].fql_result_set;
           if(that.filterData){
             that.filterData(city);
             $(window).trigger("data_filtered");
           }
         });
};

fbData.prototype.filterData = function(searchCity){
  this.filteredFriends = {};
  this.allFriendsHash = {};
  var searchTerm = searchCity.split(",")[0];
  var searchRegEx = new RegExp(searchTerm, "gi")
  /*
    {
      name: "friends name",
      pic: "profile pic",
      id: "profile id"
      searchType: "work|location|hometown|album"
    }
    */
  var that = this;
  $(this.friends).each(function(index, friend){
    that.allFriendsHash[friend.uid] = {
      uid: friend.uid,
      name: friend.name,
      pic_square: friend.pic_square
    };
    if(friend.current_location && friend.current_location.name && searchRegEx.test(friend.current_location.name)){
      that.pushToFilteredFriends(friend, "location");
      return;
    }
    if(friend.hometown_location && friend.hometown_location.name && searchRegEx.test(friend.hometown_location.name)){
      that.pushToFilteredFriends(friend, "hometown");
      return;
    }
    for(var index in friend.work){
      if(friend.work.hasOwnProperty(index)){
        var work = friend.work[index];
        if(work.location && work.location.name && searchRegEx.test(work.location.name)){
          that.pushToFilteredFriends(friend, "work");
          return;
        }
      }
    }
  });

  $(this.albums).each(function(index, album){
    if(album.name && searchRegEx.test(album.name)){
      that.pushToFilteredFriends(that.allFriendsHash[album.owner], "album", album.link);
    }
  });
};

fbData.prototype.pushToFilteredFriends = function(friend, searchType, link){
  if(!link){
    link = null;
  }
  if(this.filteredFriends[friend.uid] && this.filteredFriends[friend.uid].searchType == searchType){
    return;
  }
  this.filteredFriends[friend.uid] = {
    name: friend.name,
    pic: friend.pic_square,
    searchType: searchType,
    link: link
  };
};

fbData.prototype.getAlbumPhotos = function(albumId){
  FB.api(
    albumId + "/photos?&limit=20",
    function (response) {
      if (response && !response.error) {
        return response;
      }
    }
  );
};
