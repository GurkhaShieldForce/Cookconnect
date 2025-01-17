const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'FACEBOOK_APP_ID',
    'FACEBOOK_APP_SECRET'
];

const checkEnvVars = () => {
    const missing = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }
};

module.exports = { checkEnvVars };
