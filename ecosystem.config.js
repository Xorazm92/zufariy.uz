module.exports = {
  apps: [
    {
      name: 'zufariy-server',
      script: 'server/minimal-server.js',
      instances: 'max', // PM2 will convert string 'max' to use all cores, but you can use max without quotes in newer PM2
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      min_uptime: '10s',
      max_restarts: 10,
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      kill_timeout: 5000
    },
    {
      name: 'webhook-server',
      script: 'webhook-deploy.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server-ip', // <--- CHANGE THIS TO YOUR ACTUAL SERVER IP OR HOSTNAME
      ref: 'origin/main',
      repo: 'https://github.com/Xorazm92/zufariy.uz.git',
      path: '/var/www/zufariy.uz',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci --omit=dev && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};