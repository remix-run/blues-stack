CREATE TABLE "public"."users" ("uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "fname" text, "lname" text, "email" text NOT NULL, "passhash" text NOT NULL, "role" integer NOT NULL DEFAULT 0, "status" integer NOT NULL DEFAULT 0, "meta" jsonb NOT NULL, PRIMARY KEY ("uuid") , UNIQUE ("email"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
