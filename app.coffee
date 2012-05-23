express = require 'express'
http    = require 'http'
fs      = require 'fs'
path    = require 'path'

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
  res.render 'index.jade'

app.listen 3000, -> console.log "server is starting on port: 3000"