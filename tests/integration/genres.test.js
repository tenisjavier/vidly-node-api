//@desc     Integration test for Genres routes
const request = require('supertest');
const { Genre } = require('../../models/genre-model'); 
const { User } = require('../../models/user-model');
const mongoose = require('mongoose');
let server; 

describe('/api/genres', () => {
    
    beforeEach( () => { server = require('../../index'); });
    afterEach( async () => { 
        await server.close(); 
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some( g => g.name === 'genre1')).toBeTruthy(); 
            expect(res.body.some( g => g.name === 'genre2')).toBeTruthy();          
        });
    });

    describe('GET /:id', () => {
        
        it('should return the genre of that specific id', async () => {
            const genre = new Genre({ name: 'kids' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);

        });

        it('should return 404 if not found', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            
            expect(res.status).toBe(404);
        });

        it('should return 404 if Invalid ID', async () => {
            const res = await request(server).get('/api/genres/1');
            
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;
        const exec = function() {
            return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name});
        }

        beforeEach( () => {
            token = new User().generateAuthToken();
            name = 'genre1'
        })

        it('should return 401 if not authorized', async () => {
            token = '';
            const res = await exec()
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 3 characters', async () => {
            name = '12';
            const res = await exec();           
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();           
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            const res = await exec(); 
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');

        });
    });

    describe('PUT /', () => {

        let token;
        let id;
        let name;
        const exec = function() {
            return request(server)
            .put('/api/genres/' + id)
            .set('x-auth-token', token)
            .send({name});
        }

        beforeEach( async () => {
            token = new User().generateAuthToken();
            name = 'genre1';
            const genre = new Genre({ name: 'genre2' });
            await genre.save();
            id = genre.id;
        })

        it('should return 401 if not authorized', async () => {
            token = '';
            const res = await exec()
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 3 characters', async () => {
            name = '12';
            const res = await exec();           
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();           
            expect(res.status).toBe(400);
        });

        it('should return 404 if Invalid ID', async () => {        
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 404 if not found', async () => {        
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should update the genre if it is valid', async () => {
            const res = await exec();             
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');

        });
    });

    describe('DELETE /', () => {
        let token;
        let id;
        const exec = function() {
            return request(server)
            .delete('/api/genres/' + id)
            .set('x-auth-token', token);
        }
        beforeEach( async () => { 
            token = new User({'isAdmin': true}).generateAuthToken();
         });

         
        it('should return 404 if not found', async () => {        
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
            
        it('should return 404 if Invalid ID', async () => {        
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });
            
        it('should return 403 if not Admin', async () => {        
            token = new User({'isAdmin': false}).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });
            
        it('should return 401 if no token', async () => {        
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
            
        it('should delete item of a specific id', async () => {        
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            id = genre.id;
    
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });  
});