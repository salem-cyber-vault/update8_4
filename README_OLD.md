# Salem Cyber Vault ✨

A **stunning, immersive cybersecurity monitoring dashboard** built with Next.js, React, and Tailwind CSS. This unified platform combines powerful cyber forensics tools with a beautiful, intuitive interface designed for digital investigation professionals and legal teams.

## 🌟 Key Features

### 🦉 **Visual Design**
- **Painterly owl icons** with animated SVG graphics and mystical sparkles
- **Animated forest background** with floating fog, mystical lighting, and layered depth
- **Floating lights and particles** creating an immersive cyberpunk atmosphere
- **Glassmorphic UI** with feminine gradient themes and smooth animations
- **Non-blocking interface** - no popups, all content immediately accessible

### 📊 **Living Intelligence Ledger**
- **Real-time system metrics** with animated progress bars
- **Live intelligence feed** with simulated data updates every 3-5 seconds
- **System monitoring**: Active Scans, Threat Score, CVE Monitoring, Network Health
- **Severity indicators** and trend analysis with visual feedback

### 🔍 **Universal Intelligence Scanner**  
- **Shodan Pro Explorer** with intelligent type detection
- **Quick search buttons** for common targets (webcams, SSH servers, databases, IoT, industrial systems)
- **Real-time search capabilities** with loading states and result counting

### 🛡️ **CVE Intelligence Panel**
- **Comprehensive vulnerability analysis** with product-specific intelligence
- **CVE monitoring and tracking** with severity classification
- **Interactive testing tools** for product analysis and specific CVE investigation

### 📋 **Evidence Timeline & Notebook**
- **Digital forensics workflow** with timestamped evidence collection
- **Case documentation** with tagging, categorization, and export capabilities
- **Investigation timeline** with visual progression and milestone tracking

### 🤖 **Live Threat Monitoring**
- **Real-time botnet tracking** with network visualization
- **Malware intelligence** and IOC correlation
- **Threat feed integration** with automated updates

### 👁️ **OSINT Exploration Tools**
- **Advanced Google dorking** with reconnaissance capabilities
- **Intelligence gathering** from open sources
- **Data correlation and analysis** tools

### 📚 **Beginner-Friendly Guide**
- **Interactive learning mode** with step-by-step tutorials
- **Cybersecurity education** tailored for different skill levels
- **Best practices and methodology** guidance

### 🧭 **Quick Navigation System**
- **Visual navigation grid** with feature descriptions
- **One-click access** to all major sections
- **Active state tracking** and intuitive user flow
- **Pro tips and guidance** for optimal usage

## 🚀 Deployment

This application is **optimized for instant Vercel deployment** and serves as the single entry-point for the unified Salem Cyber Vault experience.

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
