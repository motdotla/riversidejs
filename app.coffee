express     = require 'express'
gravatar    = require 'gravatar'
http        = require 'http'
fs          = require 'fs'
path        = require 'path'
meetup      = require('./meetup-datasource.js').Meetup
riversidejs = new meetup('riversidejs')

PORT = process.env.PORT || 3000

# ==================================================
# EXPRESS APP SETUP
# ==================================================
app     = express.createServer()
app.configure ->
  app.set 'views', __dirname + "/views"
  app.use express.bodyParser()
  app.use express.static(__dirname + "/public")
  app.use require('connect-assets')()

# ==================================================
# MODELS
# ==================================================
class Member
  constructor: ->
    
  @all: ->
    size = '16'

    [
      {name: "Scott Motte", link: "http://scottmotte.com", gravatar: gravatar.url("scott@scottmotte.com", {s: size, d: 'retro'}) },
      {name: "Jacob Lowe", link: "http://redeyeoperations.com", gravatar: gravatar.url("jacoblowe2.0@gmail.com", {s: size, d: 'retro'}) },
      {name: "Landon Burch", link: "", gravatar: gravatar.url("linuxopenconnection@yahoo.com", {s: size, d: 'retro'})},
      {name: "Gary Gossett", link: "", gravatar: gravatar.url("garygossett11@gmail.com", {s: size, d: 'retro'})},
      {name: "Ben Gullotti", link: "", gravatar: gravatar.url("", {s: size, d: 'retro'})},
      {name: "Jean Wu", link: "", gravatar: gravatar.url("", {s: size, d: 'retro'})},
      {name: "David Gadea", link: "", gravatar: gravatar.url("", {s: size, d: 'retro'})},
      {name: "Dave Rugh", link: "http://about.me/dr3x", gravatar: gravatar.url("dave.rugh@gmail.com", {s: size, d: 'retro'})},
      {name: "Sean Walker", link: "http://swlkr.com/", gravatar: gravatar.url("swlkr@me.com", {s: size, d: 'retro'})},
      {name: "Serene", link: "", gravatar: gravatar.url("", {s: size, d: 'retro'})},
      {name: "Leo Lutz", link: "http://leolutz.com", gravatar: gravatar.url("leo@leolutz.com", {s: size, d: 'retro'})},
      {name: "Helior Colorado", link: "http://drupal.org/user/333731", gravatar: gravatar.url("helior@activelamp.com", {s: size, d: 'retro'})},
      {name: "Dave Liu", link: "", gravatar: gravatar.url("yliu037@ucr.edu", {s: size, d: 'retro'})},
      {name: "Will VanOosting", link: "http://dutchmanwebdesign.com", gravatar: gravatar.url("will@dutchmanwebdesign.com", {s: size, d: 'retro'})}
    ]

  @all_alphabetical: ->
    Member.all().sort (a, b) -> 
      name_a = a.name.toUpperCase()
      name_b = b.name.toUpperCase()
      return 0 if name_a == name_b
      return 1 if name_a > name_b
      return -1 if name_a < name_b

# ==================================================
# EXPRESS ROUTES
# ==================================================
app.get '/', (req, res) -> 
  # need to set up middleware so we dont have to request new data every request
  riversidejs.getEvents 2, (events) ->
    #console.log(events);
    res.render 'index.jade', {events : events}

app.get '/jobs', (req, res) ->
  res.send '<h1>Coming Soon!</h1>'

app.get '/events/:id', (req, res) ->
  res.redirect('http://meetup.com/riversidejs/events/' + req.params.id)

app.get '/api/v0/members.json', (req, res) ->
  riversidejs.getMembers (members) ->
    res.json({success: true, members: members});

app.listen PORT, -> console.log "server is starting on port: #{PORT}"