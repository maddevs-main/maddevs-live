module.exports = {
    apps: [
        {
            name: 'maddevs-backend',
            cwd: './server',
            script: 'index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 4000
            },
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_file: './logs/combined.log',
            time: true
        },
        {
            name: 'maddevs-frontend',
            cwd: './',
            script: 'npm',
            args: 'start',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            error_file: './logs/frontend-err.log',
            out_file: './logs/frontend-out.log',
            log_file: './logs/frontend-combined.log',
            time: true
        }
    ]
}; 