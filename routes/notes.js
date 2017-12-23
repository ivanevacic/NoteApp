const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Note Model
require('../models/Note');
const Note = mongoose.model('notes');

//Add note-form
router.get('/add', (req, res) => {
  res.render('notes/add');
});

//Edit note-form
router.get('/edit/:id', (req, res) => {
  Note.findOne({
    _id: req.params.id
  })
  .then(note => {
    res.render('notes/edit', {
      note: note
    });
  }); 
});

//Notes index page
router.get('/', (req, res) => {
  Note.find({})
      .sort({date: 'desc'})       //sort in descending order
      .then(notes => {
        res.render('notes/index', {
          notes: notes
        });
    }); 
});

//Process Form
router.post('/', (req, res) => {

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
      details: req.body.details
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
router.put('/:id', (req, res)=> {
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
router.delete('/:id', (req, res) => {
  Note.remove({_id: req.params.id})
      .then(() => {
        req.flash('error_msg', 'Note deleted!');
        res.redirect('/notes');
      });
});






module.exports = router;