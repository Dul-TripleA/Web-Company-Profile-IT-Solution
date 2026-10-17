CREATE TABLE "admin_login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "admin_login_attempts_idx" ON "admin_login_attempts" USING btree ("ip_hash","created_at" DESC NULLS LAST);