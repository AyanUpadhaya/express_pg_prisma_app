const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.getNotesByUserId = async (req, res, next) => {
  try {
    const notes = await prisma.notes.findMany({
      where: { user_id: req.user.id },
    });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};
exports.getNotes = async (req, res, next) => {
  try {
    const notes = await prisma.notes.findMany();
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const note = await prisma.notes.create({
      data: {
        title,
        content,
        user_id: req.user.id,
      },
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    // Find the note first
    const existingNote = await prisma.notes.findUnique({
      where: { id: req.params.id },
    });

    if (!existingNote || existingNote.user_id !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    const note = await prisma.notes.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.json({ message: "Note deleted", note });
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const noteId = parseInt(req.params.id);

    // Find the note first
    const existingNote = await prisma.notes.findUnique({
      where: { id: noteId },
    });

    if (!existingNote || existingNote.user_id !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    const updatedNote = await prisma.notes.update({
      where: { id: noteId },
      data: { title, content },
    });

    res.json({ message: "Note updated", note: updatedNote });
  } catch (err) {
    next(err);
  }
};
