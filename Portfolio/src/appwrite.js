import { Client, Account, Databases, Storage } from 'appwrite'

const client = new Client()

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Environment configurations
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'portfolio'
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'portfolio-assets'

export const COLLECTIONS = {
  PROJECTS: import.meta.env.VITE_APPWRITE_COLLECTION_PROJECTS || 'projects',
  PARTNERS: import.meta.env.VITE_APPWRITE_COLLECTION_PARTNERS || 'partners',
  SOCIALS: import.meta.env.VITE_APPWRITE_COLLECTION_SOCIALS || 'socials',
  PROFILE: import.meta.env.VITE_APPWRITE_COLLECTION_PROFILE || 'profile',
}

// Helper: Get current user session
export const getCurrentUser = async () => {
  try {
    return await account.get()
  } catch (err) {
    return null
  }
}
