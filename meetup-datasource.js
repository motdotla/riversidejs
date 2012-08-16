/* Meetup Data
 * ==========================
 * @constutor   Meetup
 * @param       group   String - the groupname 
 */

var Meetup  = function(group){
    this.group      = group;
    this.url_base   = 'api.meetup.com';
    //Private Variable? - Sortof
    var key         = process.env.MEETUPKEY || '15865a185323203c58305f1a7b216c';
    // Privledged Function
    this.getKey     = function(){
        return key;
    }
},
    https    = require('https');

/* 
 * @method  _request                - sends request to meetup.com's api 
 * @param   path        String      - the suffix of the url
 * @param   callback    Function    - callback function
 */

Meetup.prototype._request = function(path, callback){
    var options = {
        hostname: this.url_base,
        port    : 443,
        path    : path,
        method  : 'GET'
    },

    request = https.request(options, function(response){
        response.setEncoding('utf8');
        response.on('data', function(chunk){
            console.log(chunk);
            callback(chunk);
        })
    });  

    request.on('error', function(error){
        console.log(error);
        callback({statusCode: 500});
    });
    request.end();
}

/* 
 * @method  getEvents               - get events for meetup
 * @param   number      Interger    - number of events to get
 * @param   callback    Function    - callback function
 */

Meetup.prototype.getEvents = function(number, callback){
    var path = '/2/events';
    path += '?key='             + this.getKey();
    path += '&sign=true';
    path += '&group_urlname='   + this.group;
    path += '&page='            + number;

    this._request(path, callback);
    
}

exports.Meetup = Meetup;