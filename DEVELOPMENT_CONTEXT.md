# SociallyFed Development Context - UNIFIED ARCHITECTURE

## 🎯 PROJECT OVERVIEW - INTEGRATED SYSTEM
You are working on SociallyFed, a sophisticated digital wellness platform that combines:
- **Privacy-first social media analysis** using the SociallyFed Pyramid framework
- **Professional counselor/client management** with real-time collaboration
- **Multi-tenant architecture** supporting individual, professional, and enterprise users
- **Hybrid deployment** options (cloud, on-premise, hybrid)

## 🏗️ UNIFIED ARCHITECTURE STRATEGY
**Current Phase**: Integrating two production-ready applications into unified system
- **Mobile App**: Sophisticated PWA (8.5/10 architecture score) with advanced features
- **Server App**: Production-ready .NET API with LLM integration and PostgreSQL
- **Integration Goal**: API Gateway connecting mobile → server with multi-tenancy

### Integration Architecture:
```
Mobile App → API Gateway → Server Services
                ↓
            Auth Service (JWT)
            Journal Service (PostgreSQL + Multi-tenant)
            LLM Service (Semantic Kernel + Ollama)
            Analytics Service (Background Jobs)
            Professional Services (Counselor/Client APIs)
```


## 📱 CURRENT DEVELOPMENT FOCUS: MOBILE (Server Integration & Professional Features)

### Repository Structure - MOBILE INTEGRATION FOCUS  
**Mobile/Client Repository** (Ionic 7 + React + TypeScript)
- **Tech Stack**: Ionic/React, Capacitor, PWA, IndexedDB, Firebase (transitioning to server)
- **Integration Purpose**:
  - Server API integration replacing Firebase-only patterns
  - Tenant-aware mobile configuration and switching  
  - Professional dashboard for counselor client management
  - Real-time collaboration enhanced for professional use
  - Environment-specific configuration for deployment flexibility

### Key Integration Components:
- **API Services**: Replace Firebase calls with server API integration
- **Tenant Management**: Multi-tenant configuration and switching
- **Professional UI**: Counselor dashboard, client management, progress tracking
- **Authentication Integration**: Server JWT flow replacing Firebase Auth
- **Environment Configuration**: Dynamic server endpoints for deployment models

### Current Mobile Integration Priorities:
1. **Server API Integration**
   - Replace Firebase storage with server API calls
   - Implement API Gateway communication layer
   - Add request/response transformation and caching
   - Error handling and offline queue management

2. **Tenant-Aware Configuration**
   - Multi-tenant mobile configuration system
   - Tenant switching UI and data isolation
   - Organization-level branding and customization
   - Tenant-specific feature flags and permissions

3. **Professional Dashboard Implementation**
   - Counselor client management interface
   - Client progress tracking and visualization
   - Data sharing controls and permissions
   - Professional communication and collaboration tools

4. **Enhanced Real-time Collaboration**
   - WebSocket integration with server for professional features
   - Live document sharing and editing
   - Presence indicators and notification system
   - Professional-grade collaboration workflows

5. **Environment-Specific Configuration**
   - Dynamic server endpoint configuration
   - Cloud/on-premise/hybrid deployment support
   - Feature detection and capability management
   - Deployment-specific optimizations

### Advanced Mobile Features (Preserve & Enhance):
- **PWA Capabilities**: Background sync, push notifications, offline functionality
- **ML Personalization**: Client-side pattern recognition and adaptive UI  
- **Performance Excellence**: 94/100 score with 70% memory optimization
- **Real-time Features**: WebSocket collaboration with enhanced professional capabilities
- **Security**: End-to-end encryption with granular privacy controls

### Mobile Architecture Strengths to Leverage:
- **Offline-First**: Complete functionality without connectivity
- **Advanced PWA**: Intelligent installation and app-like experience
- **ML Personalization**: Privacy-preserving client-side analytics
- **Real-time Collaboration**: WebSocket-based professional interaction
- **Multi-platform**: Web, iOS, Android with native optimizations


## 🔗 INTEGRATION COORDINATION REQUIREMENTS

### Multi-Tenancy Implementation:
- **Database Schema**: tenant_id columns on all user data tables
- **API Design**: Tenant-aware endpoints with /api/v1/tenants/{tenantId}/ pattern
- **Mobile Integration**: Tenant switching and configuration management
- **Data Isolation**: Row-level security and complete tenant separation

### Professional Services Features:
- **Counselor APIs**: Client management, progress tracking, reporting
- **Mobile Dashboard**: Professional interface for counselor workflow
- **Real-time Collaboration**: Enhanced WebSocket features for professional use
- **Data Sharing**: Granular permissions and privacy controls

### Environment Configuration:
- **Cloud Deployment**: Google Cloud Run + Firebase integration
- **On-Premise**: Docker Compose with local LLM (Ollama)
- **Hybrid**: Local LLM processing with cloud sync capabilities
- **Feature Flags**: Environment-specific feature management

### Business Model Support:
- **Individual Users**: Premium PWA experience with local AI processing
- **Professional Services**: Counselor/client management with real-time collaboration  
- **Enterprise**: Multi-tenant with SSO, white-label, and on-premise deployment

## 🎯 TODAY'S INTEGRATION SUCCESS CRITERIA

### Technical Integration:
- Mobile app communicates successfully with server APIs
- Multi-tenant data isolation working correctly
- Professional features functional for counselor/client scenarios
- Environment configuration supports target deployment model
- Integration tests passing for developed features

### Quality Standards:
- Maintain mobile app's 94/100 performance score
- Preserve server's enterprise-grade security and compliance
- Clean architecture patterns maintained in both applications
- Comprehensive error handling and user experience
- Complete documentation of integration decisions

## 📚 DEVELOPMENT CONTEXT FILES AVAILABLE

### Strategic Planning:
- `current_sprint.md` - Current unified architecture sprint status
- `daily_brief.md` - Today's integration priorities and tasks
- `strategic_architecture_assessment.md` - Complete strategic guidance

### Implementation Tracking:
- `implementation_log.md` - Historical progress and decisions
- `implementation_report_*.md` - Daily detailed progress reports

## 🚀 CLAUDE CODE INTEGRATION GUIDELINES

### Effective Prompting:
```
@claude Read DEVELOPMENT_CONTEXT.md and help me implement [specific integration feature]. 

Focus on:
1. [Mobile-server integration point]
2. [Multi-tenant consideration] 
3. [Professional services requirement]
4. [Environment configuration need]

Ensure this aligns with our unified architecture strategy.
```

### Integration Development Workflow:
1. **Read Context**: Always start with DEVELOPMENT_CONTEXT.md
2. **Check Dependencies**: Understand mobile-server coordination needs
3. **Implement Features**: Focus on integration and multi-tenancy
4. **Test Integration**: Validate cross-application functionality
5. **Document Decisions**: Update implementation reports

