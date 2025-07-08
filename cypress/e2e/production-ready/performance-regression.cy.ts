/// <reference types="cypress" />

/**
 * Performance Regression Testing Suite
 * Validates performance benchmarks for production deployment
 * Ensures no degradation in critical performance metrics
 */

describe('Performance Regression Testing', () => {
  const performanceTargets = {
    virtualScrolling: 200, // ms
    apiResponseTime: 200, // ms
    cacheHitRate: 0.8, // 80%
    memoryReduction: 0.7, // 70%
    renderTime: 1000, // ms
    loadTime: 2000 // ms
  };

  beforeEach(() => {
    cy.viewport('iphone-x');
    Cypress.config('defaultCommandTimeout', 10000);
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('validates virtual scrolling performance with large datasets', () => {
    // Generate test data (simulate 1000+ entries)
    cy.visit('/test-data-generator');
    cy.get('[data-testid="generate-mood-logs"]').click();
    cy.get('[data-testid="entry-count"]').clear().type('1000');
    cy.get('[data-testid="generate-button"]').click();
    
    // Wait for data generation
    cy.get('[data-testid="generation-complete"]', { timeout: 30000 }).should('exist');
    
    // Navigate to mood history with large dataset
    cy.visit('/mood-history');
    
    // Measure initial render time
    const renderStartTime = Date.now();
    cy.get('[data-testid="virtualized-mood-list"]').should('exist');
    const initialRenderTime = Date.now() - renderStartTime;
    
    expect(initialRenderTime).to.be.lessThan(performanceTargets.renderTime);
    cy.log(`Initial render time: ${initialRenderTime}ms`);
    
    // Test virtual scrolling performance
    const scrollStartTime = Date.now();
    
    // Scroll to bottom
    cy.get('[data-testid="virtualized-mood-list"]').scrollTo('bottom', {
      duration: 1000,
      ensureScrollable: false
    });
    
    const scrollTime = Date.now() - scrollStartTime;
    expect(scrollTime).to.be.lessThan(performanceTargets.virtualScrolling);
    cy.log(`Scroll to bottom time: ${scrollTime}ms`);
    
    // Scroll to middle
    cy.get('[data-testid="virtualized-mood-list"]').scrollTo('center');
    
    // Scroll to top
    cy.get('[data-testid="virtualized-mood-list"]').scrollTo('top');
    
    // Validate memory usage
    cy.window().then((win) => {
      if (win.performance && win.performance.memory) {
        const memory = win.performance.memory;
        cy.log(`Memory usage: ${memory.usedJSHeapSize / 1024 / 1024} MB`);
        
        // Verify memory usage is reasonable for large dataset
        expect(memory.usedJSHeapSize).to.be.lessThan(100 * 1024 * 1024); // Less than 100MB
      }
    });
    
    // Verify only visible items are rendered (virtualization working)
    cy.get('[data-testid="mood-log-item"]').should('have.length.lessThan', 50);
    
    // Verify scroll position tracking
    cy.get('[data-testid="scroll-position"]').should('exist');
    cy.get('[data-testid="visible-range"]').should('exist');
    
    // Test rapid scrolling
    for (let i = 0; i < 5; i++) {
      cy.get('[data-testid="virtualized-mood-list"]').scrollTo(0, Math.random() * 1000);
      cy.wait(100);
    }
    
    // Verify performance hasn't degraded
    cy.get('[data-testid="mood-log-item"]').should('have.length.lessThan', 50);
  });

  it('validates request cache efficiency', () => {
    let apiCalls: any[] = [];
    
    // Monitor API calls
    cy.intercept('GET', '**/api/**', (req) => {
      apiCalls.push({
        url: req.url,
        timestamp: Date.now(),
        cached: req.headers['x-cache-status'] === 'hit'
      });
      req.continue();
    }).as('apiCalls');
    
    // Initial page load
    cy.visit('/dashboard');
    cy.wait(1000);
    
    const initialCallCount = apiCalls.length;
    cy.log(`Initial API calls: ${initialCallCount}`);
    
    // Navigate to different page
    cy.visit('/summary');
    cy.wait(1000);
    
    // Navigate back to dashboard
    cy.visit('/dashboard');
    cy.wait(1000);
    
    // Reload page
    cy.reload();
    cy.wait(1000);
    
    // Calculate cache hit rate
    const totalCalls = apiCalls.length;
    const cachedCalls = apiCalls.filter(call => call.cached).length;
    const hitRate = cachedCalls / totalCalls;
    
    cy.log(`Total API calls: ${totalCalls}`);
    cy.log(`Cached calls: ${cachedCalls}`);
    cy.log(`Cache hit rate: ${(hitRate * 100).toFixed(1)}%`);
    
    // Validate cache efficiency
    expect(hitRate).to.be.greaterThan(performanceTargets.cacheHitRate);
    
    // Verify cache analytics
    cy.get('[data-testid="cache-analytics"]').should('exist');
    cy.get('[data-testid="cache-hit-rate"]').invoke('text').then((text) => {
      const displayedHitRate = parseFloat(text);
      expect(displayedHitRate).to.be.greaterThan(performanceTargets.cacheHitRate);
    });
    
    // Test cache invalidation
    cy.visit('/mood-log');
    cy.get('[data-testid="start-mood-log"]').click();
    cy.get('[data-testid="mood-input"]').type('New entry to invalidate cache');
    cy.get('[data-testid="submit-mood-log"]').click();
    
    // Verify cache is invalidated appropriately
    cy.visit('/dashboard');
    cy.contains('New entry to invalidate cache').should('exist');
  });

  it('validates API response times under load', () => {
    const responseTimes: number[] = [];
    
    // Monitor API response times
    cy.intercept('**/api/**', (req) => {
      const startTime = Date.now();
      req.continue((res) => {
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);
        cy.log(`API response time: ${responseTime}ms`);
      });
    }).as('apiCalls');
    
    // Simulate concurrent requests
    const pages = ['/dashboard', '/summary', '/insights', '/pyramid', '/mood-history'];
    
    pages.forEach((page, index) => {
      cy.visit(page);
      cy.wait(500); // Brief pause between requests
      
      // Trigger additional API calls
      cy.get('[data-testid="refresh-button"]').click();
      cy.wait(500);
    });
    
    // Calculate performance metrics
    cy.then(() => {
      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxResponseTime = Math.max(...responseTimes);
      const p95ResponseTime = responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)];
      
      cy.log(`Average response time: ${averageResponseTime.toFixed(2)}ms`);
      cy.log(`Max response time: ${maxResponseTime}ms`);
      cy.log(`95th percentile: ${p95ResponseTime}ms`);
      
      // Validate performance targets
      expect(averageResponseTime).to.be.lessThan(performanceTargets.apiResponseTime);
      expect(p95ResponseTime).to.be.lessThan(performanceTargets.apiResponseTime * 2);
    });
    
    // Test database query performance
    cy.visit('/analytics');
    cy.get('[data-testid="database-metrics"]').should('exist');
    cy.get('[data-testid="query-performance"]').invoke('text').then((text) => {
      const queryTime = parseFloat(text);
      expect(queryTime).to.be.lessThan(100); // Under 100ms
    });
  });

  it('validates memory usage optimization', () => {
    // Test memory usage with VirtualizedMoodLogList
    cy.visit('/mood-history');
    
    // Generate large dataset
    cy.get('[data-testid="load-test-data"]').click();
    cy.get('[data-testid="virtualized-mood-list"]').should('exist');
    
    // Measure memory usage
    cy.window().then((win) => {
      if (win.performance && win.performance.memory) {
        const initialMemory = win.performance.memory.usedJSHeapSize;
        
        // Scroll through large dataset
        for (let i = 0; i < 10; i++) {
          cy.get('[data-testid="virtualized-mood-list"]').scrollTo(0, i * 100);
          cy.wait(100);
        }
        
        // Measure memory after scrolling
        const finalMemory = win.performance.memory.usedJSHeapSize;
        const memoryIncrease = (finalMemory - initialMemory) / initialMemory;
        
        cy.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
        cy.log(`Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
        cy.log(`Memory increase: ${(memoryIncrease * 100).toFixed(1)}%`);
        
        // Verify memory usage is optimized
        expect(memoryIncrease).to.be.lessThan(0.5); // Less than 50% increase
      }
    });
    
    // Test garbage collection
    cy.window().then((win) => {
      if (win.gc) {
        win.gc();
        cy.wait(1000);
        
        // Verify memory is freed
        const memoryAfterGC = win.performance.memory.usedJSHeapSize;
        cy.log(`Memory after GC: ${(memoryAfterGC / 1024 / 1024).toFixed(2)} MB`);
      }
    });
  });

  it('validates component render optimization', () => {
    // Test React component rendering performance
    cy.visit('/dashboard');
    
    // Measure initial render
    cy.window().then((win) => {
      const performanceEntries = win.performance.getEntriesByType('measure');
      const reactRenderTime = performanceEntries.find(entry => 
        entry.name.includes('React') || entry.name.includes('render')
      );
      
      if (reactRenderTime) {
        cy.log(`React render time: ${reactRenderTime.duration}ms`);
        expect(reactRenderTime.duration).to.be.lessThan(500);
      }
    });
    
    // Test re-render performance
    cy.get('[data-testid="refresh-button"]').click();
    cy.wait(1000);
    
    // Measure re-render performance
    cy.window().then((win) => {
      const performanceEntries = win.performance.getEntriesByType('navigation');
      const navigationTiming = performanceEntries[0] as PerformanceNavigationTiming;
      
      if (navigationTiming) {
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        cy.log(`Page load time: ${loadTime}ms`);
        expect(loadTime).to.be.lessThan(performanceTargets.loadTime);
      }
    });
  });

  it('validates network optimization', () => {
    // Test resource loading optimization
    cy.visit('/dashboard');
    
    // Monitor network requests
    cy.window().then((win) => {
      const performanceEntries = win.performance.getEntriesByType('resource');
      const totalSize = performanceEntries.reduce((sum, entry) => {
        return sum + (entry.transferSize || 0);
      }, 0);
      
      cy.log(`Total network transfer: ${(totalSize / 1024).toFixed(2)} KB`);
      
      // Verify reasonable bundle size
      expect(totalSize).to.be.lessThan(5 * 1024 * 1024); // Less than 5MB
    });
    
    // Test compression
    cy.request('/static/js/main.js').then((response) => {
      expect(response.headers).to.have.property('content-encoding');
    });
    
    // Test caching headers
    cy.request('/static/css/main.css').then((response) => {
      expect(response.headers).to.have.property('cache-control');
    });
  });

  it('validates database performance under load', () => {
    // Test database query performance
    cy.visit('/analytics/database');
    
    // Execute complex queries
    cy.get('[data-testid="run-performance-test"]').click();
    cy.get('[data-testid="performance-results"]', { timeout: 10000 }).should('exist');
    
    // Validate query performance metrics
    cy.get('[data-testid="query-metrics"]').within(() => {
      cy.get('[data-testid="connection-time"]').invoke('text').then((text) => {
        const connectionTime = parseFloat(text);
        expect(connectionTime).to.be.lessThan(50); // Under 50ms
      });
      
      cy.get('[data-testid="query-time"]').invoke('text').then((text) => {
        const queryTime = parseFloat(text);
        expect(queryTime).to.be.lessThan(100); // Under 100ms
      });
      
      cy.get('[data-testid="jsonb-performance"]').invoke('text').then((text) => {
        const jsonbTime = parseFloat(text);
        expect(jsonbTime).to.be.lessThan(150); // Under 150ms
      });
    });
    
    // Test connection pooling
    cy.get('[data-testid="connection-pool-metrics"]').should('exist');
    cy.get('[data-testid="active-connections"]').invoke('text').then((text) => {
      const activeConnections = parseInt(text);
      expect(activeConnections).to.be.lessThan(50); // Reasonable connection count
    });
  });

  it('validates background job performance', () => {
    // Test insight generation performance
    cy.visit('/insights');
    
    const startTime = Date.now();
    cy.get('[data-testid="generate-insights"]').click();
    
    // Wait for insight generation
    cy.get('[data-testid="insight-results"]', { timeout: 30000 }).should('exist');
    
    const generationTime = Date.now() - startTime;
    cy.log(`Insight generation time: ${generationTime}ms`);
    
    // Validate insight generation performance
    expect(generationTime).to.be.lessThan(performanceTargets.insightGeneration);
    
    // Test background job metrics
    cy.visit('/admin/jobs');
    cy.get('[data-testid="job-performance"]').should('exist');
    
    cy.get('[data-testid="job-metrics"]').within(() => {
      cy.get('[data-testid="average-job-time"]').invoke('text').then((text) => {
        const avgJobTime = parseFloat(text);
        expect(avgJobTime).to.be.lessThan(5000); // Under 5 seconds
      });
      
      cy.get('[data-testid="failed-jobs"]').invoke('text').then((text) => {
        const failedJobs = parseInt(text);
        expect(failedJobs).to.be.lessThan(5); // Less than 5 failed jobs
      });
    });
  });
});