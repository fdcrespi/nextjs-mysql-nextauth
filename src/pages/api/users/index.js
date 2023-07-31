const jwt = require('jsonwebtoken')
import { connection } from '@/utils/database';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]';

export default async (req, res) => {
  // Verifica sesión de usuario
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return
  }
   //obtener todos los usuarios de la base de datos
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
    return
  })
  connection.end();
}