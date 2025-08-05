# Salem Cyber Vault

A Halloween-themed cybersecurity monitoring dashboard built with Next.js, React, and Tailwind CSS.

## Features

- 🎃 **Halloween-themed UI** - Spooky cybersecurity dashboard with orange and black color scheme
- 🛡️ **Security Score Monitoring** - Track your digital protection strength
- 👻 **Threat Intelligence** - Real-time monitoring of cyber threats
- 🗺️ **Live Threat Map** - Global and local threat visualization  
- 📊 **Asset Monitoring** - Security status of network assets
- 🔍 **Vulnerability Analysis** - Latest security vulnerabilities and assessments
- 📚 **Learn Mode** - Educational content explaining cybersecurity concepts
- 🔮 **Spooky Scan** - Halloween-themed security scanner

## Deployment

This application is configured for deployment on Vercel.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/salem-cyber-vault)

### Manual Deployment

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Deploy to Vercel: `vercel --prod`

---

### Vercel Custom Domain & Root Directory Setup

To deploy this project with your custom domain:

1. **Set the Root Directory:**
   - In your Vercel dashboard, go to your project’s settings.
   - Under **General > Root Directory**, set this to `cybersecurity-dashboard-2`.
   - This ensures Vercel deploys from the correct folder.

2. **Set up your custom domain (`salemcybervault.com`):**
   - Add both `salemcybervault.com` and `www.salemcybervault.com` in your Vercel project's domain settings.
   - Ensure DNS records point to Vercel (A record for root: `76.76.21.21`, CNAME for www: your Vercel domain).

3. **Verify Vercel and Google TXT records:**
   - Google site verification and Vercel TXT records must be present as shown in your DNS provider.

4. **Redeploy after changes:**
   - Trigger a new deployment to ensure changes take effect.

If you see a 404 error after deploying:
- Double-check the Root Directory in Vercel.
- Confirm your DNS records point to Vercel.
- Make sure your project files are inside the `cybersecurity-dashboard-2` folder.
- Check your deployment logs for any build or routing errors.

---

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Icons**: Lucide React
- **Language**: TypeScript

## Halloween Special Features

- 🧙‍♀️ Witch-themed security explanations
- 👻 Digital ghost and zombie process detection
- 🎃 Pumpkin-powered threat analysis
- 🕷️ Spooky scanning capabilities
- 🦇 Dark theme with Halloween aesthetics

Perfect for cybersecurity professionals who want to add some seasonal fun to their monitoring dashboards!
