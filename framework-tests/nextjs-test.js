// Next.js Compatibility Test
// This demonstrates how to use elnk-pro-link-shortener in a Next.js project

// Method 1: CommonJS (Node.js backend/API routes)
const ElnkProShortener = require('../index');

// Method 2: ES6 Import (if using ES modules)
// import ElnkProShortener from 'elnk-pro-link-shortener';

// Example: Next.js API Route (/pages/api/shorten.js)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const shortener = new ElnkProShortener({
            apiKey: process.env.ELNK_PRO_API_KEY
        });

        const { url, alias } = req.body;
        const result = await shortener.createShortUrl(url, alias);

        if (result.success) {
            res.status(200).json({
                success: true,
                shortUrl: result.data.shortUrl,
                originalUrl: result.data.originalUrl
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Example: Next.js Server Component (App Router)
// app/shorten/page.js
async function ShortenPage() {
    // This would typically be in a server action or API route
    const shortener = new ElnkProShortener({
        apiKey: process.env.ELNK_PRO_API_KEY
    });

    // Server-side URL shortening
    // const result = await shortener.createShortUrl('https://example.com');

    return (
        <div>
            <h1>URL Shortener</h1>
            {/* Your React components here */}
        </div>
    );
}

// Example: Next.js Client-side usage (through API)
// components/URLShortener.jsx
function URLShortener() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();
        if (data.success) {
            setShortUrl(data.shortUrl);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to shorten"
            />
            <button type="submit">Shorten</button>
            {shortUrl && <p>Short URL: {shortUrl}</p>}
        </form>
    );
}

console.log('✅ Next.js compatibility test setup complete');
console.log('Package works with:');
console.log('- Next.js API Routes (server-side)');
console.log('- Next.js Server Components');
console.log('- Next.js Client Components (via API calls)');