### Code Quality Standards:
- Follow existing architectural patterns in each application
- Maintain performance standards (mobile: 94/100, server: <200ms APIs)
- Implement comprehensive error handling
- Add integration tests for new functionality
- Document integration decisions and trade-offs


## 📋 CURRENT SESSION CONTEXT

📊 Current session context:
## Session Started: Thu 28 Aug 2025 04:32:03 AEST
**Project Focus**: SociallyFed Mobile App
**Repository**: /home/ben/Development/sociallyfed-mobile

### Today's Brief:
# SociallyFed Mobile PWA - Daily Implementation Brief
## Date: August 28, 2025
## Developer: Junior Developer  
## Assigned by: Senior Developer
## Sprint Goal: Fix Authentication Flow & Configuration Service

---

## 🎯 Today's Implementation Priorities

**Mission Critical:** Fix the authentication flow so users can successfully log in via Google on the mobile PWA.

### Priority Order (Complete in this sequence):
1. **[P0 - URGENT]** Fix `isSimplifiedFlagEnabled` error blocking the app
2. **[P0 - URGENT]** Resolve Cross-Origin Policy issues for OAuth
3. **[P1 - HIGH]** Implement proper mobile platform detection
4. **[P1 - HIGH]** Update authentication flow to use redirect for mobile
5. **[P2 - MEDIUM]** Add debug utilities for testing

**Time Budget:** 8 hours
- 1 hour fixing config service
- 2 hours on COOP/OAuth issues  
- 2 hours on platform detection
- 2 hours on auth flow update
- 1 hour on testing & debugging

---

## 🔨 Specific Features to Build Today

### Feature 1: Fix Configuration Service (DO THIS FIRST!)
**File to Create:** `src/services/SociallyFedConfigService.js`

```javascript
// Copy this EXACTLY - this fixes the immediate error

class SociallyFedConfigService {
  constructor() {
    console.log('[CONFIG] Initializing SociallyFedConfigService');
    this.flags = {
      simplifiedMode: false,
      basicMode: false,
      forceMobilePlatform: true
    };
    
    // Load saved config from localStorage
    try {
      const saved = localStorage.getItem('sociallyfed_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.flags = { ...this.flags, ...parsed.flags };
        console.log('[CONFIG] Loaded saved config:', this.flags);
      }
    } catch (e) {
      console.log('[CONFIG] No saved config, using defaults');
    }
  }
  
  // THIS IS THE MISSING METHOD - Copy exactly!
  isSimplifiedFlagEnabled() {
    console.log('[CONFIG] isSimplifiedFlagEnabled called, returning:', this.flags.simplifiedMode);
    return this.flags.simplifiedMode || false;
  }
  
  // Add these helper methods too
  isBasicModeEnabled() {
    return this.flags.basicMode || false;
  }
  
  isMobilePlatform() {
    return this.flags.forceMobilePlatform || false;
  }
  
  setFlag(flagName, value) {
    this.flags[flagName] = value;
    this.saveConfig();
    console.log(`[CONFIG] Flag ${flagName} set to ${value}`);
  }
  
  saveConfig() {
    try {
      localStorage.setItem('sociallyfed_config', JSON.stringify({ flags: this.flags }));
    } catch (e) {
      console.error('[CONFIG] Failed to save config:', e);
    }
  }
  
  // Platform detection helper
  detectPlatform() {
    const ua = navigator.userAgent.toLowerCase();
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    
    if (isPWA) return 'pwa';
    if (isMobile) return 'mobile';
    return 'web';
  }
}

// Create the singleton instance
const configService = new SociallyFedConfigService();

// IMPORTANT: Expose to window so the app can find it
window.SociallyFedConfigService = configService;

// Also export for module usage
export default configService;

console.log('[CONFIG] SociallyFedConfigService attached to window');
```

**Then import it in your main App.js or index.js:**
```javascript
// At the top of App.js or index.js
import './services/SociallyFedConfigService';
// This ensures it loads and attaches to window
```

### Feature 2: Fix Cross-Origin Policy Issues
**File:** `public/index.html`

Add these lines in the `<head>` section (around line 5-10):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- ADD THESE NEW LINES FOR OAUTH FIX -->
    <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">
    <meta http-equiv="Cross-Origin-Embedder-Policy" content="credentialless">
    <meta http-equiv="Permissions-Policy" content="interest-cohort=()">
    <!-- END OF NEW LINES -->
    
    <meta name="theme-color" content="#000000" />
    <!-- rest of your head content -->
```

### Feature 3: Platform Detection Service
**File to Create:** `src/utils/platformDetection.js`

```javascript
// This properly detects if we're on mobile/PWA/web

const PlatformDetection = {
  // Check if running as installed PWA
  isPWA() {
    // Multiple ways to detect PWA
    const checks = [
      window.matchMedia('(display-mode: standalone)').matches,
      window.navigator.standalone === true,
      document.referrer.includes('android-app://'),
      window.matchMedia('(display-mode: fullscreen)').matches,
      window.matchMedia('(display-mode: minimal-ui)').matches
    ];
    
    const result = checks.some(check => check === true);
    console.log('[PLATFORM] PWA detection:', result, checks);
    return result;
  },
  
  // Check if on mobile device
  isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check for mobile user agents
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i;
    const isMobileUA = mobileRegex.test(userAgent);
    
    // Also check screen size
    const isMobileScreen = window.screen.width <= 768;
    
    // Check for touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const result = isMobileUA || (isMobileScreen && hasTouch);
    console.log('[PLATFORM] Mobile detection:', result, {
      userAgent: isMobileUA,
      screen: isMobileScreen,
      touch: hasTouch
    });
    
    return result;
  },
  
  // Get the platform type
  getPlatform() {
    if (this.isPWA()) return 'pwa';
    if (this.isMobile()) return 'mobile';
    return 'web';
  },
  
  // Get all platform info for debugging
  getInfo() {
    const info = {
      platform: this.getPlatform(),
      isPWA: this.isPWA(),
      isMobile: this.isMobile(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      hasTouch: 'ontouchstart' in window,
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
    };
    
    console.log('[PLATFORM] Full platform info:', info);
    return info;
  }
};

// Auto-detect on load
window.addEventListener('load', () => {
  console.log('[PLATFORM] Initial detection:', PlatformDetection.getInfo());
});

export default PlatformDetection;
```

### Feature 4: Updated Authentication Service
**File to Update/Create:** `src/services/authService.js`

```javascript
// Complete auth service with mobile redirect support

import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { app } from './firebase'; // Your Firebase app
import PlatformDetection from '../utils/platformDetection';

class AuthService {
  constructor() {
    this.auth = getAuth(app);
    this.serverUrl = 'https://sociallyfed-server-a5kcra27d6o-uc.a.run.app';
    
    // Check for redirect result on page load
    this.checkRedirectResult();
  }
  
