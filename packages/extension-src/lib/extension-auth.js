// Minimal extension auth helper that prompts for an idToken (dev) and exchanges it for an MCP session
(function () {
  class ExtensionAuth {
    constructor(baseUrl) {
      this.backend = new (require('./backend-client'))(baseUrl || (window && window.MCP_BASE_URL) || '')
    }

    // Dev helper - prompt for a mock idToken or accept a provided one
    async createSessionViaPrompt() {
      try {
        let idToken = null
        try { idToken = prompt('Paste idToken (for dev) or leave blank to use mock:') } catch (e) { idToken = null }
        if (!idToken) idToken = 'dev-mock-token'
        const resp = await this.backend.createSession(idToken)
        console.log('MCP createSession result:', resp)
        return resp
      } catch (err) {
        console.error('createSessionViaPrompt failed:', err)
        throw err
      }
    }

    loadSession() {
      this.backend.loadSession()
      return this.backend.sessionToken
    }
  }

  window.ExtensionAuth = ExtensionAuth
})()
