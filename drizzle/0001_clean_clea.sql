CREATE TYPE "public"."post_status" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"locale" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "categories_locale_check" CHECK ("categories"."locale" in ('id', 'en')),
	CONSTRAINT "categories_slug_check" CHECK ("categories"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"locale" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" text,
	"cover_alt" text,
	"status" "post_status" DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp with time zone,
	"author_name" text DEFAULT 'Do It' NOT NULL,
	"category_id" uuid,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_locale_check" CHECK ("posts"."locale" in ('id', 'en')),
	CONSTRAINT "posts_slug_check" CHECK ("posts"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and "posts"."slug" not in ('page', 'category')),
	CONSTRAINT "posts_published_has_date" CHECK ("posts"."status" = 'DRAFT' or "posts"."published_at" is not null)
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_locale_slug_idx" ON "categories" USING btree ("locale","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_locale_slug_idx" ON "posts" USING btree ("locale","slug");--> statement-breakpoint
CREATE INDEX "posts_published_idx" ON "posts" USING btree ("locale","published_at" DESC NULLS LAST,"id" DESC NULLS LAST) WHERE "posts"."status" = 'PUBLISHED';--> statement-breakpoint
CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id","published_at" DESC NULLS LAST);