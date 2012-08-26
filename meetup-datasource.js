/* Meetup Data
 * ==========================
 * @constutor   Meetup
 * @param       group   String - the groupname 
 */

var Meetup  = function(group){
    this.group      = group;
    this.url_base   = 'https://api.meetup.com';
    //Private Variable? - Sortof
    var key         = process.env.MEETUPKEY || '15865a185323203c58305f1a7b216c';
    // Privledged Function
    this.getKey     = function(){
        return key;
    }
},
    request  = require('request');

/* 
 * @method  _request                - sends request to meetup.com's api 
 * @param   path        String      - the suffix of the url
 * @param   callback    Function    - callback function
 */

Meetup.prototype._request = function(path, callback){

    req = request(this.url_base + path, function(error, response, body){
        if(error){
            console.log(error);
            callback(error);
        }else if(response.statusCode == 200){
            callback(JSON.parse(body).results);
        }

    });
}

/* @method getGroupInfo           -Get basic Group Info
 * @param  callback     Function  -Just a Callback
 */

 Meetup.prototype.getGroupInfo = function(callback){
    var path = '/2/groups',
        that = this;

    path += '?key='             + this.getKey();
    path += '&group_urlname='    + this.group;
    path += '&page=1';
    path += '&sign=true';

    this._request(path, function(res){

        callback(res[0]);

    })
 };


/*
 *  @method convertToISO                - converts epoch time(time in milliseconds to UTC)
 *  @param  epoch          Interger     - the epoch time
 */
Meetup.prototype.convertToISO = function(epoch, offset){

    // -28800000 is the utc offset to pacific standard time
    // adding a hour to offset to right time
    // hard coded california offset ~ needs to be calculated
    var d = new Date(epoch + offset),
        pad = function(n){
            return n<10 ? '0'+n : n
        };

    return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
}

/* 
 * @method  getEvents               - get events for meetup
 * @param   number      Interger    - number of events to get
 * @param   callback    Function    - callback function
 */

Meetup.prototype.getEvents = function(number, callback){
    var path = '/2/events',
        that = this;
    path += '?key='             + this.getKey();
    path += '&sign=true';
    path += '&group_urlname='   + this.group;
    path += '&page='            + number;

    this._request(path, function(events){

        for(var i in events){
            events[i].time_ = that.convertToISO(events[i].time, events[i].utc_offset);
            events[i].event_url = '/events/' + events[i].id;
            //console.log(events[i].time_);
        }

        callback(events);

    });
    
}

/* @method getMembers
 * @param  callback     Function  -Just a Callback
 */

Meetup.prototype.getMembers = function(callback){
    var path    = '/2/members',
        that    = this,
        members = [];

    path += '?group_urlname='   + this.group;
    path += '&key='             + this.getKey();

    this._request(path, function(res){

        for(var i in res){

            var member = res[i];

            members.push({
                name    : member.name, 
                photo   : (typeof member.photo === 'undefined') ? null : member.photo["thumb_link"],
                activity: member.visited
            });
        }

        callback(members);
    })
}

exports.Meetup = Meetup;