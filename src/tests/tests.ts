import {describe, expect, test, it, beforeAll} from '@jest/globals';
import request from "supertest";
import  app  from "../app"
import prisma from "../db/db"


let refreshtoken:string;
let accesstoken:string;
describe("User Apis", () => {
    it("Add a new user1", async () => {
        const res = await request(app).post("/api/auth/signup").send({
           "username":"test7777",
           "password":"testpass",
           "email":"test4@gmail.com",
           "age":17
        });
        console.log(res.body)
        expect(res.statusCode).toBe(201);
        expect(res.text).toBe("User created successfully");
      });

       it("Add a new user2", async () => {
        const res = await request(app).post("/api/auth/signup").send({
           "username":"test8888",
           "password":"testpass",
           "email":"test7@gmail.com",
           "age":17
        });
        console.log(res.body)
        expect(res.statusCode).toBe(201);
        expect(res.text).toBe("User created successfully");
      });

      it("Retry duplicate username", async () => {
        const res = await request(app).post("/api/auth/signup").send({
          "username":"test7777",
           "password":"testpass",
           "email":"test2@gmail.com",
           "age":17
        });
        expect(res.statusCode).toBe(500);
      });

      it("User Login", async () => {
        const res = await request(app).post("/api/auth/login").send({
          "username":"test7777",
          "password":"testpass"
        });
        expect(res.statusCode).toBe(200);
        accesstoken = res.body.access
        refreshtoken = res.body.refresh
      });

      it("User Access Token refresh", async () => {
        const res = await request(app).post("/api/auth/refresh").send({
          "refreshtoken":refreshtoken
        });
        expect(res.statusCode).toBe(200);
        accesstoken = res.body.accesstoken
      });
});

describe("Create Questions", () => {
    it("Create Question1", async () => {

       const user = await prisma.user.findUnique(
        {
            where:{
                username:"test7777"
            }
        }
       ) || {"id":1}
       await prisma.questions.create({
        data:{
            "question":"What are tests",
            "answer":"Tests are boring and annoying",
            "userid":user.id
        }
       })
      });

      it("Create a Question2", async () => {

       const user = await prisma.user.findUnique(
        {
            where:{
                username:"test8888"
            }
        }
       ) || {"id":1}
       await prisma.questions.create({
        data:{
            "question":"Why are tests boring",
            "answer":"Because they are not meant to be written",
            "userid":user.id
        }
       })
      });
});


describe("Get Questions", () => {
    it("Get Question1", async () => {
       const res = await request(app)
      .get('/api/questions')
      .set('Authorization', `Bearer ${accesstoken}`)
        expect(res.statusCode).toBe(200);
        console.log(res.body)
      });

})




