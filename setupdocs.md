Viewed package.json:1-390
Edited Dockerfile
Edited _redirects
Edited _redirects
Ran command: `git add .; git commit -m "Add Dockerfile for Render deployment and Netlify SPA redirects"; git push origin main`

**Yes! Your strategy is EXCELLENT.** 

Deploying **Frontend (`St.Joseph`)** and **Admin ERP (`St.Joseph-Admin`)** on **Netlify (100% FREE)** and **OpenWA WhatsApp Engine** on **Render.com (FREE)** is the smartest, most cost-effective architecture for your project!

We have already added the necessary configuration files (`Dockerfile` for Render + `_redirects` for Netlify) and pushed them live to your GitHub repo (`https://github.com/StJosephSchoolDholpur/school`).

---

### 🌐 STEP 1: Deploy Main Website (`St.Joseph`) on Netlify (FREE)

1. Log into **[Netlify.com](https://app.netlify.com)** using your GitHub account.
2. Click **Add new site** → **Import an existing project** → select **GitHub** → choose **`StJosephSchoolDholpur/school`**.
3. Configure Build Settings:
   - **Base directory**: `St.Joseph`
   - **Build command**: `npm run build`
   - **Publish directory**: `St.Joseph/dist`
4. Expand **Environment variables** and add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
5. Click **Deploy St.Joseph**.
6. Netlify will instantly give you a free live URL (e.g., `https://stjoseph-dholpur.netlify.app`)!

---

### 📊 STEP 2: Deploy Admin ERP (`St.Joseph-Admin`) on Netlify (FREE)

1. On your Netlify dashboard, click **Add new site** again → **Import an existing project** → select the exact same GitHub repo (`StJosephSchoolDholpur/school`).
2. Configure Build Settings:
   - **Base directory**: `St.Joseph-Admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `St.Joseph-Admin/dist`
3. Expand **Environment variables** and add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
4. Click **Deploy St.Joseph-Admin**.
5. Netlify will give you a second live URL (e.g., `https://admin-stjoseph.netlify.app`)!

---

### 📱 STEP 3: Deploy OpenWA WhatsApp Server on Render.com (FREE)

Render is great for Node.js services! Here is how to deploy OpenWA on Render:

1. Log into **[Render.com](https://dashboard.render.com)** using your GitHub account.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `StJosephSchoolDholpur/school`.
4. Configure Settings:
   - **Name**: `stjoseph-whatsapp-gateway`
   - **Root Directory**: `OpenWA`
   - **Runtime**: Select **Docker** *(Render will automatically detect the `OpenWA/Dockerfile` we created!)*
   - **Instance Type**: Select **Free**
5. Add Environment Variables on Render:
   - `PORT` = `2785`
   - `DASHBOARD_PORT` = `2886`
   - `API_KEY` = `stj_secure_production_key_2026`
   - `HEADLESS` = `true`
6. Click **Create Web Service**.

Render will build the container with Chromium pre-installed and give you your live URL (e.g., `https://stjoseph-whatsapp-gateway.onrender.com`).

---

### 💡 Pro-Tip for Render Free Tier (24/7 Keep-Alive Trick):
Render's Free Web Service goes to sleep after 15 minutes of inactivity. To keep your WhatsApp engine awake 24/7 for **$0**:

1. Go to **[UptimeRobot.com](https://uptimerobot.com)** (Free account).
2. Add a **HTTP Monitor** pointing to your Render URL:  
   `https://stjoseph-whatsapp-gateway.onrender.com` (Ping interval: **5 minutes**).
3. This keeps Render awake 24 hours a day, 365 days a year for 100% FREE! 🚀

---

### ⚙️ STEP 4: Pair WhatsApp & Link Admin Panel

1. Open your Render Dashboard URL in your browser: `https://stjoseph-whatsapp-gateway.onrender.com:2886` (or OpenWA Dashboard).
2. Scan the QR Code using your official school phone in WhatsApp (**Linked Devices**).
3. Log into your Live Netlify Admin Portal → **WhatsApp Birthdays** → **Provider & Settings**:
   - Set Provider: **OpenWA Self-Hosted Gateway**
   - OpenWA Base URL: `https://stjoseph-whatsapp-gateway.onrender.com`
   - OpenWA API Key: `stj_secure_production_key_2026`
4. Click **Save Settings** & send a test wish!