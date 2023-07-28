import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Protected() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data);
    }
    getUsers();
  }, [])
  
  return (
    <div>
      <h1>Protected page</h1>
      <button onClick={() => signOut()}>Sign out</button>
      {
        users && console.log(users)

      }
    </div>
  )  
}