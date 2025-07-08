/// <reference types="cypress" />

/**
 * SociallyFed Pyramid Integration Tests
 * Validates pyramid functionality, data integrity, and level transitions
 * Tests the core SociallyFed pyramid categorization system
 */

describe('SociallyFed Pyramid Integration Tests', () => {
  const pyramidLevels = {
    nourishing: {
      name: 'Nourishing',
      color: '#4CAF50',
      minPercentage: 0,
      maxPercentage: 100
    },
    balanced: {
      name: 'Balanced',
      color: '#FF9800',
      minPercentage: 0,
      maxPercentage: 100
    },
    junk: {
      name: 'Junk',
      color: '#F44336',
      minPercentage: 0,
      maxPercentage: 100
    }
  };

  beforeEach(() => {
    cy.viewport('iphone-x');
    Cypress.config('defaultCommandTimeout', 10000);
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Login to ensure authenticated state
    cy.visit('/login');
    cy.get('[data-testid="anonymous-login"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('validates pyramid visualization data integrity', () => {
    // Navigate to pyramid dashboard
    cy.visit('/pyramid');
    
    // Verify pyramid structure exists
    cy.get('[data-testid="media-pyramid"]').should('exist');
    cy.get('[data-testid="pyramid-container"]').should('be.visible');
    
    // Validate all pyramid levels are present
    Object.keys(pyramidLevels).forEach(level => {
      cy.get(`[data-testid="pyramid-level-${level}"]`).should('exist');
      cy.get(`[data-testid="pyramid-level-${level}"]`).should('be.visible');
    });
    
    // Verify percentage calculations
    let totalPercentage = 0;
    const percentages: number[] = [];
    
    Object.keys(pyramidLevels).forEach(level => {
      cy.get(`[data-testid="pyramid-percentage-${level}"]`)
        .invoke('text')
        .then((text) => {
          const percentage = parseFloat(text);
          percentages.push(percentage);
          totalPercentage += percentage;
          
          // Validate percentage is within valid range
          expect(percentage).to.be.at.least(0);
          expect(percentage).to.be.at.most(100);
        });
    });
    
    // Verify total percentages add up to 100%
    cy.then(() => {
      expect(totalPercentage).to.be.closeTo(100, 0.1);
    });
    
    // Verify pyramid colors
    Object.entries(pyramidLevels).forEach(([level, config]) => {
      cy.get(`[data-testid="pyramid-level-${level}"]`)
        .should('have.css', 'background-color')
        .and('not.be.empty');
    });
  });

  it('validates pyramid level interactions and transitions', () => {
    cy.visit('/pyramid');
    
    // Test level interactions
    Object.keys(pyramidLevels).forEach(level => {
      cy.log(`Testing ${level} level interaction`);
      
      // Click on pyramid level
      cy.get(`[data-testid="pyramid-level-${level}"]`).click();
      
      // Verify detail panel opens
      cy.get(`[data-testid="${level}-details"]`).should('be.visible');
      
      // Verify level-specific content
      cy.get(`[data-testid="${level}-content-list"]`).should('exist');
      cy.get(`[data-testid="${level}-statistics"]`).should('exist');
      
      // Verify level description
      cy.get(`[data-testid="${level}-description"]`)
        .should('exist')
        .and('not.be.empty');
      
      // Close detail panel
      cy.get('[data-testid="close-details"]').click();
      cy.get(`[data-testid="${level}-details"]`).should('not.be.visible');
    });
    
    // Test level transitions
    cy.get('[data-testid="pyramid-level-nourishing"]').click();
    cy.get('[data-testid="transition-to-balanced"]').click();
    cy.get('[data-testid="balanced-details"]').should('be.visible');
    
    cy.get('[data-testid="transition-to-junk"]').click();
    cy.get('[data-testid="junk-details"]').should('be.visible');
  });

  it('validates media consumption categorization', () => {
    // Add media consumption data
    const testMediaData = [
      {
        type: 'Educational Podcast',
        duration: 45,
        category: 'nourishing',
        title: 'Philosophy and Ethics Discussion'
      },
      {
        type: 'News Article',
        duration: 15,
        category: 'balanced',
        title: 'Technology Industry Updates'
      },
      {
        type: 'Social Media',
        duration: 30,
        category: 'junk',
        title: 'Random scrolling'
      }
    ];
    
    // Add each media entry
    testMediaData.forEach((media, index) => {
      cy.visit('/mood-log');
      cy.get('[data-testid="start-mood-log"]').click();
      
      // Add mood data
      cy.get('[data-testid="mood-input"]').type(`Entry ${index + 1} with media`);
      cy.get('[data-testid="mood-level-slider"]').invoke('val', 7).trigger('input');
      
      // Add media consumption
      cy.get('[data-testid="add-media-consumption"]').click();
      cy.get('[data-testid="media-type"]').select(media.type);
      cy.get('[data-testid="media-duration"]').type(media.duration.toString());
      cy.get('[data-testid="media-title"]').type(media.title);
      cy.get('[data-testid="save-media"]').click();
      
      // Submit mood log
      cy.get('[data-testid="submit-mood-log"]').click();
      cy.contains('Mood log saved').should('exist');
    });
    
    // Verify pyramid reflects new data
    cy.visit('/pyramid');
    cy.wait(2000); // Allow time for data processing
    
    // Verify each category has appropriate content
    testMediaData.forEach(media => {
      cy.get(`[data-testid="pyramid-level-${media.category}"]`).click();
      cy.get(`[data-testid="${media.category}-content-list"]`)
        .should('contain.text', media.title);
      cy.get('[data-testid="close-details"]').click();
    });
    
    // Verify time distribution
    const totalTime = testMediaData.reduce((sum, media) => sum + media.duration, 0);
    
    testMediaData.forEach(media => {
      const expectedPercentage = (media.duration / totalTime) * 100;
      cy.get(`[data-testid="pyramid-percentage-${media.category}"]`)
        .invoke('text')
        .then((text) => {
          const actualPercentage = parseFloat(text);
          expect(actualPercentage).to.be.closeTo(expectedPercentage, 5);
        });
    });
  });

  it('validates pyramid data persistence and consistency', () => {
    // Create baseline data
    cy.visit('/mood-log');
    cy.get('[data-testid="start-mood-log"]').click();
    cy.get('[data-testid="mood-input"]').type('Baseline entry for persistence test');
    cy.get('[data-testid="mood-level-slider"]').invoke('val', 8).trigger('input');
    
    // Add media consumption
    cy.get('[data-testid="add-media-consumption"]').click();
    cy.get('[data-testid="media-type"]').select('Educational Book');
    cy.get('[data-testid="media-duration"]').type('60');
    cy.get('[data-testid="media-title"]').type('Persistence test content');
    cy.get('[data-testid="save-media"]').click();
    
    cy.get('[data-testid="submit-mood-log"]').click();
    
    // Navigate to pyramid and capture initial state
    cy.visit('/pyramid');
    cy.wait(2000);
    
    let initialPercentages: { [key: string]: number } = {};
    
    Object.keys(pyramidLevels).forEach(level => {
      cy.get(`[data-testid="pyramid-percentage-${level}"]`)
        .invoke('text')
        .then((text) => {
          initialPercentages[level] = parseFloat(text);
        });
    });
    
    // Refresh page and verify data persists
    cy.reload();
    cy.wait(2000);
    
    Object.keys(pyramidLevels).forEach(level => {
      cy.get(`[data-testid="pyramid-percentage-${level}"]`)
        .invoke('text')
        .then((text) => {
          const currentPercentage = parseFloat(text);
          expect(currentPercentage).to.equal(initialPercentages[level]);
        });
    });
    
    // Navigate away and back
    cy.visit('/dashboard');
    cy.visit('/pyramid');
    cy.wait(2000);
    
    // Verify consistency
    Object.keys(pyramidLevels).forEach(level => {
      cy.get(`[data-testid="pyramid-percentage-${level}"]`)
        .invoke('text')
        .then((text) => {
          const currentPercentage = parseFloat(text);
          expect(currentPercentage).to.equal(initialPercentages[level]);
        });
    });
  });

  it('validates pyramid analytics and insights', () => {
    cy.visit('/pyramid');
    
    // Verify analytics section exists
    cy.get('[data-testid="pyramid-analytics"]').should('exist');
    
    // Test time range filtering
    cy.get('[data-testid="time-range-selector"]').select('Last 7 days');
    cy.wait(1000);
    cy.get('[data-testid="pyramid-loading"]').should('not.exist');
    
    cy.get('[data-testid="time-range-selector"]').select('Last 30 days');
    cy.wait(1000);
    cy.get('[data-testid="pyramid-loading"]').should('not.exist');
    
    // Verify trend analysis
    cy.get('[data-testid="pyramid-trends"]').should('exist');
    cy.get('[data-testid="trend-chart"]').should('be.visible');
    
    // Test trend insights
    Object.keys(pyramidLevels).forEach(level => {
      cy.get(`[data-testid="trend-${level}"]`).should('exist');
      cy.get(`[data-testid="trend-direction-${level}"]`)
        .should('have.attr', 'data-trend')
        .and('match', /up|down|stable/);
    });
    
    // Verify recommendations
    cy.get('[data-testid="pyramid-recommendations"]').should('exist');
    cy.get('[data-testid="recommendation-list"]')
      .children()
      .should('have.length.greaterThan', 0);
    
    // Test recommendation interactions
    cy.get('[data-testid="recommendation-item"]').first().within(() => {
      cy.get('[data-testid="recommendation-text"]').should('not.be.empty');
      cy.get('[data-testid="apply-recommendation"]').should('exist');
    });
  });

  it('validates pyramid export and sharing functionality', () => {
    cy.visit('/pyramid');
    
    // Test export functionality
    cy.get('[data-testid="export-pyramid"]').click();
    cy.get('[data-testid="export-options"]').should('be.visible');
    
    // Test different export formats
    cy.get('[data-testid="export-png"]').click();
    cy.get('[data-testid="export-success"]').should('exist');
    
    cy.get('[data-testid="export-pyramid"]').click();
    cy.get('[data-testid="export-pdf"]').click();
    cy.get('[data-testid="export-success"]').should('exist');
    
    cy.get('[data-testid="export-pyramid"]').click();
    cy.get('[data-testid="export-json"]').click();
    cy.get('[data-testid="export-success"]').should('exist');
    
    // Test sharing functionality
    cy.get('[data-testid="share-pyramid"]').click();
    cy.get('[data-testid="share-options"]').should('be.visible');
    
    // Generate share link
    cy.get('[data-testid="generate-share-link"]').click();
    cy.get('[data-testid="share-link"]').should('exist');
    cy.get('[data-testid="share-link"]')
      .invoke('val')
      .should('match', /https?:\/\/.+/);
    
    // Test share link
    cy.get('[data-testid="share-link"]')
      .invoke('val')
      .then((link) => {
        cy.visit(link as string);
        cy.get('[data-testid="shared-pyramid"]').should('exist');
        cy.get('[data-testid="media-pyramid"]').should('be.visible');
      });
  });

  it('validates pyramid accessibility and responsive design', () => {
    cy.visit('/pyramid');
    
    // Test keyboard navigation
    cy.get('[data-testid="pyramid-level-nourishing"]').focus();
    cy.focused().should('have.attr', 'data-testid', 'pyramid-level-nourishing');
    
    cy.focused().type('{enter}');
    cy.get('[data-testid="nourishing-details"]').should('be.visible');
    
    cy.focused().type('{escape}');
    cy.get('[data-testid="nourishing-details"]').should('not.be.visible');
    
    // Test screen reader support
    Object.keys(pyramidLevels).forEach(level => {
      cy.get(`[data-testid="pyramid-level-${level}"]`)
        .should('have.attr', 'aria-label')
        .and('not.be.empty');
      
      cy.get(`[data-testid="pyramid-percentage-${level}"]`)
        .should('have.attr', 'aria-describedby');
    });
    
    // Test responsive design
    const viewports = [
      { width: 375, height: 667 },  // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1200, height: 800 }  // Desktop
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      cy.wait(500);
      
      // Verify pyramid is visible and properly sized
      cy.get('[data-testid="media-pyramid"]').should('be.visible');
      cy.get('[data-testid="pyramid-container"]')
        .should('have.css', 'width')
        .and('not.equal', '0px');
      
      // Verify levels are clickable
      cy.get('[data-testid="pyramid-level-nourishing"]').should('be.visible');
      cy.get('[data-testid="pyramid-level-balanced"]').should('be.visible');
      cy.get('[data-testid="pyramid-level-junk"]').should('be.visible');
    });
  });

  it('validates pyramid real-time updates', () => {
    cy.visit('/pyramid');
    
    // Capture initial state
    let initialNourishingPercentage: number;
    cy.get('[data-testid="pyramid-percentage-nourishing"]')
      .invoke('text')
      .then((text) => {
        initialNourishingPercentage = parseFloat(text);
      });
    
    // Add new nourishing content
    cy.visit('/mood-log');
    cy.get('[data-testid="start-mood-log"]').click();
    cy.get('[data-testid="mood-input"]').type('Real-time update test');
    cy.get('[data-testid="mood-level-slider"]').invoke('val', 8).trigger('input');
    
    cy.get('[data-testid="add-media-consumption"]').click();
    cy.get('[data-testid="media-type"]').select('Educational Documentary');
    cy.get('[data-testid="media-duration"]').type('120');
    cy.get('[data-testid="media-title"]').type('Real-time test content');
    cy.get('[data-testid="save-media"]').click();
    
    cy.get('[data-testid="submit-mood-log"]').click();
    
    // Return to pyramid and verify update
    cy.visit('/pyramid');
    cy.wait(3000); // Allow time for processing
    
    cy.get('[data-testid="pyramid-percentage-nourishing"]')
      .invoke('text')
      .then((text) => {
        const updatedPercentage = parseFloat(text);
        expect(updatedPercentage).to.be.greaterThan(initialNourishingPercentage);
      });
    
    // Verify real-time indicator
    cy.get('[data-testid="last-updated"]').should('exist');
    cy.get('[data-testid="last-updated"]')
      .invoke('text')
      .should('match', /(just now|few seconds ago|minute ago)/);
  });
});