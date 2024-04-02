//const pool = require('../db/connection');
import e from 'express';
import pool from './connection.js';

//Obtener Post
export async function getPosts() {
    try {
      const [rows] = await pool.query('SELECT * FROM post');
      return rows;
    } catch (error) {
      console.error('Error al obtener posts:', error);
      throw error; // Re-lanza el error para manejarlo más arriba en la cadena de promesas.
    }
  }

  export async function getPostById(req, res) {
    const { postId } = req.params;
    try {
      // Utiliza parámetros con placeholders para prevenir inyección SQL
      const [rows] = await pool.query('SELECT * FROM post WHERE id = ?', [postId]);
      if (rows.length > 0) {
        const post = rows[0];
        res.json(post);
      } else {
        // Si no se encuentra el post, envía un código de estado 404 (No encontrado)
        res.status(404).send('Post no encontrado');
      }
    } catch (error) {
      res.status(500).send('Error interno del servidor');
    }
  };

  export async function createPost(req, res) {
    // Destructurando el cuerpo de la solicitud para obtener las variables necesarias
    const { title, content, created_at, author, img } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO post (title, content, created_at, author, img) VALUES (?, ?, ?, ?, ?)',
            [title, content, created_at, author, img],
        );

        // Si la inserción es exitosa, devolver una respuesta adecuada
        return res.status(201).json({ message: 'Post creado', postId: result.insertId });
    } catch (error) {
        // Loguear el error para el debugging. En producción, sería mejor usar una herramienta de logging.
        console.error(error);

        // Errores específicos de la base de datos pueden tener un manejo especial
        if (error.code === 'ER_DUPLICATE_ENTRY') {
            return res.status(409).json({ error: 'Entrada duplicada' });
        }

        // Manejar el error circular específico que mencionaste
        if (error.message.includes("Converting circular structure to JSON")) {
            return res.status(500).json({ error: 'Estructura circular detectada' });
        }

        // Para otros errores no manejados específicamente, devolver un error genérico
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export async function updatePost(req, res) {
    const { postId } = req.params;
    const { title, content, author, created_at, img } = req.body;

    try {
        const result = await pool.query(
            'UPDATE post SET title = ?, content = ?, author = ?, created_at = ?, img = ? WHERE id = ?',
            [title, content, author, created_at, img, postId],
        );

        // Verifica si la actualización tuvo éxito
    if (result[0].affectedRows > 0) {
        // Si fue exitosa, recupera el post actualizado para devolverlo
          const [updatedPosts] = await pool.query('SELECT * FROM post WHERE id = ?', [postId]);
    
          if (updatedPosts.length > 0) {
            res.status(200).json(updatedPosts[0]);
          } else {
          // Si el post no se encuentra después de la actualización, envía un 404
            res.status(404).send('Post no encontrado');
          }
        } else {
        // Si no se actualizaron filas, probablemente el post con ese ID no existe
          res.status(404).send('Post no encontrado o datos no modificados');
        }
      } catch (error) {
        console.error('Error al actualizar el post:', error);
        res.status(500).send('Error interno del servidor');
      }
};

export async function deletePost(req, res) {
    const { postId } = req.params; // Obtén el ID del post de los parámetros de la URL

  // Asegúrate de que el ID del post esté presente
  if (!postId) {
    return res.status(400).send('ID del post requerido');
  }

  try {
    // Borra el post en la base de datos utilizando el ID del post
    const result = await pool.query('DELETE FROM post WHERE id = ?', [postId]);

    // Verifica si la eliminación fue exitosa
    if (result[0].affectedRows > 0) {
      // Si el post se borró exitosamente, devuelve un estado HTTP 204
      res.status(204).send();
    } else {
    // Si no se borraron filas, probablemente el post con ese ID no existe
      res.status(404).send('Post no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
}



