# SMTP Email Verifier API

Een eenvoudige Express.js API die email adressen verifieert met behulp van het `email-verify` npm pakket.

## Installatie

```bash
npm install
```

## Starten

```bash
npm start
```

De server draait op poort 3000 (of de PORT environment variable).

## API Endpoints

### POST /verify

Verificeert een email adres via SMTP.

**Request:**
```json
{
  "email": "test@example.com"
}
```

**Response (succes):**
```json
{
  "success": true,
  "info": {
    "email": "test@example.com",
    "isValid": true,
    "mxRecord": true,
    "smtpCheck": true,
    "catchAll": false,
    "disposable": false,
    "role": false,
    "free": true,
    "message": "Email is geldig"
  }
}
```

**Response (fout):**
```json
{
  "success": false,
  "error": "SMTP connectie geweigerd - mogelijk geblokkeerd door firewall of ISP",
  "note": "SMTP verificatie kan falen door firewall/ISP beperkingen. Basis email format is wel geldig.",
  "email": "test@gmail.com",
  "formatValid": true
}
```

### GET /verify

Test endpoint om te controleren of de API actief is.

**Response:**
```json
{
  "success": true,
  "message": "SMTP Email Verifier API is actief. Gebruik POST /verify met { \"email\": \"test@example.com\" }"
}
```

## Foutmeldingen

- `Geen email adres opgegeven` - Email parameter ontbreekt
- `Ongeldig email formaat` - Email voldoet niet aan basis formaat
- `SMTP connectie geweigerd` - Firewall/ISP blokkeert SMTP connectie
- `SMTP connectie timeout` - Server reageert niet

## Testen

```bash
# Test API status
curl -X GET http://localhost:3000/verify

# Test email verificatie
curl -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'

# Test ongeldig email
curl -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}'
```

## Dependencies

- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `email-verify` - Email verificatie via SMTP 