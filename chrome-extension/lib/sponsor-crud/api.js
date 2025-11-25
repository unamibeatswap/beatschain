// API integration for Extension CRUD
class SponsorAPI {
  baseUrl;
  
  constructor(baseUrl = 'https://beatschain-mcp-production.up.railway.app') {
    this.baseUrl = baseUrl;
  }
  
  async createSponsor(sponsor) {
    const response = await fetch(`${this.baseUrl}/api/sponsors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body.stringify(sponsor)
    });
    return response.json();
  }
  
  async getSponsors(filters?) {
    const params = new URLSearchParams(filters || {});
    const response = await fetch(`${this.baseUrl}/api/sponsors?${params}`);
    return response.json();
  }
  
  async updateSponsor(id, updates) {
    const response = await fetch(`${this.baseUrl}/api/sponsors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body.stringify(updates)
    });
    return response.json();
  }
  
  async deleteSponsor(id) {
    const response = await fetch(`${this.baseUrl}/api/sponsors/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
}