# Railway Deployment for Django Backend

## Quick Railway Deployment

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Deploy from backend directory:**
   ```bash
   cd backend
   railway create paper-trail-handler-backend
   railway up
   ```

4. **Set environment variables in Railway dashboard:**
   - `DJANGO_SETTINGS_MODULE=backend.settings`
   - `DEBUG=False`
   - `ALLOWED_HOSTS=*.railway.app`

5. **Run migrations:**
   ```bash
   railway run python manage.py migrate
   ```

Your backend will be available at: `https://your-app-name.railway.app`

## Alternative Services:

### **Render.com:**
- Free tier available
- Automatic deploys from GitHub
- Built-in PostgreSQL

### **Heroku:**
- Popular choice
- Easy deployment
- Add-ons available

### **DigitalOcean App Platform:**
- $5/month
- Good performance
- Easy scaling