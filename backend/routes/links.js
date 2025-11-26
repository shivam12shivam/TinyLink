// routes/links.js
const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const { isValidCode, isValidUrl, generateCode } = require('../validators');

// Create link
// POST /api/links
// body: { url: string, code?: string }
router.post('/', async (req, res) => {
  try {
    const { url, code: customCode } = req.body || {};
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    let code = customCode;

    if (code) {
      if (!isValidCode(code)) {
        return res.status(400).json({ error: 'Custom code must match [A-Za-z0-9]{6,8}' });
      }
      const exists = await Link.findOne({ code }).lean();
      if (exists) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      // generate until unique (very low chance of collision)
      // in practice, this loop will run once almost always
      // but we still check to be safe
      // (no infinite loop due to huge code space)
      /* eslint-disable no-await-in-loop */
      do {
        code = generateCode(6);
      } while (await Link.findOne({ code }).lean());
      /* eslint-enable no-await-in-loop */
    }

    const link = await Link.create({ code, url });
    return res.status(201).json({ code: link.code, url: link.url });
  } catch (err) {
    console.error('Error creating link:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// List all links
// GET /api/links
router.get('/', async (req, res) => {
  try {
    const links = await Link.find({})
      .sort({ created_at: -1 })
      .select('code url clicks last_clicked created_at')
      .lean();

    return res.json(links);
  } catch (err) {
    console.error('Error listing links:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Stats for one code
// GET /api/links/:code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ code })
      .select('code url clicks last_clicked created_at')
      .lean();

    if (!link) return res.status(404).json({ error: 'Not found' });

    return res.json(link);
  } catch (err) {
    console.error('Error fetching link:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a link
// DELETE /api/links/:code
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const deleted = await Link.findOneAndDelete({ code }).lean();
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    return res.json({ ok: true, code });
  } catch (err) {
    console.error('Error deleting link:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
