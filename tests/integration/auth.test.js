const request = require('supertest');
const { User } = require('../../models/user-model');
const { Genre } = require('../../models/genre-model');

let server;
let token;

describe('auth middleware', () => {
    beforeEach( () => { 
        server = require('../../index'); 
        token = new User().generateAuthToken();
    });
    afterEach( async () => { 
        await server.close(); 
        await Genre.remove({});
    });

    const exec = function() {
        return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });
    }

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
        server.close();
    });

    it('should return 400 if invalid token', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

});