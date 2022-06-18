/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      SESSION_SECRET: string;
      HASURA_URL: string;
      HASURA_ADMIN_SECRET: string;

      NODE_ENV: "development" | "production";
      PORT?: string;
    }
  }
}

// export {};
