import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Protected() {

  const [users, setUsers] = useState([]);
  const { data: session, status } = useSession();


  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': 'Bearer ' + session?.accessToken
        }
      });
      const data = await response.json();
      setUsers(data);
    }
    getUsers();
  }, [])

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  return (
    <div>
      <h1>Protected page</h1>
      <button onClick={() => signOut()}>Sign out</button>
      {
        users && 
        users.map((user) => (
          <div key={user.id}>
            <p>{user.email}</p>
          </div>
        ))

      }
    </div>
  )  
}