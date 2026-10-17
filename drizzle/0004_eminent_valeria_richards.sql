CREATE TABLE "category_translations" (
	"category_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "category_translations_category_id_locale_pk" PRIMARY KEY("category_id","locale"),
	CONSTRAINT "category_translations_locale_check" CHECK ("category_translations"."locale" in ('id', 'en'))
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"service_slug" text NOT NULL,
	"tech_stack" text[] DEFAULT '{}'::text[] NOT NULL,
	"cover_image" text,
	"is_sample" boolean DEFAULT false NOT NULL,
	"status" "post_status" DEFAULT 'DRAFT' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_projects_slug_check" CHECK ("portfolio_projects"."slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
CREATE TABLE "portfolio_translations" (
	"project_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"client" text NOT NULL,
	"problem" text NOT NULL,
	"solution" text NOT NULL,
	"result" text NOT NULL,
	"cover_alt" text,
	CONSTRAINT "portfolio_translations_project_id_locale_pk" PRIMARY KEY("project_id","locale"),
	CONSTRAINT "portfolio_translations_locale_check" CHECK ("portfolio_translations"."locale" in ('id', 'en'))
);
--> statement-breakpoint
CREATE TABLE "post_translations" (
	"post_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_alt" text,
	"seo_title" text,
	"seo_description" text,
	CONSTRAINT "post_translations_post_id_locale_pk" PRIMARY KEY("post_id","locale"),
	CONSTRAINT "post_translations_locale_check" CHECK ("post_translations"."locale" in ('id', 'en'))
);
--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_locale_check";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_locale_check";--> statement-breakpoint
DROP INDEX "categories_locale_slug_idx";--> statement-breakpoint
DROP INDEX "posts_locale_slug_idx";--> statement-breakpoint
DROP INDEX "posts_published_idx";--> statement-breakpoint
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_translations" ADD CONSTRAINT "portfolio_translations_project_id_portfolio_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_translations" ADD CONSTRAINT "post_translations_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Data lama: tiap baris (satu bahasa) menjadi terjemahan dari dirinya sendiri.
INSERT INTO "category_translations" ("category_id", "locale", "name") SELECT "id", "locale", "name" FROM "categories";--> statement-breakpoint
INSERT INTO "post_translations" ("post_id", "locale", "title", "excerpt", "content", "cover_alt", "seo_title", "seo_description") SELECT "id", "locale", "title", "excerpt", "content", "cover_alt", "seo_title", "seo_description" FROM "posts";--> statement-breakpoint
-- Slug dulu unik per bahasa, kini unik global: slug kembar di bahasa lain diberi akhiran bahasa.
UPDATE "categories" c SET "slug" = c."slug" || '-' || c."locale" WHERE c."locale" <> 'id' AND EXISTS (SELECT 1 FROM "categories" o WHERE o."slug" = c."slug" AND o."id" <> c."id");--> statement-breakpoint
UPDATE "posts" p SET "slug" = p."slug" || '-' || p."locale" WHERE p."locale" <> 'id' AND EXISTS (SELECT 1 FROM "posts" o WHERE o."slug" = p."slug" AND o."id" <> p."id");--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_projects_slug_idx" ON "portfolio_projects" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_published_idx" ON "posts" USING btree ("published_at" DESC NULLS LAST,"id" DESC NULLS LAST) WHERE "posts"."status" = 'PUBLISHED';--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "locale";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "locale";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "excerpt";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "cover_alt";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "seo_title";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "seo_description";
