$(function() {
    //Most of the content is here in the 
    var meetings = "<h3>Next Meetup</h3><p class='meeting_content'><img src='./img/loading.gif' /></p>",
    topics = "<h3>We talk about</h3><p>Everything Javascript.</p><p>jQuery. Prototype. Node. Raphael. Backbone. PJAX. Modernizer. Coffee Script. Eco.</p><p>And more.</p>",
    map = '<h3>Mapped out</h3><div class="map"><img src="./img/loading.gif" /></div>',
    description = "<h3>We are</h3><p>Riverside's tech community is small but starting to grow. Let's get together to learn, and hack. Javascript is a huge part of both ux and server side development today. It's increasingly important to be on the cutting edge.</p> <p>This group is inspired by San Diego JS. Just like that group, this group exists \"to connect people of all skill levels who are working with Javascript, facilitate the flow of knowledge from those who know more to those who know less, and give an arena for sharing all about the latest and greatest javascript thing you just figured out.\"</p><p>We meet the 1st Monday of each month. Come and enjoy!</p>",
    // Array of content
    content = [meetings, map, topics, description],
    //html array & some null variables
    html    = [], i, size, clear,
    //Build object
    build = {
      //All of the events to handle
      events : function(){
        $("h1").hover(function() {
          $(this).addClass("hover");
        }, function() {
          $(this).removeClass("hover");
        });
      },
      //Build the image to the next meetup
      image : function(lat, lng, venue){

        var img = 'http://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&zoom=15&size=270x170&maptype=roadmap&markers=color:blue%7Clabel:R%7C'+lat+','+lng+'&sensor=false',
        link = 'http://maps.google.com/maps?q='+ venue.address_1 + ' ' + venue.city + ', ' + venue.state + ' ' + venue.zip + '&hl=en&ll='+lat+','+lng+'&spn=0.105618,0.22007&sll='+lat+','+lng+'&sspn=0.013207,0.027509&radius=15000&t=m&z=13';

        $('.map').html('<a href="' + link + '" ><img src="' + img + '" alt="Map of ' + venue.name + '"/></a>');
        build.events();

      },
      //Parse time from epoch to UTC to readable
      time : function(time){
        // -28800000 is the utc offset to pacific standard time
        var d = new Date(time - 28800000), day, date, time, month, time, year, arr = [];
        //Time is a pain in the arse
        //To UTC
        d = (d != null) ? d = d.toUTCString() : {};
        //Break everything apart
        d = d.split(' '); 
        // The day, I like periods better then commas
        day = d[0].replace(',', '.');
        // The numerial parse to remove leading 0
        date = parseFloat(d[1]);
        // The month shortname
        month = d[2];
        year = d[3]
        //Time array
        time = d[4].split(':');
        //parsefloat so we can compare to other number and calculate 
        hour = parseFloat(time[0]);
        minute = time[1];
        //We can push the date
        arr.push(day + ' ' + month + ' ' + date + ', ' + year + '<br>');
        //hour based off military time, switching that
        if(hour > 12){
          hour = hour - 12;
          p = 'PM';
        }
        else{
          p = 'AM'
        }
        // Compiling time
        time = hour + ':' + minute + ' ' + p;
        //making the default amount of time for the meetup 2 hours
        end = hour + 2 + ':' + minute + ' ' + p;
        //push the time
        arr.push(time + '-' + end + '<br>');
        //Return String
        return arr.join('');
      },
      // Build modules with content - self executes
      modules : (function(){
        //Set or interger to 0
        i = 0;
        // loop through all content
        while(i < content.length) {
          //switch up width
          size = (i === 3) ? 'full' : 'third' ;
          // clearfixes
          clear = (i === 3) ? '<div class="clearfix"></div>' : '' ;
          // Push our string
          html.push("<div class='" + size + " round lFloat module'>" + content[i] + "</div>" + clear);
          // increment interger 1
          i += 1;
        }
        //Add to the article
        $("article").html(html.join(""));

      }())

    },
    //Constructor for meetup data
    meetup_construct = function(data){
      //Our event object
      var next = data.results[0],
        //Venue object
        venue = next.venue,
        //readable address
        address = venue.name + '<br>' + venue.address_1 + '<br>' + venue.city + ', ' + venue.state + ' ' + venue.zip,
        //lat, lng coordinates
        lat = venue.lat,
        lng = venue.lon;
        //Clean out html array
        html.length = 0;
        //push time 
        html.push(build.time(next.time))
        //push address after + button to event
        html.push(address + '<br><a class="button lFloat round" href="' + next.event_url + '">More Details</a>');
        //Adding the content to the page - using html to replace spinners
        $('.meeting_content').html(html.join(''));
        //Build meetup image
        build.image(lat, lng, venue);
    };
    //Getting Data from Meetup Api
    $.getJSON('https://api.meetup.com/2/events?key=15865a185323203c58305f1a7b216c&sign=true&group_urlname=riversidejs&page=1&callback=?', meetup_construct);
  });