const express = require('express');
const cors = require('cors');
const emailVerify = require('email-verify');

const app = express();
app.use(cors());
app.use(express.json());

// Email verificatie functie met timeout
function verifyEmail(email) {
  return new Promise((resolve, reject) => {
    // Voeg timeout toe van 10 seconden
    const timeout = setTimeout(() => {
      reject(new Error('SMTP verificatie timeout - probeer later opnieuw'));
    }, 10000);

    emailVerify.verify(email, (err, info) => {
      clearTimeout(timeout);
      if (err) {
        // Geef meer specifieke foutmeldingen
        if (err.code === 'ECONNREFUSED') {
          reject(new Error('SMTP connectie geweigerd - mogelijk geblokkeerd door firewall of ISP'));
        } else if (err.code === 'ETIMEDOUT') {
          reject(new Error('SMTP connectie timeout - server reageert niet'));
        } else {
          reject(err);
        }
      } else {
        resolve(info);
      }
    });
  });
}

app.post('/verify', async (req, res) => {
  const { email } = req.body;
  
  // Validatie van email input
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Geen email adres opgegeven' 
    });
  }

  // Basis email format validatie
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Ongeldig email formaat' 
    });
  }

  try {
    const result = await verifyEmail(email);
    
    // Verwerk het resultaat van email-verify
    const response = {
      success: true,
      info: {
        email: email,
        isValid: result.success,
        mxRecord: result.mxRecord,
        smtpCheck: result.smtpCheck,
        catchAll: result.catchAll,
        disposable: result.disposable,
        role: result.role,
        free: result.free,
        message: result.success ? 'Email is geldig' : 'Email is ongeldig'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Email verificatie fout:', error);
    
    // Geef een meer informatieve response bij SMTP fouten
    const errorResponse = {
      success: false,
      error: error.message,
      note: 'SMTP verificatie kan falen door firewall/ISP beperkingen. Basis email format is wel geldig.',
      email: email,
      formatValid: true
    };
    
    res.status(500).json(errorResponse);
  }
});

// GET endpoint voor testen
app.get('/verify', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SMTP Email Verifier API is actief. Gebruik POST /verify met { "email": "test@example.com" }' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SMTP Email Verifier draait op poort ${PORT}`);
  console.log(`📧 Test de API: POST http://localhost:${PORT}/verify`);
});
