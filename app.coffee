express     = require 'express'
gravatar    = require 'gravatar'
http        = require 'http'
fs          = require 'fs'
path        = require 'path'

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
  size = '16'
  members = [
    {name: "Scott Motte", link: "http://scottmotte.com", gravatar: gravatar.url("scott@scottmotte.com", {s: size, d: 'retro'}) },
    {name: "Jacob Lowe", link: "http://redeyeoperations", gravatar: gravatar.url("jacoblowe2.0@gmail.com", {s: size, d: 'retro'}) },
    {name: "Landon Burch", link: "", gravatar: gravatar.url("", {s: size, d: 'retro'})}
  ]

  res.render 'index.jade', { members: members }

app.listen PORT, -> console.log "server is starting on port: #{PORT}"