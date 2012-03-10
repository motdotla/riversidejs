http  = require("http");
fs    = require('fs');
path = require('path');

PORT = process.env.PORT || 3000

fs.readFile 'index.html', 'utf8', (err,html) ->
  return console.log(err) if err

  console.log('Starting Up')

  http.createServer((req, res) ->

    filePath = '.' + req.url

    filePath = './index.html' if filePath is './'
        
    extname = path.extname filePath
    
    switch extname

      when '.js' then contentType = 'text/javascript' 
      
      when '.css' then contentType = 'text/css'
      
      when '.jpg' then contentType = 'image/jpg'
      
      when '.gif' then contentType = 'image/gif'
      
      when '.png' then contentType = 'image/png'

      when '.ico' then contentType = 'image/ico'
      
      else
        contentType = 'text/html;charset=UTF-8'

    console.log(filePath, contentType)

    path.exists filePath, (exist) ->

      if exist 

        fs.readFile filePath, (error, content) ->

          if error

            res.writeHead 500

            res.end

          else
     
            res.writeHead 200,
              "Content-Type" : contentType

            res.end content, 'utf-8'
      else

      	res.writeHead 404

      	res.end

  ).listen PORT, "0.0.0.0"

console.log "Server running at http://localhost:#{PORT}/"