const express = require('express')
const app = express()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

var spawn = require('child_process').spawn

var job = null

app.get('/save', function (req, res) {
  if (job && job.pid)
    return res.status(500).send('Job is already running').end()

  job = spawn('node', ['/path/to/save/job.js'], {
    detached: false,
    stdio: [process.stdin, process.stdout, process.stderr],
  })

  job.on('close', function (code) {
    job = null
  })

  return res.status(201)
})

app.get('/stop', function (req, res) {
  if (!job || !job.pid) return res.status(404).end()

  job.kill('SIGTERM')
  job = null
  return res.status(200).end()
})

app.get('/isAlive', function (req, res) {
  try {
    job.kill(0)
    return res.status(200).end()
  } catch (e) {
    return res.status(500).send(e).end()
  }
})
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log('Server Running on port'))
