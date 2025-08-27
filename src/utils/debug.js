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