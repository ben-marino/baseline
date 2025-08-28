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
## Session Started: Thu 28 Aug 2025 15:59:45 AEST
**Project Focus**: SociallyFed Mobile App
**Repository**: /home/ben/Development/sociallyfed-mobile

### Today's Brief:
# SociallyFed Mobile - Import Path Fix Daily Brief
## Date: August 28, 2025
## Developer: Junior Developer
## Assigned by: Senior Developer
## Sprint Goal: Fix All Import Path Issues Blocking Build

{
  `path`: `C:\\Users\\ben_n\\Documents\\SociallyFedContext\\find_and_fix_socialyfedconfig.sh`,
  `content`: `#!/bin/bash
# Fix SociallyFedConfig Import Issues
# Run this from: /home/ben/Development/sociallyfed-mobile/baseline

echo \"🔍 Searching for SociallyFedConfig import issues...\"
echo \"================================================\"

cd /home/ben/Development/sociallyfed-mobile/baseline

# Find all mentions of SociallyFedConfig
echo -e \"\
1. Files mentioning SociallyFedConfig:\"
grep -l \"SociallyFedConfig\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null

echo -e \"\
2. Specific import statements with SociallyFedConfig:\"
grep -n \"import.*SociallyFedConfig\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null

echo -e \"\
3. Checking what SociallyFedConfigService.js actually exports:\"
if [ -f \"src/services/SociallyFedConfigService.js\" ]; then
    echo \"Exports in SociallyFedConfigService.js:\"
    grep -n \"export\" src/services/SociallyFedConfigService.js
else
    echo \"❌ SociallyFedConfigService.js not found in src/services/\"
    echo \"Checking other locations...\"
    find . -name \"SociallyFedConfigService*\" -type f 2>/dev/null
fi

echo -e \"\
4. Checking for the complex TypeScript version:\"
if [ -f \"src/services/SociallyFedConfigService.ts\" ]; then
    echo \"Found TypeScript version - checking exports:\"
    grep -n \"export\" src/services/SociallyFedConfigService.ts | head -20
fi

echo -e \"\
================================================\"
echo \"🔧 Attempting automatic fixes...\"
echo \"================================================\"

# Fix attempt 1: Change named imports to side-effect imports
echo -e \"\
Fix 1: Converting named imports to side-effect imports...\"
for file in $(grep -l \"import.*{.*SociallyFedConfig.*}\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null); do
    echo \"Fixing: $file\"
    # Backup original
    cp \"$file\" \"${file}.backup\"
    
    # Try different fix patterns
    # Pattern 1: Named import to side-effect import
    sed -i \"s/import\\s*{\\s*SociallyFedConfig\\s*}\\s*from\\s*['\\\"].*SociallyFedConfigService.*['\\\"]/import '.\\/services\\/SociallyFedConfigService.js'/g\" \"$file\"
    
    # Pattern 2: Any import with SociallyFedConfig to side-effect
    sed -i \"s/import.*SociallyFedConfig.*from.*SociallyFedConfigService.*/import '.\\/services\\/SociallyFedConfigService.js';/g\" \"$file\"
done

# Fix attempt 2: Check if the TypeScript version is being used instead
echo -e \"\
Fix 2: Checking if TypeScript version should be used...\"
if [ -f \"src/services/SociallyFedConfigService.ts\" ]; then
    echo \"TypeScript version exists. Checking if it exports SociallyFedConfig...\"
    if grep -q \"export.*SociallyFedConfig\" src/services/SociallyFedConfigService.ts; then
        echo \"✅ TypeScript version has the export. Updating imports to use .ts file...\"
        
        for file in $(grep -l \"SociallyFedConfigService\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null); do
            # Change .js references to use the .ts version
            sed -i \"s/SociallyFedConfigService\\.js/SociallyFedConfigService/g\" \"$file\"
        done
    fi
fi

echo -e \"\
================================================\"
echo \"📋 Verification\"
echo \"================================================\"

# Check if the error still exists
echo -e \"\
Checking for remaining problematic imports...\"
remaining=$(grep -n \"import.*{.*SociallyFedConfig.*}\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null | grep -v \"backup\")

if [ -z \"$remaining\" ]; then
    echo \"✅ No problematic imports found!\"
else
    echo \"⚠️ Still have problematic imports:\"
    echo \"$remaining\"
    echo -e \"\
Manual fix needed for these files.\"
fi

echo -e \"\
================================================\"
echo \"💡 Manual Fix Instructions (if automatic fix failed):\"
echo \"================================================\"
echo \"For each file listed above, open it and change:\"
echo \"\"
echo \"FROM:\"
echo \"  import { SociallyFedConfig } from './services/SociallyFedConfigService';\"
echo \"  import { SociallyFedConfig } from '../services/SociallyFedConfigService';\"
echo \"\"
echo \"TO one of these options:\"
echo \"\"
echo \"Option 1 (if you just need the service to initialize):\"
echo \"  import './services/SociallyFedConfigService.js';\"
echo \"\"
echo \"Option 2 (if you need the service instance):\"
echo \"  import configService from './services/SociallyFedConfigService.js';\"
echo \"\"
echo \"Option 3 (if using the TypeScript version):\"
echo \"  import { SociallyFedConfig } from './services/SociallyFedConfigService';\"
echo \"  (without the .js extension)\"
echo \"\"
echo \"================================================\"

# Offer to restore backups
echo -e \"\
Backup files created. To restore if needed:\"
echo \"  find . -name '*.backup' -exec sh -c 'mv \\\"\\$1\\\" \\\"\\${1%.backup}\\\"' _ {} \\;\"
echo \"\"
echo \"To delete backups after confirming fixes work:\"
echo \"  find . -name '*.backup' -delete\"
`
}
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

