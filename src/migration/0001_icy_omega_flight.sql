CREATE TABLE "urls" (
	"urlId" serial PRIMARY KEY NOT NULL,
	"longUrl" varchar,
	"shortUrl" varchar,
	"userId" serial NOT NULL,
	CONSTRAINT "urls_longUrl_unique" UNIQUE("longUrl"),
	CONSTRAINT "urls_shortUrl_unique" UNIQUE("shortUrl")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;