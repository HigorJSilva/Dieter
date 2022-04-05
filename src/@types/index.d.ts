import dotenv from 'dotenv'

declare global {
  interface Request {
      user : {
          id: Types.ObjectId
      }
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE: string;
      DB_USER: string
      DB_PASSWORD: string;
      SECRET: string
    }
  }
}