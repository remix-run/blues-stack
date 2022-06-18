CREATE TABLE "public"."notes" ("uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "title" text NOT NULL, "body" text NOT NULL, "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "user" uuid NOT NULL, PRIMARY KEY ("uuid") , FOREIGN KEY ("user") REFERENCES "public"."users"("uuid") ON UPDATE cascade ON DELETE cascade);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updatedAt"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updatedAt" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_notes_updatedAt"
BEFORE UPDATE ON "public"."notes"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_notes_updatedAt" ON "public"."notes" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
