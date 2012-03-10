$(function() {
    
    var meetings = "<h3>Next Meetup</h3><p class='meeting_content'><img src='./img/loading.gif' /></p>",
    topics = "<h3>We talk about</h3><p>Everything Javascript.</p><p>jQuery. Prototype. Node. Raphael. Backbone. PJAX. Modernizer. Coffee Script. Eco.</p><p>And more.</p>",
    map = '<h3>Mapped out</h3><div class="map"><img src="./img/loading.gif" /></div>',
    description = "<h3>We are</h3><p>Riverside's tech community is small but starting to grow. Let's get together to learn, and hack. Javascript is a huge part of both ux and server side development today. It's increasingly important to be on the cutting edge.</p> <p>This group is inspired by San Diego JS. Just like that group, this group exists \"to connect people of all skill levels who are working with Javascript, facilitate the flow of knowledge from those who know more to those who know less, and give an arena for sharing all about the latest and greatest javascript thing you just figured out.\"</p><p>We meet the 1st Monday of each month. Come and enjoy!</p>",
    content = [meetings, map, topics, description],
    html    = [], i;

    i = 0;
    while(i < content.length) {
      if(i === 3){
        html.push("<div class='clearfix'></div><div class='full round lFloat module'>"+content[i]+"</div>");
      }
      else{
        html.push("<div class='third round lFloat module'>"+content[i]+"</div>");
      }
      i += 1;
    }
    $(".container").append(html.join(""));

    $("h1").hover(function() {
      $(this).addClass("hover");
    }, function() {
      $(this).removeClass("hover");
    });

    $.getJSON('https://api.meetup.com/2/events?key=15865a185323203c58305f1a7b216c&sign=true&group_urlname=riversidejs&page=1&callback=?', function(data){
      var next = data.results[0],
        venue = next.venue,
        address = venue.name + '<br>' + venue.address_1 + '<br>' + venue.city + ', ' + venue.state + ' ' + venue.zip,
        d = new Date(next.time - 28800000), day, date, time, month, time, year,
        lat = venue.lat,
        lng = venue.lon;
        img = 'http://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lng+'&zoom=15&size=270x170&maptype=roadmap&markers=color:blue%7Clabel:R%7C'+lat+','+lng+'&sensor=false',
        link = 'http://maps.google.com/maps?q='+ venue.address_1 + ' ' + venue.city + ', ' + venue.state + ' ' + venue.zip + '&hl=en&ll='+lat+','+lng+'&spn=0.105618,0.22007&sll='+lat+','+lng+'&sspn=0.013207,0.027509&radius=15000&t=m&z=13';

        //Clean out html array
        html.length = 0;

        //Time is a pain in the arse

        if (d != null) { d = d.toUTCString()}
        d = d.split(' '); 
        day = d[0].replace(',', '.');
        date = parseFloat(d[1]);
        month = d[2];
        year = d[3]
        time = d[4].split(':');
        hour = parseFloat(time[0]);
        minute = time[1];

        //We can push the date
        html.push(day + ' ' + month + ' ' + date + ', ' + year + '<br>');

        if(hour > 12){
          hour = hour - 12;
          p = 'PM';
        }
        else{
          p = 'AM'
        }
        time = hour + ':' + minute + ' ' + p;
        end = hour + 2 + ':' + minute + ' ' + p;

        //push the time

        html.push(time + '-' + end + '<br>');

        //push address after

        html.push(address + '<br><a class="button lFloat round" href="' + next.event_url + '">More Details</a>');

        console.log([next, d, day, month, date, year, time]);

        $('.meeting_content').html(html.join(''));

        $('.map').html('<a href="' + link + '" ><img src="' + img + '" alt="Map of ' + venue.name + '"/></a>');
    });

  });