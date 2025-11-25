const express = require('express');
const { getClient } = require('../services/supabaseClient');

const router = express.Router();

// GET /api/beats - Get all active beats
router.get('/beats', async (req, res) => {
  try {
    const supabase = getClient();
    if (!supabase) {
      return res.json({ success: false, error: 'Supabase not configured' });
    }

    const { limit = 20, offset = 0, producer } = req.query;

    let query = supabase
      .from('beats')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (producer) {
      query = query.eq('producer_address', producer);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('Beats fetch error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, beats: data || [] });
  } catch (error) {
    console.error('Beats endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/beats - Create new beat
router.post('/beats', async (req, res) => {
  try {
    const supabase = getClient();
    if (!supabase) {
      return res.json({ success: false, error: 'Supabase not configured' });
    }

    const beatData = req.body;
    
    const { data, error } = await supabase
      .from('beats')
      .insert(beatData)
      .select()
      .single();

    if (error) {
      console.error('Beat creation error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, beat: data });
  } catch (error) {
    console.error('Beat creation endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/beats/:beatId - Update beat
router.put('/beats/:beatId', async (req, res) => {
  try {
    const supabase = getClient();
    if (!supabase) {
      return res.json({ success: false, error: 'Supabase not configured' });
    }

    const { beatId } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('beats')
      .update(updates)
      .eq('beat_id', beatId)
      .select()
      .single();

    if (error) {
      console.error('Beat update error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, beat: data });
  } catch (error) {
    console.error('Beat update endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/beats/:beatId/play - Track beat play
router.post('/beats/:beatId/play', async (req, res) => {
  try {
    const supabase = getClient();
    if (!supabase) {
      return res.json({ success: false, error: 'Supabase not configured' });
    }

    const { beatId } = req.params;
    const { user_address, source = 'api', optimized = false } = req.body;
    
    // Insert play record
    const { error: playError } = await supabase
      .from('beat_plays')
      .insert({
        beat_id: beatId,
        user_address,
        source,
        optimized
      });

    if (playError) {
      console.error('Play tracking error:', playError);
    }

    // Increment play count using RPC function
    const { error: incrementError } = await supabase
      .rpc('increment_beat_plays', { beat_id: beatId });

    if (incrementError) {
      console.error('Play increment error:', incrementError);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Play tracking endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;