# 📱 OpenWA Setup & Integration Guide for Static & Admin Web Portals
**St. Joseph's International School, Dholpur**

This guide provides complete end-to-end technical instructions for setting up, configuring, and integrating the **OpenWA (WhatsApp Automate / Baileys)** server with your static public website (`St.Joseph`) and Admin Portal (`St.Joseph-Admin`).

---

## 🏗️ 1. System Architecture Overview

```
 ┌──────────────────────────────────┐        ┌──────────────────────────────────┐
 │    Static Public School Web      │        │      Admin ERP Control Panel     │
 │    (Main Website: St.Joseph)     │        │      (St.Joseph-Admin)           │
 └─────────────────┬────────────────┘        └─────────────────┬────────────────┘
                   │                                           │
                   │  HTML/JS Form Submissions &               │ REST API Calls &
                   │  WhatsApp Floating Widget                 │ Daily Birthday Cron
                   ▼                                           ▼
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │                        OpenWA Express / NestJS API Gateway                  │
 │                        (Running on Port 8080 / Docker)                       │
 └──────────────────────────────────────┬───────────────────────────────────────┘
                                        │
                                        │ Puppeteer / WhatsApp Web Session
                                        ▼
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │                      WhatsApp Cloud / Mobile Device                          │
 │                   Official School WhatsApp Business Number                   │
 └──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 2. OpenWA Server Setup & Initial Authentication

### Step 2.1: Prerequisites
- **Node.js**: v18.x or v20.x LTS installed.
- **Chrome / Chromium Browser**: Required for Puppeteer session rendering.
- **Dedicated Phone Number**: Official school WhatsApp number (Android or iPhone).

### Step 2.2: Environment Configuration (`.env`)
Navigate to the `OpenWA` directory in your project root and configure the `.env` file:

```env
# Server Configuration
PORT=8080
HOST=0.0.0.0
API_KEY=stjoseph_secure_wa_token_2026

# WhatsApp Session Settings
SESSION_ID=stjoseph_primary_session
HEADLESS=true
USE_CHROME=true

# Webhook Callback Settings (Optional)
WEBHOOK_URL=https://hzvwkrjydesdvkkcjupj.supabase.co/functions/v1/wa-webhook
```

### Step 2.3: Install Dependencies & Launch Server
Run the following commands inside the `OpenWA` folder:

```bash
# 1. Install dependencies
npm install

# 2. Build the server
npm run build

# 3. Start OpenWA Server
npm run start
```

> **Scanning QR Code**:
> On first boot, OpenWA will output a **QR Code** in your terminal terminal or local dashboard at `http://localhost:8080`.
> 1. Open WhatsApp on the school mobile phone.
> 2. Go to **Settings > Linked Devices > Link a Device**.
> 3. Scan the QR code displayed in the terminal.
> 4. Once scanned, you will see `[SUCCESS] Client authenticated! Ready to send WhatsApp messages.`

---

## 🌐 3. Integrating WhatsApp with Static Website (`St.Joseph`)

### Method A: Floating WhatsApp Quick Chat Widget (HTML/JS)
Add this lightweight widget to your static website's `index.html` before the closing `</body>` tag:

```html
<!-- Floating WhatsApp Chat Widget -->
<div id="wa-widget" style="position: fixed; bottom: 25px; right: 25px; z-index: 9999;">
  <a 
    href="https://wa.me/919829123456?text=Hello%20St.%20Joseph%20School%2C%20I%20want%20information%20regarding%20Admissions%202026-2027."
    target="_blank"
    rel="noopener noreferrer"
    style="
      display: flex;
      align-items: center;
      gap: 10px;
      background: #25D366;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 50px;
      font-family: sans-serif;
      font-weight: bold;
      font-size: 14px;
      text-decoration: none;
      box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
      transition: transform 0.3s ease;
    "
    onmouseover="this.style.transform='scale(1.08)'"
    onmouseout="this.style.transform='scale(1)'"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.156 4.221 4.221-1.156z"/>
    </svg>
    <span>Chat with Admission Desk</span>
  </a>
</div>
```

