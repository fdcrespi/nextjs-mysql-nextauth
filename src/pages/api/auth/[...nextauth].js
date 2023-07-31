import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
       /*  username: { label: 'Username', type: 'email', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }, */
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const result = await fetch(`${process.env.URL_BASE}/api/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        })
        const user = await result.json()

        if (result.ok && user) {
          return user
        }
        throw new Error(user?.message ?? 'Something went wrong')
      },
    }),
  ],
  // estas son las rutas por defecto, se pueden cambiar (si no las pongo y creo los archivos, igual funciona)
  pages: {
    signIn: '/auth/signin',  // Displays signin buttons
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: null, // If set, new users will be directed here on first sign in
  },

  session: {
    strategy: 'jwt',
    jwt: true,
    jwt: {
      secret: process.env.JWT_SECRET,
    }
  },
  /* jwt: { 
    secret: process.env.JWT_SECRET,
    encryption: true,

    encryptionAlgorithm: 'RS256',
  }, */
  /* callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken
      }
      return token
    },
    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    },
  }, */
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  events: {
    async signIn(message) { /* on successful sign in */ },
    async signOut(message) { /* on signout */},
    async createUser(message) { /* user created */ },
    async linkAccount(message) { /* account linked to a user */ },
    async session(message) { /* session is active */ },
    async error(message) { /* error in authentication flow */ }
  },
  debug: true,
}

export default (req, res) => NextAuth(req, res, authOptions)