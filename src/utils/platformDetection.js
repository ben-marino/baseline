// Platform Detection Service - Properly detects if we're on mobile/PWA/web

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

// Expose to window for debugging
window.PlatformDetection = PlatformDetection;

export default PlatformDetection;