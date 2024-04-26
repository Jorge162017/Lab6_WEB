//Index
import { getPosts } from "./postController.js";
import { getPostById } from "./postController.js";
import { createPost } from "./postController.js";
import { updatePost } from "./postController.js";
import { deletePost } from "./postController.js";
import express from 'express';
import connection from './connection.js';
import cors from 'cors';

const app = express();


app.use(express.json());
app.use(cors());

app.get("/post", async(req, res) => { 
    const callPost = await getPosts();
    res.json(callPost);
})

app.get("/post/:postId", async(req, res) => {
    const callPost = await getPostById(req, res);
    res.json(callPost);
})

app.post("/post", async(req, res) => {
    const callPost = await createPost(req, res);
    res.json(callPost);
})

app.put("/post/:postId", async(req, res) => {
    const callPost = await updatePost(req, res);
    res.json(callPost);
})

app.delete("/post/:postId", async(req, res) => {
    const callPost = await deletePost(req, res);
    res.json(callPost);
})

const port = 3800;


app.listen(port, ()=> {
    console.log("servidor puerto 3800");
})