process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");


let bread = { name: 'Bread', price: '2.99' };

beforeEach(function () {
    items.push(bread);
});

afterEach(function () {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ items: [bread] })
    })
})

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${bread.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ item: bread })
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/cheese`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Creating an item", async () => {
        const res = await request(app).post("/items").send({ name: 'Cheese', price: '1.99' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ name: 'Cheese', price: '1.99' });
    })
    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    })
})

describe("/PATCH /items/:name", () => {
    test("Updating an item's name", async () => {
        const res = await request(app).patch(`/items/${bread.name}`).send({ name: 'Sliced-Bread', price: '5.99' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: 'Sliced-Bread', price: '5.99' } });
    })
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).patch(`/items/cheese`).send({ name: 'Sliced-Bread', price: '5.99' });
        expect(res.statusCode).toBe(404);
    })
})

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${bread.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ msg: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/cheese`);
        expect(res.statusCode).toBe(404);
    })
})