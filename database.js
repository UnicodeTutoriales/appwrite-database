import { Client, Databases } from "appwrite";

export const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67aa5a8f00198965b54e');

export const databases = new Databases(client);