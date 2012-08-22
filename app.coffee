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