import dotenv from 'dotenv'

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE: string;
        DB_USER: string
        DB_PASSWORD: string;
      }
    }
  }