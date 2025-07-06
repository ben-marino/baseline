# SociallyFed Development Context - Server Project

## Project Overview
You are working on SociallyFed, a privacy-first social media analysis platform that helps users understand their digital consumption habits using the SociallyFed Pyramid framework.

## Current Development Focus: Server

### Repository Structure
**Backend/Server Repository** (.NET)
- **Tech Stack**: .NET 8, ASP.NET Core Web API, Entity Framework, SQLite
- **Purpose**: LLM integration, social media analysis API, pyramid categorization
- **Key Components**:
  - Controllers for API endpoints
  - Core business logic for pyramid analysis
  - LLM integration services (Ollama)
  - Data models and Entity Framework context
  - Unit and integration tests

**Architecture Focus**:
- Microservices design
- Local-first LLM processing (privacy-first)
- RESTful API design
- Secure data handling
- Performance optimization for analysis algorithms

## Development Environment
- **Windows Desktop**: LLM hosting (Ollama), Senior Claude planning
- **Ubuntu VM**: Development environment with Cursor + Claude Code
- **Sync**: Google Drive for context, GitHub for code versioning

## Current Session Context:
📊 Current session context:
## Session Started: Sun 06 Jul 2025 12:04:57 AEST
**Project Focus**: SociallyFed Mobile App
**Repository**: /home/ben/Development/sociallyfed-mobile

### Today's Brief:
# Daily Development Brief - SociallyFed Mobile Architecture
**Date:** January 7, 2025  
**Priority Level:** HIGH - Security & Performance Critical  
**Estimated Time:** 6-8 hours

## 🚨 Critical Security Fixes (Priority 1 - 3 hours)

### Task 1.1: Remove Hardcoded Secrets
**What to build:**
- Environment variable configuration system
- Secure secret management for API tokens

**Technical Requirements:**
- Create `.env.template` file with placeholder values
- Implement `ConfigService` to load from environment variables
- Remove all hardcoded API keys from source code
- Add `.env` to `.gitignore`

**Integration Points:**
- Update CI/CD pipeline to inject secrets
- Modify mobile native bridge to use environment configs
- Update deployment scripts for secret injection

**Definition of Done:**
- [ ] No hardcoded secrets in any source file
- [ ] All API calls use environment-based configuration
- [ ] CI/CD pipeline properly injects secrets
- [ ] Local development works with `.env` file

### Task 1.2: Fix CORS Configuration
**What to build:**
- Restrictive CORS policy for production
- Environment-specific CORS configuration

**Technical Requirements:**
```typescript
// Replace wildcard CORS with specific origins
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

**Definition of Done:**
- [ ] CORS no longer allows all origins (*)
- [ ] Environment-specific origin configuration
- [ ] Credentials properly handled
- [ ] Mobile app still functions correctly

## ⚡ Performance Optimization (Priority 2 - 3 hours)

### Task 2.1: Implement Virtual Scrolling for MoodLogList
**What to build:**
- Virtual scrolling component for large mood log lists
- Proper cleanup and memory management

**Technical Requirements:**
- Use `react-window` or similar library
- Implement fixed item height calculation
- Add proper useEffect cleanup for chart components
- Optimize Chart.js rendering with `maintainAspectRatio: false`

**Integration Points:**
- Must maintain existing mood log functionality
- Preserve data export capabilities
- Keep widget data sync working

**Definition of Done:**
- [ ] Lists with 1000+ items perform smoothly
- [ ] Memory usage stays stable during scrolling
- [ ] All existing functionality preserved
- [ ] Chart components properly cleaned up

### Task 2.2: Add Request Caching
**What to build:**
- Simple request cache with TTL
- Request deduplication for duplicate API calls

**Technical Requirements:**
```typescript
class RequestCache {
  private cache = new Map();
  private TTL = 5 * 60 * 1000; // 5 minutes
  
  async get(key: string, fetcher: () => Promise<any>) {
    // Implementation with TTL and deduplication
  }
}
```

**Definition of Done:**
- [ ] Duplicate requests are deduplicated
- [ ] Cache has configurable TTL
- [ ] Cache size is bounded (max 100 entries)
- [ ] Cache invalidation works correctly

## 🔧 Architecture Improvements (Priority 3 - 2 hours)

### Task 3.1: Split SociallyFedConfigService
**What to build:**
- Break 1384-line config service into domain-specific services
- Create proper service interfaces

**Technical Requirements:**
- `PhilosophyConfigService` - Stoic/philosophical content
- `MediaAnalysisService` - SociallyFed pyramid logic
- `UserPreferencesService` - User settings
- `DataMigrationService` - Import/export logic

**Integration Points:**
- Maintain backward compatibility
- Update all existing imports
- Preserve existing API contracts

**Definition of Done:**
- [ ] SociallyFedConfigService < 400 lines
- [ ] Four new focused services created
- [ ] All tests still pass
- [ ] No breaking changes to existing APIs

## 📝 Implementation Notes

### Critical Files to Modify:
1. `src/services/SociallyFedConfigService.ts` - Split this file
2. `src/components/MoodLogList.tsx` - Add virtual scrolling
3. `src/config/cors.ts` - Fix CORS configuration
4. `src/utils/RequestCache.ts` - New cache implementation

### Testing Requirements:
- Run full test suite after each major change
- Test on both iOS and Android if mobile changes
- Verify widget functionality still works
- Test data export/import flows

### Environment Setup:
```bash
# Install required dependencies
npm install react-window @types/react-window
npm install dotenv-safe

# Create environment file
cp .env.template .env
# Fill in actual values for local development
```

### Verification Commands:
```bash
# Security check
npm audit
grep -r "api_key\|secret\|token" src/ --exclude-dir=node_modules

# Performance check
npm run build
npm run test:performance

# Architecture check
npx madge --circular src/
```

## 🎯 Success Metrics for Today:
- Security: 0 hardcoded secrets in codebase
- Performance: <2s load time for 1000+ mood entries
- Architecture: SociallyFedConfigService split into 4 services
- Quality: All existing tests passing

## 🚀 Tomorrow's Preview:
- Database query optimization with proper indexing
- Component decomposition for large React components
- Privacy enhancement planning (key rotation)

---
**Need Help?** Check the architecture review document for detailed context on each issue.  
**Blocked?** Focus on security fixes first - they're the highest priority.

### Current Sprint:
﻿# Current Sprint Status

## Today's Major Achievement ✅
Successfully configured Claude Desktop with MCP filesystem server!

## Completed Tasks
- [x] Completely removed and reinstalled Claude Desktop
- [x] Resolved JSON configuration issues  
- [x] MCP filesystem server now working
- [x] Claude can read and list local files
- [x] Google Drive sync configured

## Next Priority Tasks
- [ ] Test MCP with Google Drive folder
- [ ] Set up Ubuntu VM development environment
- [ ] Configure GitHub repository
- [ ] Test cross-machine workflow
- [ ] Begin .NET backend development

## Notes
- MCP configuration requires exact JSON syntax
- ASCII encoding works best for config files
- Test with simple paths first, then move to actual project paths

