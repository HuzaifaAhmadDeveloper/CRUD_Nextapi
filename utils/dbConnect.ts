// utils/dbConnect.ts
import { createClient } from '@vercel/postgres';

let client;
let isConnected = false;

// Create a new instance of the client
function getClient() {
    if (!client) {
        client = createClient();
    }
    return client;
}

// Connect to the database
export async function connectToDatabase() {
    const client = getClient();
    if (!isConnected) {
        try {
            await client.connect();
            console.log('Connected to Vercel PostgreSQL');
            isConnected = true;
        } catch (err) {
            console.error('Failed to connect to Vercel PostgreSQL', err);
            throw err;
        }
    }
    return client;
}

export const pool = getClient();