const express = require('express');
const router = express.Router();
const Post = require('../model/post');
const mongoose = require('mongoose');
const User = require('C:/Users/NGX05964/Blog_App/server/model/user'); // Changed user to User
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const post = require('../model/post');
require('dotenv').config();

const adminLayout = 'admin';
const jwtSecret = process.env.JWT_SECRET; // Corrected variable name


router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "admin dashboard"
        }
        res.render('adminindex', { locals, layout: adminLayout });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Corrected bcrypt.hass to bcrypt.hash

        try {
            const user = await User.create({ firstName, lastName, email, password: hashedPassword }); // Corrected UserActivation to User
            res.status(200).json({ Message: 'User Created', user }); // Changed status to 200 for successful creation
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already exists' }); // Changed message to 'User already exists'
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// GET login page
router.get('/login', (req, res) => {
    res.render('login'); // Render the login form
});

// POST login data
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/dashboard', async (req, res)=>{
    try {
        const locals = {
            title: "Dashboard",
            description: "admin dashboard"
        }
        const data = await Post.find(); // Fetch all posts
        res.render('dashboard', { locals, layout: adminLayout, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


router.get('/create-post', async (req, res)=>{
    try {
        const locals = {
            title: "Add post",
            description: "admin add post"
        }
        res.render('create-post', { locals, layout: adminLayout });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
router.post('/create-post', async (req, res) => {
    try {
        const { title, body } = req.body;

        // Create a new post
        const newPost = await Post.create({ title, body });

        res.redirect('/dashboard'); // Redirect to dashboard after creating the post
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/edit-post/:id', async (req, res) => {
    try {
        console.log('Edit Post Route Accessed');
        const locals = {
            title: "Edit Post",
            description: "edit post"
        }
        const data = await Post.findOne({ _id: req.params.id });
        res.render('edit-post', { locals, layout: 'admin', data: data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.put("/edit-post/:id", async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect("/admin/edit-post/${req.params.id}");
        console.log('redirect')
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Other routes...

router.delete('/delete-post/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Find the post by ID and delete it
        await Post.findByIdAndDelete(postId);

        res.redirect('/dashboard'); // Redirect to dashboard after deleting the post
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;






module.exports = function (app) {
    // Set layout here
    app.set('layout', 'layout');
    // You can define more routes or other configurations related to app here if needed
    return router;
};