  // Check if we're returning from a redirect sign-in
  async checkRedirectResult() {
    try {
      console.log('[AUTH] Checking for redirect result...');
      const result = await getRedirectResult(this.auth);
      
      if (result && result.user) {
        console.log('[AUTH] ✅ Redirect sign-in successful:', result.user.email);
        await this.handleSuccessfulAuth(result.user);
        return result.user;
      }
    } catch (error) {
      console.error('[AUTH] Redirect result error:', error);
    }
    return null;
  }
  
  // Main sign-in method
  async signInWithGoogle() {
    console.log('[AUTH] Starting Google sign-in...');
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account' // Always show account chooser
    });
    
    // Determine which method to use
    const platform = PlatformDetection.getPlatform();
    console.log('[AUTH] Platform detected:', platform);
    
    try {
      let result;
      
      if (platform === 'pwa' || platform === 'mobile') {
        // Use redirect for mobile/PWA (popups often blocked)
        console.log('[AUTH] Using redirect flow for mobile/PWA');
        
        // Store a flag so we know we initiated sign-in
        localStorage.setItem('auth_redirect_pending', 'true');
        
        // This will redirect away from the app
        await signInWithRedirect(this.auth, provider);
        // Code won't reach here - browser redirects
        
      } else {
        // Use popup for desktop
        console.log('[AUTH] Using popup flow for desktop');
        result = await signInWithPopup(this.auth, provider);
        
        if (result && result.user) {
          console.log('[AUTH] ✅ Popup sign-in successful:', result.user.email);
          await this.handleSuccessfulAuth(result.user);
          return result.user;
        }
      }
      
    } catch (error) {
      console.error('[AUTH] Sign-in error:', error);
      
      // Handle specific errors
      if (error.code === 'auth/popup-blocked') {
        console.log('[AUTH] Popup blocked, falling back to redirect');
        localStorage.setItem('auth_redirect_pending', 'true');
        await signInWithRedirect(this.auth, provider);
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('[AUTH] User cancelled the popup');
      } else {
        throw error;
      }
    }
  }
  
  // Handle successful authentication
  async handleSuccessfulAuth(user) {
    console.log('[AUTH] Processing successful authentication...');
    
    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      console.log('[AUTH] Got Firebase ID token, length:', idToken.length);
      
      // Exchange with your server
      const response = await fetch(`${this.serverUrl}/api/auth/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Platform': PlatformDetection.getPlatform()
        },
        body: JSON.stringify({
          token: idToken,
          platform: PlatformDetection.getPlatform(),
          email: user.email,
          uid: user.uid
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('[AUTH] ✅ Token exchange successful');
        
        // Store session info
        localStorage.setItem('session_token', data.sessionToken);
        localStorage.setItem('user_id', data.userId);
        localStorage.setItem('user_email', user.email);
        localStorage.removeItem('auth_redirect_pending');
        
        // Trigger any auth state change handlers
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { user: user, session: data } 
        }));
        
        return data;
      } else {
        console.error('[AUTH] ❌ Token exchange failed:', data);
        throw new Error(data.error || 'Token exchange failed');
      }
      
    } catch (error) {
      console.error('[AUTH] Error in handleSuccessfulAuth:', error);
      throw error;
    }
  }
  
  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }
  
  // Sign out
  async signOut() {
    try {
      await firebaseSignOut(this.auth);
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      console.log('[AUTH] Signed out successfully');
      
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { user: null } 
      }));
    } catch (error) {
      console.error('[AUTH] Sign out error:', error);
    }
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!this.auth.currentUser || !!localStorage.getItem('session_token');
  }
}

// Create singleton
const authService = new AuthService();

// Expose for debugging
window.authService = authService;

export default authService;
```

### Feature 5: Debug Utilities
**File to Create:** `src/utils/debug.js`

```javascript
// Debug utilities - import this in index.js to have it available

const Debug = {
  // Check all services
  checkServices() {
    console.log('=== Service Status ===');
    console.log('ConfigService:', typeof window.SociallyFedConfigService);
    console.log('AuthService:', typeof window.authService);
    console.log('Platform:', typeof window.PlatformDetection);
    
    if (window.SociallyFedConfigService) {
      console.log('Config.isSimplifiedFlagEnabled:', 
        typeof window.SociallyFedConfigService.isSimplifiedFlagEnabled);
    }
  },
  
  // Test configuration
  testConfig() {
    if (!window.SociallyFedConfigService) {
      console.error('❌ ConfigService not found!');
      return;
    }
    
    console.log('=== Config Test ===');
    console.log('Simplified:', window.SociallyFedConfigService.isSimplifiedFlagEnabled());
    console.log('BasicMode:', window.SociallyFedConfigService.isBasicModeEnabled());
    console.log('Platform:', window.SociallyFedConfigService.detectPlatform());
  },
  
  // Test authentication
  async testAuth() {
    console.log('=== Auth Test ===');
    
    if (!window.authService) {
      console.error('❌ AuthService not found!');
      return;
    }
    
    const user = window.authService.getCurrentUser();
    if (user) {
      console.log('✅ User signed in:', user.email);
      const token = await user.getIdToken();
      console.log('Token preview:', token.substring(0, 50) + '...');
    } else {
      console.log('❌ No user signed in');
    }
  },
  
  // Platform info
  platformInfo() {
    console.log('=== Platform Info ===');
    if (window.PlatformDetection) {
      return window.PlatformDetection.getInfo();
    } else {
      console.log('User Agent:', navigator.userAgent);
      console.log('Screen:', window.screen.width + 'x' + window.screen.height);
      console.log('PWA:', window.matchMedia('(display-mode: standalone)').matches);
    }
  },
  
  // Clear all data
  clearAll() {
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ All storage cleared');
  },
  
  // Run all tests
  runAll() {
    this.checkServices();
    this.testConfig();
    this.testAuth();
    this.platformInfo();
  }
};

// Attach to window
window.Debug = Debug;

// Auto-run check on load
setTimeout(() => {
  console.log('Debug utilities loaded. Use window.Debug.* commands');
  Debug.checkServices();
}, 1000);

export default Debug;
```

---

## 📋 Technical Requirements

### Required Package Versions:
```json
{
  "dependencies": {
    "firebase": "^10.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### Install if missing:
```bash
npm install firebase@latest
```

### Firebase Configuration:
**File:** `src/services/firebase.js`
```javascript
// Make sure this file exists with your config
import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDYR9IdLUmLVBnq4RwcM6fX8JpE5EI8Bls",
  authDomain: "sociallyfed-55780.firebaseapp.com",
  projectId: "sociallyfed-55780",
  storageBucket: "sociallyfed-55780.appspot.com",
  messagingSenderId: "512204327023",
  appId: "1:512204327023:web:4682c5db3d42b5e1011468"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use local storage instead of session storage
setPersistence(auth, browserLocalPersistence);

export { app, auth };
```

### Import Order in Main App:
**File:** `src/App.js` or `src/index.js`
```javascript
// Import in this exact order at the top of your main file
import './services/SociallyFedConfigService'; // Must be first!
import './services/firebase';
import './utils/debug';
import authService from './services/authService';
import PlatformDetection from './utils/platformDetection';

// Your other imports...
```

---

## 🔌 Integration Points to Consider

### 1. Login Component Integration
Update your login button to use the new auth service:
```javascript
// In your Login component
import authService from '../services/authService';

const handleLogin = async () => {
  try {
    setLoading(true);
    await authService.signInWithGoogle();
    // Redirect handled automatically
  } catch (error) {
    console.error('Login failed:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 2. App State Management
Listen for auth changes:
```javascript
// In your main App component
useEffect(() => {
  const handleAuthChange = (event) => {
    if (event.detail.user) {
      // User logged in
      setUser(event.detail.user);
      navigate('/dashboard'); // or wherever
    } else {
      // User logged out
      setUser(null);
      navigate('/login');
    }
  };
  
  window.addEventListener('authStateChanged', handleAuthChange);
  
  return () => {
    window.removeEventListener('authStateChanged', handleAuthChange);
  };
}, []);
```

### 3. Protected Routes
Check authentication before rendering:
```javascript
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};
```

---

## ✅ Definition of Done for Today's Work

### Test Checklist - ALL must pass:

#### 1. **Config Service Working**
Open browser console and run:
```javascript
// This should NOT throw an error:
window.SociallyFedConfigService.isSimplifiedFlagEnabled()
// Should return: false (or true, but no error)
```

#### 2. **No COOP Warnings**
- Open Chrome DevTools Console
- Navigate to login page
- Click "Sign in with Google"
- Should see NO warnings about third-party cookies or COOP

#### 3. **Platform Detection Correct**
On mobile device or PWA:
```javascript
window.Debug.platformInfo()
// Should show platform: 'mobile' or 'pwa', not 'web'
```

#### 4. **Authentication Flow Works**
Test both desktop and mobile:
- Desktop: Should open Google popup
- Mobile: Should redirect to Google, then back
- After sign-in: localStorage should have `session_token`

#### 5. **Debug Utilities Available**
```javascript
// All these should work:
window.Debug.runAll()
window.Debug.testAuth()
window.Debug.testConfig()
```

#### 6. **Server Integration**
After successful Google sign-in:
- Network tab should show POST to `/api/auth/exchange`
- Response should be 200 OK
- localStorage should contain `session_token` and `user_id`

### Visual Confirmation:
- [ ] Login page loads without errors
- [ ] Google sign-in button is clickable
- [ ] Sign-in completes successfully
- [ ] User is redirected to app after sign-in
- [ ] No red errors in console

---

## 🚨 If You Get Stuck

### Quick Fixes for Common Issues:

**Issue 1: "isSimplifiedFlagEnabled is not a function"**
- Make sure `SociallyFedConfigService.js` is imported in your main App.js
- Check console for "[CONFIG] SociallyFedConfigService attached to window"

**Issue 2: "Firebase is not defined"**
```bash
npm install firebase
```

**Issue 3: Popup blocked on mobile**
- This is expected! The code should automatically fall back to redirect
- Check that redirect flow is working

**Issue 4: 401 from server**
- The server team is fixing this today
- For now, authentication might fail at the exchange step
- Focus on fixing the client-side errors first

**Issue 5: "Cannot read property 'auth' of undefined"**
- Make sure firebase.js exports the auth object
- Check import statements match exactly

### Testing Sequence:
1. First, fix the config service error
2. Open browser console, run: `window.Debug.checkServices()`
3. All services should be defined
4. Then test login flow

### Emergency Bypass (Development Only):
```javascript
// Add to console if you need to bypass auth temporarily:
localStorage.setItem('session_token', 'dev_token_123');
localStorage.setItem('user_id', 'dev_user');
window.location.reload();
```

---

## 📝 End of Day Checklist

Before you finish:
1. [ ] All error messages in console are resolved
2. [ ] Config service error is fixed
3. [ ] Platform detection shows correct platform
4. [ ] OAuth flow works (popup or redirect)
5. [ ] Code committed to git with clear commit messages
6. [ ] Brief status update in team Slack

### Commit your work:
```bash
git add .
git commit -m "fix: resolve config service and OAuth flow issues

- Added missing isSimplifiedFlagEnabled method
- Implemented platform detection for mobile/PWA
- Updated auth flow to use redirect on mobile
- Added COOP headers for OAuth compatibility"

git push origin your-branch-name
```

### Build and Deploy (only if everything works):
```bash
# Build the app
npm run build

# Test the build locally
npx serve -s build -l 3000

# Deploy to Cloud Run
gcloud run deploy sociallyfed-mobile \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated
```

---

## 🎯 Success Metrics

You know you're done when:
1. **Zero console errors** on the login page
2. **Platform shows as 'mobile'** on mobile devices
3. **Google sign-in completes** without errors
4. **Debug utilities work** in console
5. **Can sign in and out** repeatedly without issues

Remember: Focus on fixing the immediate blocker (config service) first, then work through the other issues in order. Ask for help if you're stuck for more than 30 minutes on any issue!
### Current Sprint:
# Current Sprint Status - Terra API Integration & Professional Services Enhancement

## Sprint Overview
**Previous Sprint:** Unified Architecture Deployment ✅ **COMPLETED**  
**Current Phase:** **TERRA API INTEGRATION & WELLNESS PROFESSIONAL FEATURES** (Week 1)  
**Phase Duration:** January 13-19, 2025 (7 days)  
**Current Day:** Day 2 (January 14, 2025) **🔧 INTEGRATION & BUILD FIX DAY**  
**Phase Health:** 🟡 **CRITICAL ISSUES** - Server build blocked, mobile ready to integrate

---

## 📊 **DAY 1 PROGRESS SUMMARY**

### **✅ Mobile Achievements (100% Day 1-2 Objectives)**
- Terra Service implementation with OAuth flow complete
- PWA-compatible widget integration supporting 11+ providers
- Health data caching with 5-minute TTL implemented
- Terra Health Widget component (full and compact views)
- Database migration to v2 with Terra tables
- 100% test coverage on new Terra code
- OAuth success/error pages implemented

### **⚠️ Server Progress (85% Complete, Build Blocked)**
- Terra webhook controller implemented with HMAC validation
- Database schema migration executed successfully
- Redis caching configured with intelligent TTL
- Professional service interface extended (8 methods pending implementation)
- Hangfire background processing integrated
- AI correlation engine built (Pearson only)
- **BLOCKING ISSUE**: Build compilation errors preventing deployment

---

## 🎯 **DAY 2 OBJECTIVES - JANUARY 14, 2025**

### **🔴 CRITICAL PATH (Must Complete by 12:00)**

#### **Server Team - Fix Build Issues**
```csharp
// IMMEDIATE FIXES REQUIRED:
1. Type ambiguity: Use fully qualified Models.Terra.HealthCorrelation
2. Implement 8 missing ProfessionalService methods
3. Add missing using statements for Hangfire
4. Configure Terra API environment variables
5. Commit all code changes to prevent loss
```

#### **Mobile Team - API Gateway Integration**
```typescript
// BLOCKED UNTIL SERVER BUILD FIXED:
1. Create TerraAPIGateway service class
2. Implement webhook registration flow
3. Configure health data sync with retry logic
4. Set up error handling and offline queue
5. Add telemetry for API monitoring
```

### **📱 Mobile Integration Priorities**

#### **1. API Gateway Development** (After Server Fix)
- [ ] TerraAPIGateway service implementation
- [ ] Webhook registration on Terra connection
- [ ] Health data sync with exponential backoff
- [ ] Professional route authentication
- [ ] Request/response interceptors

#### **2. Multi-Tenant Database** (In Progress)
- [ ] Migrate to IndexedDB v3 with tenant support
- [ ] Add ClientCoachMapping table
- [ ] Implement data partitioning
- [ ] Create coach permission checks
- [ ] Add HIPAA consent tracking

#### **3. WebSocket Integration** (Afternoon)
- [ ] SignalR client for health updates
- [ ] Real-time event handlers
- [ ] Connection state management
- [ ] Offline message queue
- [ ] Health alert notifications

#### **4. Journal Enhancement** (In Progress)
- [ ] Integrate TerraHealthWidget into FinishJournal
- [ ] Add health context to mood submissions
- [ ] Create opt-in/opt-out toggle
- [ ] Display health-mood correlations
- [ ] Test data submission flow

### **🖥️ Server Priorities**

#### **1. Build Fix** (CRITICAL - Morning)
- [ ] Resolve type ambiguity issues
- [ ] Implement 8 ProfessionalService methods
- [ ] Add missing using statements
- [ ] Achieve clean compilation
- [ ] Run integration tests

#### **2. Smart Correlation** (ENHANCED - Afternoon)
- [ ] Implement Spearman correlation alongside Pearson
- [ ] Create SmartCorrelation class
- [ ] Add pattern detection logic
- [ ] Generate user-friendly interpretations
- [ ] Integrate with health analysis

#### **3. Environment Configuration** (HIGH)
- [ ] Configure Terra API credentials
- [ ] Set up Redis connection
- [ ] Configure Hangfire queues
- [ ] Set rate limiting parameters
- [ ] Update CORS settings

#### **4. Integration Testing** (Afternoon)
- [ ] End-to-end webhook flow
- [ ] Professional access validation
- [ ] Correlation calculation tests
- [ ] Performance benchmarks
- [ ] Security validation

---

## 🔄 **COORDINATION TIMELINE - DAY 2**

```mermaid
gantt
    title Day 2 Integration Timeline
    dateFormat HH:mm
    axisFormat %H:%M
    
    section Server
    Fix Build Issues        :crit, s1, 09:00, 2h
    Professional Methods    :crit, s2, after s1, 1h
    Environment Config      :s3, 11:00, 30m
    Smart Correlation       :s4, 13:00, 2h
    Integration Tests       :s5, 15:00, 1h
    
    section Mobile
    Wait for Server Fix     :crit, m1, 09:00, 2h
    API Gateway Setup       :crit, m2, after m1, 1h
    WebSocket Integration   :m3, 13:00, 2h
    Journal Enhancement     :m4, 14:00, 1h
    E2E Testing            :m5, 15:00, 1h
    
    section Joint
    Integration Sync        :milestone, 11:00, 0h
    API Testing            :j1, 14:00, 1h
    Performance Validation  :j2, 16:00, 30m
    Deployment Prep        :j3, 16:30, 30m
```

---

## ✅ **DEFINITION OF DONE - DAY 2**

### **Critical Requirements** (MUST HAVE by 17:00)
- [x] **Server Build**: Clean compilation achieved
- [ ] **Professional Methods**: All 8 methods implemented
- [ ] **Webhook Processing**: End-to-end test successful
- [ ] **Mobile Integration**: API Gateway connected
- [ ] **Journal Enhancement**: Health context working
- [ ] **Database Migration**: v3 with tenant support
- [ ] **Code Committed**: All changes in version control

### **Quality Gates** (MUST PASS)
- [ ] **Performance**: <500ms webhook, <1s API responses
- [ ] **Security**: HMAC validation, RLS policies active
- [ ] **Testing**: >80% coverage on new code
- [ ] **Documentation**: API endpoints documented
- [ ] **Monitoring**: Logging configured

### **Enhanced Features** (SHOULD COMPLETE)
- [ ] **Smart Correlation**: Spearman + Pearson working
- [ ] **WebSocket**: Real-time updates functional
- [ ] **Caching**: Redis with intelligent invalidation
- [ ] **Offline Queue**: Mobile resilience implemented
- [ ] **Telemetry**: API monitoring active

---

## 📊 **WEEK 1 UPDATED METRICS**

### **Progress Tracking**
| Component | Day 1 Target | Day 1 Actual | Day 2 Target | Status |
|-----------|-------------|--------------|--------------|--------|
| Mobile Terra Service | 100% | 100% ✅ | API Integration | 🟢 On Track |
| Server Webhook | 100% | 85% ⚠️ | Fix + Complete | 🔴 Blocked |
| Database Schema | 100% | 100% ✅ | v3 Migration | 🟢 Ready |
| UI Components | 50% | 60% ✅ | Journal Integration | 🟢 Ahead |
| Professional APIs | 50% | 40% ⚠️ | 100% Complete | 🟡 At Risk |
| Testing | 50% | 80% ✅ | E2E Complete | 🟢 Ahead |

### **Risk Assessment Update**
| Risk | Level | Status | Mitigation |
|------|-------|--------|------------|
| Server Build Failure | 🔴 HIGH | Active | Pair programming, 2-hour timebox |
| API Integration Delay | 🟡 MEDIUM | Pending | Mobile using mock data temporarily |
| Terra API Limits | 🟢 LOW | Monitored | Rate limiting implemented |
| Data Security | 🟢 LOW | Controlled | Encryption verified |

### **Performance Metrics**
- **Mobile Bundle**: +47KB (under 50KB target ✅)
- **API Response**: Pending (server build blocked)
- **Webhook Processing**: Pending (needs testing)
- **Cache Hit Rate**: Not measured yet
- **Test Coverage**: 92% mobile, pending server

---

## 🚨 **BLOCKING ISSUES & RESOLUTIONS**

### **Issue #1: Server Build Compilation Errors**
**Impact**: Blocks all server testing and deployment  
**Resolution**: 
1. Fix type ambiguity with fully qualified names (30 min)
2. Implement 8 ProfessionalService methods (90 min)
3. Add missing using statements (15 min)
**Owner**: Server team  
**Deadline**: 11:00 AM

### **Issue #2: Mobile-Server Integration Blocked**
**Impact**: Mobile cannot test real API integration  
**Resolution**: 
1. Use mock data until server fixed (temporary)
2. Prepare integration tests for quick validation
3. Have fallback to sandbox environment
**Owner**: Mobile team  
**Deadline**: Unblocked by 11:00 AM

### **Issue #3: Uncommitted Code Risk**
**Impact**: Potential code loss from both teams  
**Resolution**: 
1. Immediate commit of all changes
2. Create feature branches for WIP
3. Set up hourly auto-commit reminder
**Owner**: Both teams  
**Deadline**: IMMEDIATE

---

## 📈 **EXPECTED DAY 2 OUTCOMES**

### **By Noon (12:00)**
- ✅ Server build compiling cleanly
- ✅ Professional methods implemented
- ✅ Mobile API Gateway ready
- ✅ Initial integration test passing

### **By Close of Business (17:00)**
- ✅ End-to-end Terra flow functional
- ✅ Journal entries with health context
- ✅ Coach dashboard with basic health view
- ✅ Smart correlation (Pearson + Spearman)
- ✅ All code committed and documented

### **Stretch Goals (If Time Permits)**
- 🎯 WebSocket real-time updates
- 🎯 Advanced correlation visualizations
- 🎯 Offline queue implementation
- 🎯 Performance optimizations
- 🎯 Staging deployment

---

## 🔮 **WEEK 1 REMAINING SCHEDULE**

### **Day 3-4: UI Polish & Professional Features (Jan 15-16)**
- Complete coach dashboard enhancements
- Implement correlation visualizations
- Add health trend analysis
- Create wellness plan generation
- Implement alert system

### **Day 5: Advanced Integration (Jan 17)**
- Group analytics for coaches
- Bulk client operations
- Export functionality
- Advanced AI insights
- Performance optimization

### **Day 6-7: Testing & Deployment (Jan 18-19)**
- Comprehensive E2E testing
- Load testing with 100+ users
- Security audit
- Production deployment
- Beta user onboarding

---

**Last Updated**: January 14, 2025 06:00 AM - **DAY 2: INTEGRATION & BUILD FIX**  
**Sprint Health**: 🟡 **CRITICAL** - Server build blocking progress  
**Critical Path**: Fix build → Complete APIs → Integration testing → Coach features  
**Day 2 Target**: Unblock server, complete integration, test E2E flow  
**Business Impact**: On track for wellness professional MVP if issues resolved by noon

---

*Generated: January 14, 2025 - Terra API Integration Sprint - Day 2*  
*Priority Level: CRITICAL - Build issues must be resolved*  
*Success Probability: 85% - Clear path once build fixed*  
*Architecture Leverage: Still achieving 95% infrastructure reuse*  
*Beta Readiness: Friday target achievable with focused execution*

## 📅 TODAY'S DEVELOPMENT BRIEF

# SociallyFed Mobile PWA - Daily Implementation Brief
## Date: August 28, 2025
## Developer: Junior Developer  
## Assigned by: Senior Developer
## Sprint Goal: Fix Authentication Flow & Configuration Service

---

## 🎯 Today's Implementation Priorities

**Mission Critical:** Fix the authentication flow so users can successfully log in via Google on the mobile PWA.

### Priority Order (Complete in this sequence):
1. **[P0 - URGENT]** Fix `isSimplifiedFlagEnabled` error blocking the app
2. **[P0 - URGENT]** Resolve Cross-Origin Policy issues for OAuth
3. **[P1 - HIGH]** Implement proper mobile platform detection
4. **[P1 - HIGH]** Update authentication flow to use redirect for mobile
5. **[P2 - MEDIUM]** Add debug utilities for testing

**Time Budget:** 8 hours
- 1 hour fixing config service
- 2 hours on COOP/OAuth issues  
- 2 hours on platform detection
- 2 hours on auth flow update
- 1 hour on testing & debugging

---

## 🔨 Specific Features to Build Today

### Feature 1: Fix Configuration Service (DO THIS FIRST!)
**File to Create:** `src/services/SociallyFedConfigService.js`

```javascript
// Copy this EXACTLY - this fixes the immediate error

class SociallyFedConfigService {
  constructor() {
    console.log('[CONFIG] Initializing SociallyFedConfigService');
    this.flags = {
      simplifiedMode: false,
      basicMode: false,
      forceMobilePlatform: true
    };
    
    // Load saved config from localStorage
    try {
      const saved = localStorage.getItem('sociallyfed_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.flags = { ...this.flags, ...parsed.flags };
        console.log('[CONFIG] Loaded saved config:', this.flags);
      }
    } catch (e) {
      console.log('[CONFIG] No saved config, using defaults');
    }
  }
  
  // THIS IS THE MISSING METHOD - Copy exactly!
  isSimplifiedFlagEnabled() {
    console.log('[CONFIG] isSimplifiedFlagEnabled called, returning:', this.flags.simplifiedMode);
    return this.flags.simplifiedMode || false;
  }
  
  // Add these helper methods too
  isBasicModeEnabled() {
    return this.flags.basicMode || false;
  }
  
  isMobilePlatform() {
    return this.flags.forceMobilePlatform || false;
  }
  
  setFlag(flagName, value) {
    this.flags[flagName] = value;
    this.saveConfig();
    console.log(`[CONFIG] Flag ${flagName} set to ${value}`);
  }
  
  saveConfig() {
    try {
      localStorage.setItem('sociallyfed_config', JSON.stringify({ flags: this.flags }));
    } catch (e) {
      console.error('[CONFIG] Failed to save config:', e);
    }
  }
  
  // Platform detection helper
  detectPlatform() {
    const ua = navigator.userAgent.toLowerCase();
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    
    if (isPWA) return 'pwa';
    if (isMobile) return 'mobile';
    return 'web';
  }
}

// Create the singleton instance
const configService = new SociallyFedConfigService();

// IMPORTANT: Expose to window so the app can find it
window.SociallyFedConfigService = configService;

// Also export for module usage
export default configService;

console.log('[CONFIG] SociallyFedConfigService attached to window');
```

**Then import it in your main App.js or index.js:**
```javascript
// At the top of App.js or index.js
import './services/SociallyFedConfigService';
// This ensures it loads and attaches to window
```

### Feature 2: Fix Cross-Origin Policy Issues
**File:** `public/index.html`

Add these lines in the `<head>` section (around line 5-10):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- ADD THESE NEW LINES FOR OAUTH FIX -->
    <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">
    <meta http-equiv="Cross-Origin-Embedder-Policy" content="credentialless">
    <meta http-equiv="Permissions-Policy" content="interest-cohort=()">
    <!-- END OF NEW LINES -->
    
    <meta name="theme-color" content="#000000" />
    <!-- rest of your head content -->
```

### Feature 3: Platform Detection Service
**File to Create:** `src/utils/platformDetection.js`

```javascript
// This properly detects if we're on mobile/PWA/web

const PlatformDetection = {
  // Check if running as installed PWA
  isPWA() {
    // Multiple ways to detect PWA
    const checks = [
      window.matchMedia('(display-mode: standalone)').matches,
      window.navigator.standalone === true,
      document.referrer.includes('android-app://'),
      window.matchMedia('(display-mode: fullscreen)').matches,
      window.matchMedia('(display-mode: minimal-ui)').matches
    ];
    
    const result = checks.some(check => check === true);
    console.log('[PLATFORM] PWA detection:', result, checks);
    return result;
  },
  
  // Check if on mobile device
  isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check for mobile user agents
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i;
    const isMobileUA = mobileRegex.test(userAgent);
    
    // Also check screen size
    const isMobileScreen = window.screen.width <= 768;
    
    // Check for touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const result = isMobileUA || (isMobileScreen && hasTouch);
    console.log('[PLATFORM] Mobile detection:', result, {
      userAgent: isMobileUA,
      screen: isMobileScreen,
      touch: hasTouch
    });
    
    return result;
  },
  
  // Get the platform type
  getPlatform() {
    if (this.isPWA()) return 'pwa';
    if (this.isMobile()) return 'mobile';
    return 'web';
  },
  
  // Get all platform info for debugging
  getInfo() {
    const info = {
      platform: this.getPlatform(),
      isPWA: this.isPWA(),
      isMobile: this.isMobile(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      hasTouch: 'ontouchstart' in window,
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
    };
    
    console.log('[PLATFORM] Full platform info:', info);
    return info;
  }
};

// Auto-detect on load
window.addEventListener('load', () => {
  console.log('[PLATFORM] Initial detection:', PlatformDetection.getInfo());
});

export default PlatformDetection;
```

### Feature 4: Updated Authentication Service
**File to Update/Create:** `src/services/authService.js`

```javascript
// Complete auth service with mobile redirect support

import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { app } from './firebase'; // Your Firebase app
import PlatformDetection from '../utils/platformDetection';

class AuthService {
  constructor() {
    this.auth = getAuth(app);
    this.serverUrl = 'https://sociallyfed-server-a5kcra27d6o-uc.a.run.app';
    
    // Check for redirect result on page load
    this.checkRedirectResult();
  }
  
  // Check if we're returning from a redirect sign-in
  async checkRedirectResult() {
    try {
      console.log('[AUTH] Checking for redirect result...');
      const result = await getRedirectResult(this.auth);
      
      if (result && result.user) {
        console.log('[AUTH] ✅ Redirect sign-in successful:', result.user.email);
        await this.handleSuccessfulAuth(result.user);
        return result.user;
      }
    } catch (error) {
      console.error('[AUTH] Redirect result error:', error);
    }
    return null;
  }
  
  // Main sign-in method
  async signInWithGoogle() {
    console.log('[AUTH] Starting Google sign-in...');
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account' // Always show account chooser
    });
    
    // Determine which method to use
    const platform = PlatformDetection.getPlatform();
    console.log('[AUTH] Platform detected:', platform);
    
    try {
      let result;
      
      if (platform === 'pwa' || platform === 'mobile') {
        // Use redirect for mobile/PWA (popups often blocked)
        console.log('[AUTH] Using redirect flow for mobile/PWA');
        
        // Store a flag so we know we initiated sign-in
        localStorage.setItem('auth_redirect_pending', 'true');
        
        // This will redirect away from the app
        await signInWithRedirect(this.auth, provider);
        // Code won't reach here - browser redirects
        
      } else {
        // Use popup for desktop
        console.log('[AUTH] Using popup flow for desktop');
        result = await signInWithPopup(this.auth, provider);
        
        if (result && result.user) {
          console.log('[AUTH] ✅ Popup sign-in successful:', result.user.email);
          await this.handleSuccessfulAuth(result.user);
          return result.user;
        }
      }
      
    } catch (error) {
      console.error('[AUTH] Sign-in error:', error);
      
      // Handle specific errors
      if (error.code === 'auth/popup-blocked') {
        console.log('[AUTH] Popup blocked, falling back to redirect');
        localStorage.setItem('auth_redirect_pending', 'true');
        await signInWithRedirect(this.auth, provider);
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('[AUTH] User cancelled the popup');
      } else {
        throw error;
      }
    }
  }
  
  // Handle successful authentication
  async handleSuccessfulAuth(user) {
    console.log('[AUTH] Processing successful authentication...');
    
    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      console.log('[AUTH] Got Firebase ID token, length:', idToken.length);
      
      // Exchange with your server
      const response = await fetch(`${this.serverUrl}/api/auth/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Platform': PlatformDetection.getPlatform()
        },
        body: JSON.stringify({
          token: idToken,
          platform: PlatformDetection.getPlatform(),
          email: user.email,
          uid: user.uid
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('[AUTH] ✅ Token exchange successful');
        
        // Store session info
        localStorage.setItem('session_token', data.sessionToken);
        localStorage.setItem('user_id', data.userId);
        localStorage.setItem('user_email', user.email);
        localStorage.removeItem('auth_redirect_pending');
        
        // Trigger any auth state change handlers
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { user: user, session: data } 
        }));
        
        return data;
      } else {
        console.error('[AUTH] ❌ Token exchange failed:', data);
        throw new Error(data.error || 'Token exchange failed');
      }
      
    } catch (error) {
      console.error('[AUTH] Error in handleSuccessfulAuth:', error);
      throw error;
    }
  }
  
  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }
  
  // Sign out
  async signOut() {
    try {
      await firebaseSignOut(this.auth);
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      console.log('[AUTH] Signed out successfully');
      
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { user: null } 
      }));
    } catch (error) {
      console.error('[AUTH] Sign out error:', error);
    }
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!this.auth.currentUser || !!localStorage.getItem('session_token');
  }
}

// Create singleton
const authService = new AuthService();

// Expose for debugging
window.authService = authService;

export default authService;
```

### Feature 5: Debug Utilities
**File to Create:** `src/utils/debug.js`

```javascript
// Debug utilities - import this in index.js to have it available

const Debug = {
  // Check all services
  checkServices() {
    console.log('=== Service Status ===');
    console.log('ConfigService:', typeof window.SociallyFedConfigService);
    console.log('AuthService:', typeof window.authService);
    console.log('Platform:', typeof window.PlatformDetection);
    
    if (window.SociallyFedConfigService) {
      console.log('Config.isSimplifiedFlagEnabled:', 
        typeof window.SociallyFedConfigService.isSimplifiedFlagEnabled);
    }
  },
  
  // Test configuration
  testConfig() {
    if (!window.SociallyFedConfigService) {
      console.error('❌ ConfigService not found!');
      return;
    }
    
    console.log('=== Config Test ===');
    console.log('Simplified:', window.SociallyFedConfigService.isSimplifiedFlagEnabled());
    console.log('BasicMode:', window.SociallyFedConfigService.isBasicModeEnabled());
    console.log('Platform:', window.SociallyFedConfigService.detectPlatform());
  },
  
  // Test authentication
  async testAuth() {
    console.log('=== Auth Test ===');
    
    if (!window.authService) {
      console.error('❌ AuthService not found!');
      return;
    }
    
    const user = window.authService.getCurrentUser();
    if (user) {
      console.log('✅ User signed in:', user.email);
      const token = await user.getIdToken();
      console.log('Token preview:', token.substring(0, 50) + '...');
    } else {
      console.log('❌ No user signed in');
    }
  },
  
  // Platform info
  platformInfo() {
    console.log('=== Platform Info ===');
    if (window.PlatformDetection) {
      return window.PlatformDetection.getInfo();
    } else {
      console.log('User Agent:', navigator.userAgent);
      console.log('Screen:', window.screen.width + 'x' + window.screen.height);
      console.log('PWA:', window.matchMedia('(display-mode: standalone)').matches);
    }
  },
  
  // Clear all data
  clearAll() {
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ All storage cleared');
  },
  
  // Run all tests
  runAll() {
    this.checkServices();
    this.testConfig();
    this.testAuth();
    this.platformInfo();
  }
};

// Attach to window
window.Debug = Debug;

// Auto-run check on load
setTimeout(() => {
  console.log('Debug utilities loaded. Use window.Debug.* commands');
  Debug.checkServices();
}, 1000);

export default Debug;
```

---

## 📋 Technical Requirements

### Required Package Versions:
```json
{
  "dependencies": {
    "firebase": "^10.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### Install if missing:
```bash
npm install firebase@latest
```

### Firebase Configuration:
**File:** `src/services/firebase.js`
```javascript
// Make sure this file exists with your config
import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDYR9IdLUmLVBnq4RwcM6fX8JpE5EI8Bls",
  authDomain: "sociallyfed-55780.firebaseapp.com",
  projectId: "sociallyfed-55780",
  storageBucket: "sociallyfed-55780.appspot.com",
  messagingSenderId: "512204327023",
  appId: "1:512204327023:web:4682c5db3d42b5e1011468"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use local storage instead of session storage
setPersistence(auth, browserLocalPersistence);

export { app, auth };
```

### Import Order in Main App:
**File:** `src/App.js` or `src/index.js`
```javascript
// Import in this exact order at the top of your main file
import './services/SociallyFedConfigService'; // Must be first!
import './services/firebase';
import './utils/debug';
import authService from './services/authService';
import PlatformDetection from './utils/platformDetection';

// Your other imports...
```

---

## 🔌 Integration Points to Consider

### 1. Login Component Integration
Update your login button to use the new auth service:
```javascript
// In your Login component
import authService from '../services/authService';

const handleLogin = async () => {
  try {
    setLoading(true);
    await authService.signInWithGoogle();
    // Redirect handled automatically
  } catch (error) {
    console.error('Login failed:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 2. App State Management
Listen for auth changes:
```javascript
// In your main App component
useEffect(() => {
  const handleAuthChange = (event) => {
    if (event.detail.user) {
      // User logged in
      setUser(event.detail.user);
      navigate('/dashboard'); // or wherever
    } else {
      // User logged out
      setUser(null);
      navigate('/login');
    }
  };
  
  window.addEventListener('authStateChanged', handleAuthChange);
  
  return () => {
    window.removeEventListener('authStateChanged', handleAuthChange);
  };
}, []);
```

### 3. Protected Routes
Check authentication before rendering:
```javascript
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};
```

---

## ✅ Definition of Done for Today's Work

### Test Checklist - ALL must pass:

#### 1. **Config Service Working**
Open browser console and run:
```javascript
// This should NOT throw an error:
window.SociallyFedConfigService.isSimplifiedFlagEnabled()
// Should return: false (or true, but no error)
```

#### 2. **No COOP Warnings**
- Open Chrome DevTools Console
- Navigate to login page
- Click "Sign in with Google"
- Should see NO warnings about third-party cookies or COOP

#### 3. **Platform Detection Correct**
On mobile device or PWA:
```javascript
window.Debug.platformInfo()
// Should show platform: 'mobile' or 'pwa', not 'web'
```

#### 4. **Authentication Flow Works**
Test both desktop and mobile:
- Desktop: Should open Google popup
- Mobile: Should redirect to Google, then back
- After sign-in: localStorage should have `session_token`

#### 5. **Debug Utilities Available**
```javascript
// All these should work:
window.Debug.runAll()
window.Debug.testAuth()
window.Debug.testConfig()
```

#### 6. **Server Integration**
After successful Google sign-in:
- Network tab should show POST to `/api/auth/exchange`
- Response should be 200 OK
- localStorage should contain `session_token` and `user_id`

### Visual Confirmation:
- [ ] Login page loads without errors
- [ ] Google sign-in button is clickable
- [ ] Sign-in completes successfully
- [ ] User is redirected to app after sign-in
- [ ] No red errors in console

---

## 🚨 If You Get Stuck

### Quick Fixes for Common Issues:

**Issue 1: "isSimplifiedFlagEnabled is not a function"**
- Make sure `SociallyFedConfigService.js` is imported in your main App.js
- Check console for "[CONFIG] SociallyFedConfigService attached to window"

**Issue 2: "Firebase is not defined"**
```bash
npm install firebase
```

**Issue 3: Popup blocked on mobile**
- This is expected! The code should automatically fall back to redirect
- Check that redirect flow is working

**Issue 4: 401 from server**
- The server team is fixing this today
- For now, authentication might fail at the exchange step
- Focus on fixing the client-side errors first

**Issue 5: "Cannot read property 'auth' of undefined"**
- Make sure firebase.js exports the auth object
- Check import statements match exactly

### Testing Sequence:
1. First, fix the config service error
2. Open browser console, run: `window.Debug.checkServices()`
3. All services should be defined
4. Then test login flow

### Emergency Bypass (Development Only):
```javascript
// Add to console if you need to bypass auth temporarily:
localStorage.setItem('session_token', 'dev_token_123');
localStorage.setItem('user_id', 'dev_user');
window.location.reload();
```

---

## 📝 End of Day Checklist

Before you finish:
1. [ ] All error messages in console are resolved
2. [ ] Config service error is fixed
3. [ ] Platform detection shows correct platform
4. [ ] OAuth flow works (popup or redirect)
5. [ ] Code committed to git with clear commit messages
6. [ ] Brief status update in team Slack

### Commit your work:
```bash
git add .
git commit -m "fix: resolve config service and OAuth flow issues

- Added missing isSimplifiedFlagEnabled method
- Implemented platform detection for mobile/PWA
- Updated auth flow to use redirect on mobile
- Added COOP headers for OAuth compatibility"

git push origin your-branch-name
```

### Build and Deploy (only if everything works):
```bash
# Build the app
npm run build

# Test the build locally
npx serve -s build -l 3000

# Deploy to Cloud Run
gcloud run deploy sociallyfed-mobile \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated
```

---

## 🎯 Success Metrics

You know you're done when:
1. **Zero console errors** on the login page
2. **Platform shows as 'mobile'** on mobile devices
3. **Google sign-in completes** without errors
4. **Debug utilities work** in console
5. **Can sign in and out** repeatedly without issues

Remember: Focus on fixing the immediate blocker (config service) first, then work through the other issues in order. Ask for help if you're stuck for more than 30 minutes on any issue!