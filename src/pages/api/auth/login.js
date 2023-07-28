import { connection } from "@/utils/database";
import bcrypt from "bcryptjs";


export default async function login(req, res) {
  const { email, password } = req.body;
  const [user] = await connection.query(
    `SELECT * FROM users WHERE email = ?`,
    email
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (passwordsMatch) {
    res.status(200).json({ email: user.email, role: user.rol_id });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
}