/* =================================================
 *       _                    _     _      _     
 *      (_)                  (_)   | |    (_)    
 *  _ __ ___   _____ _ __ ___ _  __| | ___ _ ___ 
 * | '__| \ \ / / _ \ '__/ __| |/ _` |/ _ \ / __|
 * | |  | |\ V /  __/ |  \__ \ | (_| |  __/ \__ \
 * |_|  |_| \_/ \___|_|  |___/_|\__,_|\___| |___/
 *                                       _/ |    
 *                                      |__/
 * =================================================
 * Ascii art by Hubot :)
 * Code by Members of RiversideJS.org
 */

jQuery(function($) {
    
    //Build elements
    var build = {
      //Build the image to the next meetup
      image : function(lat, lng, venue, i){

        var img = 'http://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&zoom=15&size=270x170&maptype=roadmap&markers=color:blue%7Clabel:'+(i+1)+'%7C'+lat+','+lng+'&sensor=false',
        link = 'http://maps.google.com/maps?q='+ venue.address_1 + ' ' + venue.city + ', ' + venue.state + ' ' + venue.zip + '&hl=en&ll='+lat+','+lng+'&spn=0.105618,0.22007&sll='+lat+','+lng+'&sspn=0.013207,0.027509&radius=15000&t=m&z=13';
        // Lets load the images before showing them
        $('<img/>')
          .prop({
            src : img
          })
          //instead of adding an image lets just load it and set as background then push to the corner
          .load(function(){
            $('.event-'+ i)
              .css('background', 'url(' + img + ') top right no-repeat')
              .find('.meta')
              .append(' | <a href="' + link + '">Larger Map</a>');
          });

      },
      //Parse time from epoch to UTC to readable
      parseTime : function(time){
        // -28800000 is the utc offset to pacific standard time
        var d = new Date(time - 28800000), day, date, month, hour, minute, p, end, year, arr = [];
        //Time is a pain in the arse
        //To UTC
        d = (d !== null) ? d = d.toUTCString() : {};
        //Break everything apart
        d = d.split(' '); 
        // The day, I like periods better then commas
        day = d[0].replace(',', '.');
        // The numerial parse to remove leading 0
        date = parseFloat(d[1]);
        // The month shortname
        month = d[2];
        year = d[3];
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
          p = 'AM';
        }
        // Compiling time
        time = hour + ':' + minute + ' ' + p;
        //making the default amount of time for the meetup 2 hours
        end = hour + 2 + ':' + minute + ' ' + p;
        //push the time
        arr.push(time + '-' + end + '<br>');
        //Return String
        return arr.join('');
      }

    },
    //Constructor for meetup data
    meetup_construct = function(data){
      //Our event object
      var i = 0;
      while(i < data.results.length){
        // get the result
        var next = data.results[i] ,html = [],
        //Venue object
        venue = next.venue,
        //readable address
        address = venue.name + '<br>' + venue.address_1 + '<br>' + venue.city + ', ' + venue.state + ' ' + venue.zip,
        //lat, lng coordinates
        lat = venue.lat,
        lng = venue.lon;
        //Clean out html array
        html.length = 0;

        // our opening div tag
        html.push('<div class="event-' + i + ' well">');
        //push a wrapper around data
        html.push('<div class="event-data">');
        //push time 
        html.push(build.parseTime(next.time));
        //push address after + button to event
        html.push(address + '<br><span class="meta"><a href="' + next.event_url + '">More Details</a></span>');
        html.push('</div>');
        //How many people have RSVPed
        html.push('<div class="rsvp-yes">' + next.yes_rsvp_count);
        html.push((next.yes_rsvp_count >= 2) ? ' People are going!' : ' Person is going');
        html.push('</div>');
        // our closing div tag
        html.push('</div>');
        //Adding the content to the page - using html to replace spinners
        $('.upcoming-meetups').append(html.join(''));
        //Build meetup image
        build.image(lat, lng, venue, i);
        i += 1;
      }
    };
    //Getting Data from Meetup Api
    $.getJSON('https://api.meetup.com/2/events?key=15865a185323203c58305f1a7b216c&sign=true&group_urlname=riversidejs&page=2&callback=?', meetup_construct);
  }(jQuery));