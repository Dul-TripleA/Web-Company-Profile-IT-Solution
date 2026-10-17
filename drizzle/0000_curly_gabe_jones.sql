CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"service" text,
	"message" text NOT NULL,
	"handled" boolean DEFAULT false NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_unhandled_idx" ON "contact_messages" USING btree ("created_at" DESC NULLS LAST) WHERE "contact_messages"."handled" = false;--> statement-breakpoint
CREATE INDEX "contact_rate_limit_idx" ON "contact_messages" USING btree ("ip_hash","created_at" DESC NULLS LAST);