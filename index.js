const express = require('express');
const cors = require('cors');
const { verifyEmail } = require('verify-email-address');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/verify', async (req, res) => {
  const email = req.body.email;
  if (!email) return res.status(400).json({ error: 'No email provided' });

  try {
    const result = await verifyEmail(email);
    res.json({ success: result.isValid, info: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SMTP verifier draait op poort ${PORT}`));
