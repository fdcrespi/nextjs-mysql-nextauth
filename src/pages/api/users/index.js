const jwt = require('jsonwebtoken')
import { connection } from '@/utils/database';
import { getSession } from 'next-auth/react';

export default async (req, res) => {
  // Verificar el token de next-auth
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'No estás autenticado' })
  }
  // Verificar el token de JWT
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'No se proporcionó un token' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'El token no es válido' })
      return
    }
  })

  //obtener todos los usuarios de la base de datos
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
    return
  })
  connection.end();
}