---

### Method B: Automated WhatsApp Confirmation on Static Form Submission
When a parent submits an Admission Form or Contact Inquiry on the static site, send an instant automated WhatsApp confirmation message via JavaScript `fetch()` to OpenWA API:

```javascript
// Add this JS code to your static website's form submission handler
async function handleStaticAdmissionSubmit(event) {
  event.preventDefault();

  const studentName = document.getElementById("child_name").value;
  const parentName = document.getElementById("father_name").value;
  const parentMobile = document.getElementById("whatsapp_no").value; // e.g. 9829123456
  const targetClass = document.getElementById("admission_class").value;

  // 1. Format Mobile Number into International Format (91XXXXXXXXXX)
  let cleanPhone = parentMobile.replace(/\D/g, "");
  if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;

  const whatsappPayload = {
    phone: cleanPhone + "@c.us",
    message: `🎉 *St. Joseph's International School, Dholpur*\n\nDear *${parentName}*,\nThank you for registering admission inquiry for *${studentName}* in *${targetClass}*.\n\nOur admission counselor will call you shortly.\n📍 Location: Ondela Road, Dholpur (Raj)\n📞 Helpline: +91 98291-11223`
  };

  try {
    // 2. Call OpenWA REST API Gateway
    const response = await fetch("http://localhost:8080/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer stjoseph_secure_wa_token_2026"
      },
      body: JSON.stringify(whatsappPayload)
    });

    const result = await response.json();
    if (result.status === "success") {
      alert("✅ Application received! A confirmation WhatsApp message has been sent to your number.");
    }
  } catch (error) {
    console.warn("WhatsApp notification error:", error);
    alert("Application submitted successfully!");
  }
}
```

---

## 🛠️ 4. OpenWA API Endpoint Reference

### 1. Send Text Message
- **Endpoint**: `POST /send-message`
- **Headers**: `Authorization: Bearer <YOUR_API_KEY>`
- **Body**:
  ```json
  {
    "phone": "919829123456@c.us",
    "message": "Greetings from St. Joseph's School!"
  }
  ```

### 2. Send PDF Document (Report Card / TC)
- **Endpoint**: `POST /send-file`
- **Body**:
  ```json
  {
    "phone": "919829123456@c.us",
    "file_url": "https://school.stjosephdholpur.com/tc/TC-2026-001.pdf",
    "filename": "Transfer_Certificate_Aarav.pdf",
    "caption": "Attached Transfer Certificate for Aarav Sharma."
  }
  ```

### 3. Check OpenWA Server Health & Session Status
- **Endpoint**: `GET /health`
- **Response**:
  ```json
  {
    "status": "online",
    "authenticated": true,
    "session": "stjoseph_primary_session",
    "battery": "98%",
    "phone": "919829123456"
  }
  ```

---

## 🛡️ 5. Production Maintenance & Auto-Restart

### Running as a Background Service with PM2
To ensure OpenWA runs 24/7 continuously even after server restarts:

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Start OpenWA with PM2
cd OpenWA
pm2 start dist/main.js --name "stjoseph-openwa-server"

# 3. Save PM2 state & enable auto-boot
pm2 save
pm2 startup
```

### Docker Deployment (Alternative)
Run with Docker Compose:

```bash
cd OpenWA
docker-compose up -d --build
```

---

## 📋 6. Summary & Troubleshooting Checklist

| Issue | Cause | Solution |
|---|---|---|
| **`QR Code Exists`** | First time authentication | Scan QR code using WhatsApp on school mobile. |
| **`Session Disconnected`** | Mobile phone offline or logged out | Re-run `pm2 restart stjoseph-openwa-server` and rescan QR. |
| **`CORS Error from Static Site`** | Origin restriction in OpenWA | Enable `CORS_ORIGIN=*` in `OpenWA/.env`. |
| **`File Upload Failed`** | PDF URL not publicly accessible | Ensure document links use HTTPS URLs or Supabase Storage links. |

---
*Created for St. Joseph's International School, Dholpur. Pushed to main branch.*
