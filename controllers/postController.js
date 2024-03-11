'use strict'

const pool = require('../db/connection');

//Obtener Post
async function getPosts(req, res) {
    try {
        const [rows] = await pool.query('SELECT * FROM post');

        return res.json({
            success: true,
            posts: rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los posts',
            error: error.message
        });
    }
}

// Obtener Post por el Id
async function getPostById(req, res) {
    try {
        const { postId } = req.params;
        const [rows] = await pool.query('SELECT * FROM post WHERE id = ?', [postId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post no encontrado'
            });
        }

        return res.json({
            success: true,
            post: rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el post',
            error: error.message
        });
    }
}

//Guardar Post
async function savePost(req, res) {
    try {
        const { title, content, author, img } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Los campos title y content son obligatorios'
            });
        }

        const result = await pool.query(
            'INSERT INTO post (title, content, author, img) VALUES (?, ?, ?, ?)',
            [title, content, author, img]
        );

        return res.status(201).json({
            success: true,
            message: 'Post creado exitosamente',
            postId: result[0].insertId 
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al guardar el post',
            error: error.message
        });
    }
}

// Update un Post
async function updatePost(req, res) {
    try {
        const { postId } = req.params;
        const { title, content, author, img } = req.body;

        if (!title && !content && !author && !img) {
            return res.status(400).json({
                success: false,
                message: 'Es necesario proporcionar al menos un campo para actualizar'
            });
        }

        let sql = 'UPDATE post SET ';
        const updates = [];
        const values = [];

        if (title) {
            updates.push('title = ?');
            values.push(title);
        }
        if (content) {
            updates.push('content = ?');
            values.push(content);
        }
        if (author) {
            updates.push('author = ?');
            values.push(author);
        }
        if (img) {
            updates.push('img = ?');
            values.push(img);
        }
        
        sql += updates.join(', ') + ' WHERE id = ?';
        values.push(postId);

        const result = await pool.query(sql, values);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post no encontrado o no se realizó ninguna actualización'
            });
        }

        return res.json({
            success: true,
            message: 'Post actualizado exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el post',
            error: error.message
        });
    }
}

// Eliminar un Post
async function deletePost(req, res) {
    try {
        const { postId } = req.params;
        const result = await pool.query('DELETE FROM post WHERE id = ?', [postId]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post no encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Post eliminado exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el post',
            error: error.message
        });
    }
}

module.exports = {getPosts, getPostById, savePost, updatePost, deletePost}

