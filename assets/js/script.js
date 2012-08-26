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
      image : function(venue, i){

        var img = 'http://maps.googleapis.com/maps/api/staticmap?center='+venue.lat+','+venue.lon+'&zoom=15&size=270x170&maptype=roadmap&markers=color:blue%7Clabel:'+(i+1)+'%7C'+venue.lat+','+venue.lon+'&sensor=false',
        link = 'http://maps.google.com/maps?q='+ venue.address_1 + ' ' + venue.city + ', ' + venue.state + ' ' + venue.zip + '&hl=en&ll='+venue.lat+','+venue.lon+'&spn=0.105618,0.22007&sll='+venue.lat+','+venue.lon+'&sspn=0.013207,0.027509&radius=15000&t=m&z=13';
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
        // adding a hour to offset to right time
        var d = new Date(time - 25200000), day, date, month, hour, minute, p, end, year, arr = [];
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
        arr.push(time + '-' + end);
        //Return String
        return arr.join('');
      },
      members : function(callback){
        $.ajax({
          url: '/api/v0/members.json',
          type: 'get',
          dataType: 'json', 
          success: function(res){
            if(res.success){
              callback(res.members);
            }
          }
        });
      }

    }, 
    init = (function(){

      $('.well.event').each(function(i){
        var that = $(this),
            venue = that.data().venue,
            time = that.find('.time');

            //console.log(venue);

            build.image(venue, i);
            time.html(build.parseTime(time.data().time));
      });

      build.members(function(res){

        var memberlist = $('.members');
        var members = _.sortBy(res, function(member){ return -member.activity; });

        for(var i in members){
          if (i < 15) {
            var member = members[i];

            if(member.photo !== null)
              memberlist.append('<li><img class="gravatar" src=' + member.photo + ' /><span class="name">' + member.name + '</span></li>');
          }
        }
      });

    }());

  }(jQuery));