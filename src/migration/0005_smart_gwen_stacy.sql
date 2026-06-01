ALTER TABLE "urls" RENAME COLUMN "urlId" TO "id";--> statement-breakpoint
ALTER TABLE "urls" RENAME COLUMN "longUrl" TO "originalUrl";--> statement-breakpoint
ALTER TABLE "urls" DROP CONSTRAINT "urls_longUrl_unique";--> statement-breakpoint
ALTER TABLE "urls" DROP CONSTRAINT "urls_shortUrl_unique";--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "shortCode" varchar;--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "clickCount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "urls" DROP COLUMN "shortUrl";--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_originalUrl_unique" UNIQUE("originalUrl");--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_shortCode_unique" UNIQUE("shortCode");