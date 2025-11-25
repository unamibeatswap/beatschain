// MCP Integration for SAMRO Split Sheet Module
export * from '../split-sheet-module/index';

// MCP Route for SAMRO PDF processing
export const samroRoutes = {
  '/api/samro/generate': 'POST - Generate SAMRO split sheet',
  '/api/samro/fill': 'POST - Fill SAMRO form with user data',
  '/api/samro/validate': 'POST - Validate split sheet data'
};

// Integration with existing MCP server
export function integrateSAMRORoutes(app: any) {
  const { createSplitSheet, fillSAMROPDF } = require('../split-sheet-module');
  
  app.post('/api/samro/generate', async (req: any, res: any) => {
    try {
      const splitSheet = await createSplitSheet(req.body);
      res.json({ success: true, data: splitSheet });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  app.post('/api/samro/fill', async (req: any, res: any) => {
    try {
      const { userData, contributors } = req.body;
      const instructions = await fillSAMROPDF(userData, contributors);
      res.json({ success: true, instructions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

// Sponsor CRUD Integration
export function integrateSponsorRoutes(app: any) {
  const sponsors: any[] = [];
  
  // GET /api/sponsors - List sponsors with filtering
  app.get('/api/sponsors', (req: any, res: any) => {
    const { placement, active, campaign } = req.query;
    let filtered = [...sponsors];
    
    if (placement) filtered = filtered.filter(s => s.placement === placement);
    if (active !== undefined) filtered = filtered.filter(s => s.active === (active === 'true'));
    if (campaign) filtered = filtered.filter(s => s.campaign.includes(campaign));
    
    res.json({ success: true, data: filtered });
  });
  
  // POST /api/sponsors - Create new sponsor
  app.post('/api/sponsors', (req: any, res: any) => {
    const sponsor = {
      id: 'sponsor_' + Date.now(),
      ...req.body,
      created: new Date().toISOString()
    };
    
    sponsors.push(sponsor);
    res.json({ success: true, data: sponsor });
  });
  
  // PUT /api/sponsors/:id - Update sponsor
  app.put('/api/sponsors/:id', (req: any, res: any) => {
    const index = sponsors.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Sponsor not found' });
    }
    
    sponsors[index] = { ...sponsors[index], ...req.body, updated: new Date().toISOString() };
    res.json({ success: true, data: sponsors[index] });
  });
  
  // DELETE /api/sponsors/:id - Delete sponsor
  app.delete('/api/sponsors/:id', (req: any, res: any) => {
    const index = sponsors.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Sponsor not found' });
    }
    
    sponsors.splice(index, 1);
    res.json({ success: true, message: 'Sponsor deleted' });
  });
}
