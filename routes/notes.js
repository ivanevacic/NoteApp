const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

//Load Auth Helper

//Load Note Model
require('../models/Note');
const Note = mongoose.model('notes');

//Add note-form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('notes/add');
});

//Edit note-form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Note.findOne({
    _id: req.params.id
  })
  .then(note => {
    if(note.user != req.user.id){ //Protection so notes from other users entered through URL can't be edited
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/notes');
    } else {
      res.render('notes/edit', {
        note: note
      });
    }  
  }); 
});

//Notes index page
router.get('/', ensureAuthenticated, (req, res) => {
  Note.find({user: req.user.id})  //Show only notes that are created by currently logged in user
      .sort({date: 'desc'})       //sort in descending order
      .then(notes => {
        res.render('notes/index', {
          notes: notes
        });
    }); 
});

//Process Form
router.post('/', ensureAuthenticated, (req, res) => {

  //Server side validation
  let errors = [];
  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text: 'Please add some details'});
  }
  if(errors.length > 0){
    res.render('notes/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Note(newUser)
    .save()
    .then(note => {
      req.flash('success_msg', 'Note added!');
      res.redirect('/notes');
    })
  }
});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res)=> {
  Note.findOne({
    _id: req.params.id
  })
  .then(note => {
    note.title = req.body.title;
    note.details = req.body.details;
    note.save()
        .then(note => {
          req.flash('success_msg', 'Note updated!');
          res.redirect('/notes');
        })
  });
});

//Delete note
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Note.remove({_id: req.params.id})
      .then(() => {
        req.flash('error_msg', 'Note deleted!');
        res.redirect('/notes');
      });
});






module.exports = router;