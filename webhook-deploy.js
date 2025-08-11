const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// GitHub webhook secret (optional)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
    console.log('🔔 Webhook received');
    
    // Verify GitHub signature (if secret is set)
    if (WEBHOOK_SECRET) {
        const signature = req.headers['x-hub-signature-256'];
        const payload = JSON.stringify(req.body);
        const expectedSignature = 'sha256=' + crypto
            .createHmac('sha256', WEBHOOK_SECRET)
            .update(payload)
            .digest('hex');
            
        if (signature !== expectedSignature) {
            console.log('❌ Invalid signature');
            return res.status(401).send('Unauthorized');
        }
    }
    
    // Check if it's a push to main branch
    if (req.body.ref === 'refs/heads/main') {
        console.log('🚀 Deploying main branch...');
        
        // Execute deploy script
        exec('cd /var/www/zufariy.uz && ./production-deploy.sh', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Deploy failed:', error);
                return res.status(500).send('Deploy failed');
            }
            
            console.log('✅ Deploy completed');
            console.log('STDOUT:', stdout);
            if (stderr) console.log('STDERR:', stderr);
            
            res.status(200).send('Deploy completed');
        });
    } else {
        console.log('ℹ️ Not main branch, skipping deploy');
        res.status(200).send('Not main branch');
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🎣 Webhook server running on port ${PORT}`);
    console.log(`📡 Webhook URL: http://your-server-ip:${PORT}/webhook`);
});
