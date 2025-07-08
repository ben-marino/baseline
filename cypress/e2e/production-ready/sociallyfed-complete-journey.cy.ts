/// <reference types="cypress" />

/**
 * SociallyFed Production Journey E2E Tests
 * Complete end-to-end testing for production launch readiness
 * Validates full user experience workflow with performance benchmarks
 */

describe('SociallyFed Production Journey', () => {
  const performanceTargets = {
    apiResponseTime: 200,
    virtualScrolling: 200,
    cacheHitRate: 0.8,
    memoryReduction: 0.7,
    databaseConnection: 50,
    insightGeneration: 30000
  };

  beforeEach(() => {
    cy.viewport('iphone-x');
    Cypress.config('defaultCommandTimeout', 10000);
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('completes full user experience workflow', () => {
    // Performance tracking
    const journeyStartTime = Date.now();
    let apiCallTimes: number[] = [];
    
    // Monitor API response times
    cy.intercept('**/api/**', (req) => {
      const startTime = Date.now();
      req.continue((res) => {
        const responseTime = Date.now() - startTime;
        apiCallTimes.push(responseTime);
        cy.log(`API call took ${responseTime}ms`);
      });
    }).as('apiCalls');

    // User Registration & Authentication
    cy.log('Step 1: User Registration & Authentication');
    cy.visit('/register');
    cy.get('[data-testid="email-input"]').type('testuser@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="confirm-password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="register-button"]').click();
    
    // Verify registration success
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('exist');
    
    // Login flow
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('testuser@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="login-button"]').click();
    
    // Verify login success
    cy.url().should('include', '/dashboard');
    
    // Mood Logging with Virtue Tracking
    cy.log('Step 2: Mood Logging with Virtue Tracking');
    cy.visit('/mood-log');
    cy.get('[data-testid="start-mood-log"]').click();
    
    // Enter mood details
    cy.get('[data-testid="mood-input"]').type('Feeling positive and aligned with my values');
    cy.get('[data-testid="mood-level-slider"]').invoke('val', 7).trigger('input');
    cy.get('[data-testid="energy-level-slider"]').invoke('val', 8).trigger('input');
    
    // Select virtues
    cy.get('[data-testid="virtue-patience"]').check();
    cy.get('[data-testid="virtue-gratitude"]').check();
    cy.get('[data-testid="virtue-courage"]').check();
    
    // Add notes
    cy.get('[data-testid="notes-textarea"]').type('Feeling positive and aligned with my values');
    
    // Submit mood log
    cy.get('[data-testid="submit-mood-log"]').click();
    
    // Verify mood log saved
    cy.contains('Mood log saved successfully').should('exist');
    
    // SociallyFed Pyramid Interaction
    cy.log('Step 3: SociallyFed Pyramid Interaction');
    cy.visit('/pyramid');
    
    // Validate pyramid data structure
    cy.get('[data-testid="media-pyramid"]').should('exist');
    cy.get('[data-testid="pyramid-level-nourishing"]').should('exist');
    cy.get('[data-testid="pyramid-level-balanced"]').should('exist');
    cy.get('[data-testid="pyramid-level-junk"]').should('exist');
    
    // Test pyramid level interactions
    cy.get('[data-testid="pyramid-level-nourishing"]').click();
    cy.get('[data-testid="nourishing-details"]').should('be.visible');
    
    cy.get('[data-testid="pyramid-level-balanced"]').click();
    cy.get('[data-testid="balanced-details"]').should('be.visible');
    
    cy.get('[data-testid="pyramid-level-junk"]').click();
    cy.get('[data-testid="junk-details"]').should('be.visible');
    
    // Verify pyramid percentages
    let totalPercentage = 0;
    cy.get('[data-testid^="pyramid-percentage-"]').each(($el) => {
      totalPercentage += parseFloat($el.text());
    }).then(() => {
      expect(totalPercentage).to.be.closeTo(100, 0.1);
    });
    
    // Insights Generation & Display
    cy.log('Step 4: Insights Generation & Display');
    cy.visit('/insights');
    
    // Trigger insight generation
    cy.get('[data-testid="generate-insights"]').click();
    
    // Wait for insights to generate (with timeout)
    cy.get('[data-testid="insight-loading"]').should('exist');
    cy.get('[data-testid="insight-results"]', { timeout: 30000 }).should('exist');
    
    // Validate insight accuracy
    cy.get('[data-testid="insight-item"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="insight-item"]').first().should('contain.text', 'virtue');
    
    // Performance Validation
    cy.log('Step 5: Performance Validation');
    
    // Validate API response times
    cy.then(() => {
      const averageResponseTime = apiCallTimes.reduce((a, b) => a + b, 0) / apiCallTimes.length;
      expect(averageResponseTime).to.be.lessThan(performanceTargets.apiResponseTime);
      cy.log(`Average API response time: ${averageResponseTime}ms`);
    });
    
    // Test virtual scrolling performance
    cy.visit('/mood-history');
    cy.get('[data-testid="virtualized-mood-list"]').should('exist');
    
    const scrollStartTime = Date.now();
    cy.get('[data-testid="virtualized-mood-list"]').scrollTo('bottom');
    const scrollTime = Date.now() - scrollStartTime;
    
    expect(scrollTime).to.be.lessThan(performanceTargets.virtualScrolling);
    cy.log(`Virtual scroll time: ${scrollTime}ms`);
    
    // Cache efficiency validation
    cy.visit('/dashboard');
    cy.reload();
    
    // Verify cache hit rate
    cy.get('[data-testid="cache-analytics"]').should('exist');
    cy.get('[data-testid="cache-hit-rate"]').invoke('text').then((text) => {
      const hitRate = parseFloat(text);
      expect(hitRate).to.be.greaterThan(performanceTargets.cacheHitRate);
      cy.log(`Cache hit rate: ${hitRate * 100}%`);
    });
    
    // Overall journey performance
    const journeyEndTime = Date.now();
    const totalJourneyTime = journeyEndTime - journeyStartTime;
    cy.log(`Complete journey time: ${totalJourneyTime}ms`);
    
    // Verify all major features are functional
    cy.visit('/dashboard');
    cy.get('[data-testid="mood-summary"]').should('exist');
    cy.get('[data-testid="virtue-progress"]').should('exist');
    cy.get('[data-testid="pyramid-overview"]').should('exist');
    cy.get('[data-testid="recent-insights"]').should('exist');
  });

  it('validates data integrity across components', () => {
    // Create mood log with specific data
    cy.visit('/mood-log');
    cy.get('[data-testid="start-mood-log"]').click();
    
    const testData = {
      mood: 'Test mood entry for data integrity',
      moodLevel: 8,
      energyLevel: 7,
      virtues: ['patience', 'gratitude'],
      notes: 'Data integrity test notes'
    };
    
    cy.get('[data-testid="mood-input"]').type(testData.mood);
    cy.get('[data-testid="mood-level-slider"]').invoke('val', testData.moodLevel).trigger('input');
    cy.get('[data-testid="energy-level-slider"]').invoke('val', testData.energyLevel).trigger('input');
    
    testData.virtues.forEach(virtue => {
      cy.get(`[data-testid="virtue-${virtue}"]`).check();
    });
    
    cy.get('[data-testid="notes-textarea"]').type(testData.notes);
    cy.get('[data-testid="submit-mood-log"]').click();
    
    // Verify data appears correctly in summary
    cy.visit('/summary');
    cy.contains(testData.mood).should('exist');
    cy.get('[data-testid="mood-level-display"]').should('contain.text', testData.moodLevel);
    cy.get('[data-testid="energy-level-display"]').should('contain.text', testData.energyLevel);
    
    // Verify data in pyramid
    cy.visit('/pyramid');
    cy.get('[data-testid="recent-entries"]').should('contain.text', testData.mood);
    
    // Verify data in insights
    cy.visit('/insights');
    cy.get('[data-testid="insight-source-data"]').should('contain.text', testData.mood);
  });

  it('handles error scenarios gracefully', () => {
    // Test offline scenario
    cy.visit('/dashboard');
    
    // Simulate network failure
    cy.intercept('**/api/**', { forceNetworkError: true }).as('networkError');
    
    cy.get('[data-testid="refresh-button"]').click();
    cy.get('[data-testid="offline-indicator"]').should('exist');
    cy.get('[data-testid="error-message"]').should('contain.text', 'network');
    
    // Test invalid input handling
    cy.visit('/mood-log');
    cy.get('[data-testid="start-mood-log"]').click();
    cy.get('[data-testid="submit-mood-log"]').click(); // Submit without data
    
    cy.get('[data-testid="validation-error"]').should('exist');
    cy.get('[data-testid="validation-error"]').should('contain.text', 'required');
    
    // Test API error handling
    cy.intercept('POST', '**/api/mood-logs', { statusCode: 500 }).as('serverError');
    
    cy.get('[data-testid="mood-input"]').type('Test entry');
    cy.get('[data-testid="submit-mood-log"]').click();
    
    cy.get('[data-testid="error-message"]').should('contain.text', 'server error');
    cy.get('[data-testid="retry-button"]').should('exist');
  });

  it('validates security measures', () => {
    // Test XSS prevention
    cy.visit('/mood-log');
    cy.get('[data-testid="start-mood-log"]').click();
    
    const maliciousInput = '<script>alert("XSS")</script>Test entry';
    cy.get('[data-testid="mood-input"]').type(maliciousInput);
    cy.get('[data-testid="submit-mood-log"]').click();
    
    // Verify script is sanitized
    cy.visit('/summary');
    cy.get('body').should('not.contain', '<script>');
    cy.contains('Test entry').should('exist');
    
    // Test CSRF protection
    cy.request({
      method: 'POST',
      url: '/api/mood-logs',
      body: { mood: 'Test' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.not.equal(200);
    });
    
    // Test authentication requirement
    cy.clearLocalStorage();
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('validates accessibility compliance', () => {
    cy.visit('/dashboard');
    
    // Test keyboard navigation
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid');
    
    // Test screen reader compatibility
    cy.get('[data-testid="mood-summary"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="virtue-progress"]').should('have.attr', 'aria-label');
    
    // Test color contrast (basic check)
    cy.get('body').should('have.css', 'background-color');
    cy.get('body').should('have.css', 'color');
    
    // Test focus indicators
    cy.get('[data-testid="start-mood-log"]').focus();
    cy.get('[data-testid="start-mood-log"]').should('have.css', 'outline');
  });
});