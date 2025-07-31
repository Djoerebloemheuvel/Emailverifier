const express = require('express');
const cors = require('cors');
const verifier = require('email-verifier');
const app = express();
app.use(cors());
app.use(express.json());

const emailVerifier = new verifier();

app.post('/verify', (req, res) => {
  const email = req.body.email;
  if (!email) return res.status(400).json({ error: 'No email provided' });

  emailVerifier.verify(email, (err, info) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ success: info.success, info });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SMTP verifier draait op ${PORT}`));
