// API integration for Extension CRUD
export class SponsorAPI {
  private baseUrl: string;
  
  constructor(baseUrl = 'https://beatschain-mcp-production.up.railway.app') {
    this.baseUrl = baseUrl;
  }
  
  async createSponsor(sponsor: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/sponsors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sponsor)
    });
    return response.json();
  }
  
  async getSponsors(filters?: any): Promise<any> {
    const params = new URLSearchParams(filters || {});
    const response = await fetch(`${this.baseUrl}/api/sponsors?${params}`);
    return response.json();
  }
  
  async updateSponsor(id: string, updates: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/sponsors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }
  
  async deleteSponsor(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/sponsors/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
}