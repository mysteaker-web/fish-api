const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())

let users = {
  "user1": { saldo: 10000 }
}

let RTP = 0.7

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

app.post("/shoot", (req, res) => {
  const { username, bet } = req.body

  if (!users[username]) {
    return res.json({ status: "error" })
  }

  users[username].saldo -= bet

  let win = Math.random() < RTP

  let reward = 0
  if (win) {
    reward = bet * 2
    users[username].saldo += reward
  }

  res.json({
    win,
    reward,
    saldo: users[username].saldo
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("jalan"))