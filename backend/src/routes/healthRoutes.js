const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// AI Service URL (Flask microservice)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5001';

// Disease prediction endpoint (Streaming)
router.post('/predict', auth, async (req, res) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${AI_SERVICE_URL}/predict`,
      data: req.body,
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    let buffer = ''; // Store partial words

    response.data.on('data', (chunk) => {
      const text = chunk.toString();
      
      // Fix broken words by checking the last character
      if (buffer && !buffer.endsWith(' ')) {
        buffer += text;
      } else {
        res.write(text);
        buffer = ''; // Reset buffer
      }
    });

    response.data.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});


module.exports = router;
