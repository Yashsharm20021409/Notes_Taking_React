const express = require("express");
const { authenticationToken } = require("../utilities");
const router = express.Router();
const Note = require("../models/Notes");

// add Note
router.post("/add-note", authenticationToken, async (req, res) => {
    try {
        const { title, content, tags, } = req.body;
        const user = req.user;

        if (!(title && content)) {
            return res.status(400).json({
                error: true,
                message: "Please Fill All the Fields."
            })
        }

        const note = Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        });

        await note.save();

        return res.status(200).json({ error: false, note, message: "Note Added Successfully" })

    } catch (error) {
        return res.status(501).json({ error: true, message: "Internal server error" })
    }
})

// edit Note
router.put("/edit-note/:noteId", authenticationToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const { title, content, tags, isPinned } = req.body;
        const user = req.user;

        if (!title && !content && !tags) {
            return res.status(400).json({
                error: true,
                message: "No changes provided"
            })
        }

        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) { note.title = title; }
        if (content) { note.content = content; }
        if (tags) { note.tags = tags; }
        if (isPinned) { note.isPinned = isPinned; }

        await note.save();

        return res.status(200).json({ error: false, note, message: "Note updated successfully" })

    } catch (error) {
        // console.log(error)
        return res.status(501).json({ error: true, message: "Internal server error" })
    }
})

// get all Notes
router.get("/get-all-notes", authenticationToken, async (req, res) => {
    try {
        const user = req.user; // get though authenticationToken

        const notes = await Note.find({ userId: user._id }).sort({
            isPinned: -1
        });

        return res.status(200).json({
            error: false,
            notes,
            message: "All notes reterived Successfully"
        })
    } catch (error) {
        return res.status(501).json({ error: true, message: "Internal server error" })
    }
})

// Delete Notes
router.delete("/delete-note/:noteId", authenticationToken, async (req, res) => {
    try {
        const user = req.user;
        const noteId = req.params.noteId;

        const note = await Note.find({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        res.status(200).json({
            error: false,
            message: "Note Deleted Successfully"
        })

    } catch (error) {
        return res.status(501).json({ error: true, message: "Internal server error" })
    }
})

// update isPinned Value
router.put("/update-note-pinned/:noteId", authenticationToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const { isPinned } = req.body;
        const user = req.user;

        if (!isPinned) {
            return res.status(400).json({
                error: true,
                message: "No changes provided"
            })
        }

        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (isPinned) { note.isPinned = !note.isPinned; }

        await note.save();

        return res.status(200).json({ error: false, note, message: "Note updated successfully" })

    } catch (error) {
        // console.log(error)
        return res.status(501).json({ error: true, message: "Internal server error" })
    }
})

// Search Note

router.get('/search-notes/', authenticationToken, async (req, res) => {
    const user = req.user;
    const { query } = req.query;
    // console.log(req.cookies)

    // console.log(req.query);

    if (!query) {
        return res.status(400).json({
            error: true,
            message: "Search query is required"
        })
    }

    try {

        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ]
        });

        return res.status(200).json({
            error: false,
            notes: matchingNotes,
            message: "Notes Matching the Search query retrieved Successfully"
        });

    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal server error" })
    }
})

module.exports = router;