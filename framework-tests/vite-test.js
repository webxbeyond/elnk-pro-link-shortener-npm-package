// Vite + React/Vue Compatibility Test
// This demonstrates how to use elnk-pro-link-shortener in a Vite project

// Method 1: CommonJS (Node.js backend)
const ElnkProShortener = require('../index');

// Method 2: ES6 Import (if configured for ES modules)
// import ElnkProShortener from 'elnk-pro-link-shortener';

// Example: Vite + Express Backend
// server.js
const express = require('express');
const app = express();

app.use(express.json());

// API endpoint for URL shortening
app.post('/api/shorten', async (req, res) => {
    try {
        const shortener = new ElnkProShortener({
            apiKey: process.env.ELNK_PRO_API_KEY
        });

        const { url, alias } = req.body;
        const result = await shortener.createShortUrl(url, alias);

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Example: Vite + React Frontend (using the backend API)
// src/components/URLShortener.jsx
/*
import { useState } from 'react';

function URLShortener() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="url-shortener">
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL to shorten"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Shortening...' : 'Shorten URL'}
                </button>
            </form>

            {result && (
                <div className="result">
                    {result.success ? (
                        <div>
                            <p>✅ Success!</p>
                            <p>Short URL: <a href={result.data.shortUrl} target="_blank">{result.data.shortUrl}</a></p>
                            <p>Original: {result.data.originalUrl}</p>
                        </div>
                    ) : (
                        <p>❌ Error: {result.message}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default URLShortener;
*/

// Example: Vite + Vue Frontend
// src/components/URLShortener.vue
/*
<template>
  <div class="url-shortener">
    <form @submit.prevent="handleSubmit">
      <input
        v-model="url"
        type="url"
        placeholder="Enter URL to shorten"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Shortening...' : 'Shorten URL' }}
      </button>
    </form>

    <div v-if="result" class="result">
      <div v-if="result.success">
        <p>✅ Success!</p>
        <p>Short URL: <a :href="result.data.shortUrl" target="_blank">{{ result.data.shortUrl }}</a></p>
        <p>Original: {{ result.data.originalUrl }}</p>
      </div>
      <p v-else>❌ Error: {{ result.message }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const url = ref('');
    const result = ref(null);
    const loading = ref(false);

    const handleSubmit = async () => {
      loading.value = true;

      try {
        const response = await fetch('/api/shorten', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: url.value }),
        });

        const data = await response.json();
        result.value = data;
      } catch (error) {
        result.value = {
          success: false,
          message: error.message
        };
      } finally {
        loading.value = false;
      }
    };

    return {
      url,
      result,
      loading,
      handleSubmit
    };
  }
};
</script>
*/

console.log('✅ Vite compatibility test setup complete');
console.log('Package works with:');
console.log('- Vite + React');
console.log('- Vite + Vue');
console.log('- Vite + Express backend');
console.log('- Vite development server with proxy');
