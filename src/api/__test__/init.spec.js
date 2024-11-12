import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../setupServer';

const req = request(app);

const waitForConnection = async () => {
    let attempts = 0;
    while (attempts < 5 && mongoose.connection.readyState !== 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
    }
};

describe('Testing Home Page', () => {
    beforeAll(async () => {
        await waitForConnection();
    });

    it('Server Should Be Running', async () => {
        const res = await req.get('/');
        expect(res.status).toBe(200);
        expect(res.body.data).toBe('server is running');
    });
});

describe('Checking For Server Health', () => {
    let res;

    beforeAll(async () => {
        await waitForConnection();
        res = await req.get('/health');
    });

    it('Should Report Back Positive', async () => {
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('OK');
        expect(res.body.message).toBe('Server is running');
        expect(res.body.dbStatus).toBe('Connected');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('uptime');
    });
});
