import crypto from 'crypto';

const access_token = crypto.randomBytes(32).toString('hex');
const refresh_token = crypto.randomBytes(32).toString('hex');
