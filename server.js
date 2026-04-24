const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())

// ================= DATA =================
let users = {
  "user1": { saldo: 10000 }
}

// RTP global & per user
let globalRTP = 0.7
let userRTP = {}

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { username } = req.body

  if (!users[username]) {
    users[username] = { saldo: 10000 }
  }

  res.json({
    status: "ok",
    saldo: users[username].saldo
  })
})

// ================= SHOOT (TEMBAK IKAN) =================
app.post("/shoot", (req, res) => {
  const { username, bet } = req.body

  if (!users[username]) {
    return res.json({ status: "error" })
  }

  users[username].saldo -= bet

  // pakai RTP user kalau ada, kalau tidak pakai global
  let rtp = userRTP[username] ?? globalRTP

  let win = Math.random() < rtp

  let reward = 0
  if (win) {
    reward = bet * 2
    users[username].saldo += reward
  }

  res.json({
    win,
    reward,
    saldo: users[username].saldo,
    rtp_used: rtp
  })
})

// ================= SET RTP PER USER =================
app.post("/set-rtp", (req, res) => {
  const { username, rtp } = req.body

  userRTP[username] = rtp

  res.json({
    status: "ok",
    username,
    rtp
  })
})

// ================= SET RTP GLOBAL =================
app.post("/set-global-rtp", (req, res) => {
  const { rtp } = req.body

  globalRTP = rtp

  res.json({
    status: "ok",
    globalRTP
  })
})

// ================= TEST API =================
app.get("/", (req, res) => {
  res.send("API TEMBAK IKAN HIDUP 🔥")
})

// ================= RUN SERVER =================
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server jalan di port " + PORT))
