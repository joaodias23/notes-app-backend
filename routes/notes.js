const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const protect = require('../middleware/auth');

// get all notes for user
router.get('/', protect, async (req, res) => {
  const notes = await Note.find({ userId: req.user._id });
  res.json(notes);
});

// create note
router.post('/', protect, async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ userId: req.user._id, title, content });
  await note.save();
  res.status(201).json(note);
});

// update note
router.put('/:id', protect, async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  if (note.userId.toString() !== req.user._id.toString())
    return res.status(401).json({ message: 'Not authorized' });

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;
  await note.save();
  res.json(note);
});

// delete note
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // check ownership
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await note.deleteOne();

    res.json({ message: 'Note removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
