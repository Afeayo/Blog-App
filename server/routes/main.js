const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../model/post');
const { render } = require('ejs');
const adminLayout = '../view/admin'

// Cons  tants for pagination
const PAGE_SIZE = 5; // Number of documents per page

// Routes
router.get('', async (req, res) => {
    const locals = {
        title: 'AFEAYO Blog',
        description: 'Afe Ayo Sunday Backend Engineer Blog'
    };

    try {
        // Get the page number from query parameters
        const page = parseInt(req.query.page) || 1;

        // Calculate skip value based on page number and page size
        const skip = (page - 1) * PAGE_SIZE;

        // Fetch data with pagination
        const data = await Post.find().skip(skip).limit(PAGE_SIZE);
       //console.log('Retrieved data:', data);


        // Count total number of documents for pagination
        const totalCount = await Post.countDocuments();
        

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);

        // Pass data, totalCount, page, totalPages, and other locals to the template
        res.render('index', { locals, data, totalCount, page, totalPages, pageSize: PAGE_SIZE });
        //console.log(data)
        //console.log(Post)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//get post by id

router.get('/post/:id', async (req, res)=>{
    try {
        let postId = req.params.id; // Assuming the ID is named postId

        const data = await Post.findById(postId);
        const locals = {
            title:data.title,
            description: 'Afe Ayo Sunday Backend Engineer Blog'
        };
        res.render('Post', {locals, data});

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})
//post by search term
// main.js or wherever you define the search route
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: req.body.searchTerm, // Use req.body.searchTerm here
            description: 'Afe Ayo Sunday Backend Engineer Blog'
        };
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^A-Za-z0-9]/g, '');
       
        const data = await Post.find({
            $or:[
                {title:{$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body:{$regex: new RegExp(searchNoSpecialChar, 'i')}} 
            ]
        });

        // Render the search page with the data
        res.render('search', { data, locals });
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
});



router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = function (app) {
    // Set layout here
    app.set('layout', 'layout');
    // You can define more routes or other configurations related to app here if needed
    return router;
};
