CREATE TABLE "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"urlId" integer,
	"userId" integer,
	"createdAt" timestamp DEFAULT now(),
	"browser" text DEFAULT 'unknown' NOT NULL,
	"ip" text DEFAULT 'unknown' NOT NULL,
	"referrer" text DEFAULT 'unknown' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_urlId_urls_id_fk" FOREIGN KEY ("urlId") REFERENCES "public"."urls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;