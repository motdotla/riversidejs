http  = require("http")
fs    = require('fs');

PORT = process.env.PORT || 3000

fs.readFile 'index.html', 'utf8', (err,html) ->
  return console.log(err) if err

  http.createServer((req, res) ->
    res.writeHead 200,
      "Content-Type": "text/html;charset=UTF-8"
    res.end html
  ).listen PORT, "0.0.0.0"

console.log "Server running at http://localhost:#{PORT}/"