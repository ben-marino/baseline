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