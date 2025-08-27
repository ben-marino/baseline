// SociallyFed Configuration Service
// Fixes the immediate isSimplifiedFlagEnabled error blocking the app

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