# Salem Cyber Vault - Cybersecurity Intelligence Platform

Salem Cyber Vault is a Halloween-themed Next.js 15 cybersecurity monitoring dashboard built with React 19, TypeScript, and Tailwind CSS. The application integrates with multiple cybersecurity APIs including CVEDB, Shodan, VirusTotal, AbuseIPDB, GreyNoise, and Google Custom Search to provide comprehensive threat intelligence.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Required Setup and Dependencies
- Install pnpm globally: `npm install -g pnpm`
- Install dependencies: `pnpm install` -- takes 80 seconds. NEVER CANCEL. Set timeout to 3+ minutes.
- **CRITICAL**: The application requires network access to external cybersecurity APIs. All API calls will fail in environments with restricted internet access.

### Build and Development Commands
- **Build**: `pnpm run build` -- takes 26 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
  - **IMPORTANT**: Google Fonts are disabled due to network restrictions. Uses system fonts instead.
  - Build succeeds with ESLint and TypeScript errors ignored (configured in next.config.mjs)
- **Development server**: `pnpm run dev` -- starts in 2 seconds on http://localhost:3000
- **Production server**: `pnpm run start` -- starts in 0.5 seconds (requires build first)
- **Linting**: `pnpm run lint` -- takes 5 seconds, will show many errors but build ignores them

### Validation and Testing
- **ALWAYS manually test the application after making changes** by running `pnpm run dev` and opening http://localhost:3000
- **Test all six main tabs**: Search, CVE Intel, Threat Map, Botnets, Dorking, Guide
- **Expected behavior in restricted environments**: 
  - UI loads and functions correctly
  - API calls to external services (CVEDB, Shodan, etc.) will fail with `net::ERR_BLOCKED_BY_CLIENT` errors
  - Application gracefully handles API failures and shows default/empty states
- **Functional UI validation**:
  - Tab navigation works
  - Forms and buttons are responsive
  - Dark theme renders properly
  - Halloween-themed animations and particles display

## Architecture and Key Files

### Main Application Structure
```
app/
├── page.tsx          # Main dashboard with tabbed interface
├── layout.tsx        # Root layout with dark theme
└── globals.css       # Global styles

components/
├── comprehensive-cve-intelligence-panel.tsx  # CVE analysis
├── threat-world-map.tsx                      # Global threat visualization
├── search-interface.tsx                      # Shodan search interface
├── live-botnet-tracker.tsx                  # Botnet monitoring
├── google-dork-explorer.tsx                 # Google dorking tools
├── beginner-guide.tsx                       # Educational content
└── ui/                                      # Shadcn/ui components

lib/
├── comprehensive-cvedb-client.ts            # CVEDB API integration
├── advanced-shodan-client.ts                # Shodan API integration
├── api-integrations.ts                      # Multiple API integrations
└── utils.ts                                 # Utility functions
```

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, TypeScript 5, Tailwind CSS 3.4
- **Components**: Radix UI primitives with custom styling
- **Package Manager**: pnpm (required - do not use npm)
- **Icons**: Lucide React
- **Styling**: CSS Variables with dark theme

## Common Development Tasks

### Making UI Changes
1. Run `pnpm run dev` to start development server
2. Navigate to affected tab in the browser
3. Make changes to components in real-time
4. **Always test tab navigation and animations**
5. Verify dark theme consistency

### API Integration Work
- API clients are in `lib/` directory
- All APIs expect external network access
- Error handling is built-in for network failures
- **Test API integrations**: Check browser console for expected `net::ERR_BLOCKED_BY_CLIENT` errors in restricted environments

### Styling and Theme Changes
- Uses CSS variables defined in `app/globals.css`
- Dark theme is default and required
- Halloween color scheme: oranges, purples, dark backgrounds
- **Always maintain the spooky Halloween aesthetic**

### Component Development
- Use existing Radix UI patterns from `components/ui/`
- Follow the established component structure
- Include proper TypeScript types
- **Maintain accessibility** with proper ARIA labels

## Build and Deployment

### Local Development
- `pnpm run dev` for development server
- Hot reload works for all file changes
- ESLint errors are displayed but don't block development

### Production Build
- `pnpm run build` creates optimized production build
- Static optimization for all pages
- **Deployment ready**: Configured for Vercel deployment

### Linting and Code Quality
- `pnpm run lint` runs ESLint with Next.js config
- Many linting errors exist but are ignored during build
- **Do not fix existing lint errors unless specifically asked**

## Network and API Limitations

### Expected API Failures
- CVEDB API calls to `cvedb.shodan.io` will fail
- Shodan API calls to `api.shodan.io` will fail  
- Google Fonts loading will fail
- **This is normal behavior in restricted environments**

### Working Around Network Restrictions
- Application UI remains fully functional
- Default/fallback data is shown when APIs fail
- Error handling prevents crashes
- **Focus on UI and component functionality during development**

## Key Features to Understand

### Main Dashboard Tabs
1. **Search**: Shodan device/service search interface
2. **CVE Intel**: Comprehensive vulnerability intelligence
3. **Threat Map**: Global threat visualization with world map
4. **Botnets**: Live botnet tracking and analysis  
5. **Dorking**: Google dorking tools and techniques
6. **Guide**: Beginner cybersecurity education

### Critical Components
- **FloatingParticles** and **FloatingEyes**: Halloween-themed animations
- **ThreatWorldMap**: Interactive global threat visualization
- **ComprehensiveCVEIntelligencePanel**: Advanced CVE analysis with CVSS scoring
- **SearchInterface**: Shodan integration for device discovery

## Troubleshooting

### Common Issues
- **Font loading errors**: Expected, application uses fallback fonts
- **API timeout errors**: Expected in restricted environments
- **Build failures**: Usually due to missing dependencies, run `pnpm install`
- **ESLint errors**: Ignore unless specifically fixing linting issues

### Performance Considerations
- **NEVER CANCEL** long-running builds or installs
- Allow full completion of all operations
- Use appropriate timeouts (3+ minutes for installs, 5+ minutes for builds)

## Emergency Fixes

### If Application Won't Start
1. Delete `node_modules` and `.next` directories
2. Run `pnpm install` (allow 3+ minutes)
3. Run `pnpm run build` (allow 5+ minutes)
4. Run `pnpm run dev`

### If Fonts Cause Build Failures
- Fonts are already disabled in `app/layout.tsx`
- Uses `font-sans` class instead of Google Fonts
- **Do not re-enable Google Fonts** without verifying network access

**Remember: This is a cybersecurity application with Halloween theming. Maintain the spooky aesthetic and ensure all security-related features work correctly even when external APIs are unavailable.**