// Minimal backend client for MCP endpoints used by the extension
class BackendClient {
  constructor(baseUrl) {
    // baseUrl should be the MCP server origin, e.g. https://api.beatschain.app or http://localhost:4000
    this.baseUrl = baseUrl || (window && window.MCP_BASE_URL) || ''
    this.sessionToken = null
  }

  // Exchange idToken for a server session via MCP /api/token-exchange
  async createSession(idToken){
    const resp = await this.postJSON('/api/token-exchange', { idToken })
    if(resp && resp.sessionToken){
      this.sessionToken = resp.sessionToken
      // persist in localStorage for extension lifetime
      try{ localStorage.setItem('mcp_session_token', resp.sessionToken) }catch(e){}
    }
    return resp
  }

  loadSession(){
    try{ this.sessionToken = localStorage.getItem('mcp_session_token') }catch(e){}
    return this.sessionToken
  }

  async postJSON(path, body){
    const url = this.baseUrl ? `${this.baseUrl.replace(/\/$/, '')}${path}` : path
    const headers = { 'Content-Type': 'application/json' }
    if(this.sessionToken) headers['Authorization'] = `Bearer ${this.sessionToken}`
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
    if(!resp.ok){
      const txt = await resp.text()
      throw new Error(`Backend ${path} failed: ${resp.status} ${txt}`)
    }
    return resp.json()
  }

  async uploadFile(path, file, metadata={}){
    const url = this.baseUrl ? `${this.baseUrl.replace(/\/$/, '')}${path}` : path
    const fd = new FormData()
    fd.append('file', file)
    fd.append('metadata', JSON.stringify(metadata))
    const headers = {}
    if(this.sessionToken) headers['Authorization'] = `Bearer ${this.sessionToken}`
    const resp = await fetch(url, { method: 'POST', body: fd, headers })
    if(!resp.ok){
      const txt = await resp.text()
      throw new Error(`Backend ${path} failed: ${resp.status} ${txt}`)
    }
    return resp.json()
  }
}

window.BackendClient = BackendClient

module.exports = BackendClient
