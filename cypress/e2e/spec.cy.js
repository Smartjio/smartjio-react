describe('Authentication', () => {
  beforeEach(() => {
    cy.visit("/login")
  })

  it('Login', () => {
    cy.get("input#email").type("test2@test.com")
    cy.get("input#password").type("123456")
    cy.get("button").contains("Log In").click()

    cy.contains("Dashboard")
      .should('be.visible')
  })
})

describe('Navigation Bar', () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it('Profile', () => {
    cy.contains("My Profile").click()

    cy.contains("Username")
      .should('be.visible')
    cy.contains("Location")
      .should('be.visible')
    cy.contains("Level")
      .should('be.visible')
    cy.contains("Introduction")
      .should('be.visible')
  })

  it('Notification', () => {
    cy.contains("Notifications").click()

    cy.contains("My Notifications")
      .should('be.visible')
    cy.contains("You currently have no notifications")
      .should('be.visible')
    
    cy.contains("Friend Requests").click()
    cy.contains("You currently have no friend requests")
      .should('be.visible')
  })

  it('Activities', () => {
    cy.contains("Activities").click()

    cy.contains("My activities")
      .should('be.visible')
    cy.contains("Past events")
      .should('be.visible')
  })

  it('Settings', () => {
    cy.contains("Settings").click()

    cy.contains("Edit Your Profile")
      .should('be.visible')
    cy.contains("Update Profile")
      .should('be.disabled')

    cy.get("input#username").type("testing")
    cy.contains("Update Profile")
      .should('not.be.disabled')

    cy.contains("Change your password")
      .should('be.visible')
  })
})