# SociallyFed Mobile - Import Path Fix Daily Brief
## Date: August 28, 2025
## Developer: Junior Developer
## Assigned by: Senior Developer
## Sprint Goal: Fix All Import Path Issues Blocking Build

{
  `path`: `C:\\Users\\ben_n\\Documents\\SociallyFedContext\\find_and_fix_socialyfedconfig.sh`,
  `content`: `#!/bin/bash
# Fix SociallyFedConfig Import Issues
# Run this from: /home/ben/Development/sociallyfed-mobile/baseline

echo \"🔍 Searching for SociallyFedConfig import issues...\"
echo \"================================================\"

cd /home/ben/Development/sociallyfed-mobile/baseline

# Find all mentions of SociallyFedConfig
echo -e \"\
1. Files mentioning SociallyFedConfig:\"
grep -l \"SociallyFedConfig\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null

echo -e \"\
2. Specific import statements with SociallyFedConfig:\"
grep -n \"import.*SociallyFedConfig\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null

echo -e \"\
3. Checking what SociallyFedConfigService.js actually exports:\"
if [ -f \"src/services/SociallyFedConfigService.js\" ]; then
    echo \"Exports in SociallyFedConfigService.js:\"
    grep -n \"export\" src/services/SociallyFedConfigService.js
else
    echo \"❌ SociallyFedConfigService.js not found in src/services/\"
    echo \"Checking other locations...\"
    find . -name \"SociallyFedConfigService*\" -type f 2>/dev/null
fi

echo -e \"\
4. Checking for the complex TypeScript version:\"
if [ -f \"src/services/SociallyFedConfigService.ts\" ]; then
    echo \"Found TypeScript version - checking exports:\"
    grep -n \"export\" src/services/SociallyFedConfigService.ts | head -20
fi

echo -e \"\
================================================\"
echo \"🔧 Attempting automatic fixes...\"
echo \"================================================\"

# Fix attempt 1: Change named imports to side-effect imports
echo -e \"\
Fix 1: Converting named imports to side-effect imports...\"
for file in $(grep -l \"import.*{.*SociallyFedConfig.*}\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null); do
    echo \"Fixing: $file\"
    # Backup original
    cp \"$file\" \"${file}.backup\"
    
    # Try different fix patterns
    # Pattern 1: Named import to side-effect import
    sed -i \"s/import\\s*{\\s*SociallyFedConfig\\s*}\\s*from\\s*['\\\"].*SociallyFedConfigService.*['\\\"]/import '.\\/services\\/SociallyFedConfigService.js'/g\" \"$file\"
    
    # Pattern 2: Any import with SociallyFedConfig to side-effect
    sed -i \"s/import.*SociallyFedConfig.*from.*SociallyFedConfigService.*/import '.\\/services\\/SociallyFedConfigService.js';/g\" \"$file\"
done

# Fix attempt 2: Check if the TypeScript version is being used instead
echo -e \"\
Fix 2: Checking if TypeScript version should be used...\"
if [ -f \"src/services/SociallyFedConfigService.ts\" ]; then
    echo \"TypeScript version exists. Checking if it exports SociallyFedConfig...\"
    if grep -q \"export.*SociallyFedConfig\" src/services/SociallyFedConfigService.ts; then
        echo \"✅ TypeScript version has the export. Updating imports to use .ts file...\"
        
        for file in $(grep -l \"SociallyFedConfigService\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null); do
            # Change .js references to use the .ts version
            sed -i \"s/SociallyFedConfigService\\.js/SociallyFedConfigService/g\" \"$file\"
        done
    fi
fi

echo -e \"\
================================================\"
echo \"📋 Verification\"
echo \"================================================\"

# Check if the error still exists
echo -e \"\
Checking for remaining problematic imports...\"
remaining=$(grep -n \"import.*{.*SociallyFedConfig.*}\" src/**/*.tsx src/**/*.ts src/*.tsx src/*.ts 2>/dev/null | grep -v \"backup\")

if [ -z \"$remaining\" ]; then
    echo \"✅ No problematic imports found!\"
else
    echo \"⚠️ Still have problematic imports:\"
    echo \"$remaining\"
    echo -e \"\
Manual fix needed for these files.\"
fi

echo -e \"\
================================================\"
echo \"💡 Manual Fix Instructions (if automatic fix failed):\"
echo \"================================================\"
echo \"For each file listed above, open it and change:\"
echo \"\"
echo \"FROM:\"
echo \"  import { SociallyFedConfig } from './services/SociallyFedConfigService';\"
echo \"  import { SociallyFedConfig } from '../services/SociallyFedConfigService';\"
echo \"\"
echo \"TO one of these options:\"
echo \"\"
echo \"Option 1 (if you just need the service to initialize):\"
echo \"  import './services/SociallyFedConfigService.js';\"
echo \"\"
echo \"Option 2 (if you need the service instance):\"
echo \"  import configService from './services/SociallyFedConfigService.js';\"
echo \"\"
echo \"Option 3 (if using the TypeScript version):\"
echo \"  import { SociallyFedConfig } from './services/SociallyFedConfigService';\"
echo \"  (without the .js extension)\"
echo \"\"
echo \"================================================\"

# Offer to restore backups
echo -e \"\
Backup files created. To restore if needed:\"
echo \"  find . -name '*.backup' -exec sh -c 'mv \\\"\\$1\\\" \\\"\\${1%.backup}\\\"' _ {} \\;\"
echo \"\"
echo \"To delete backups after confirming fixes work:\"
echo \"  find . -name '*.backup' -delete\"
`
}