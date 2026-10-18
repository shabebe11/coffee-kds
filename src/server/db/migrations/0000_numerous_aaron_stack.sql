CREATE TYPE "public"."statuses" AS ENUM('pending', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" "statuses" DEFAULT 'pending' NOT NULL,
	"completed_at" timestamp with time zone,
	"ordered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coffees" (
	"coffee_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"milk" text NOT NULL,
	"notes" text,
	"order_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "extras" (
	"extra_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"coffee_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coffee_type" (
	"name" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "coffees" ADD CONSTRAINT "coffees_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extras" ADD CONSTRAINT "extras_coffee_id_coffees_coffee_id_fk" FOREIGN KEY ("coffee_id") REFERENCES "public"."coffees"("coffee_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_ordered_at_idx" ON "orders" USING btree ("ordered_at");--> statement-breakpoint
CREATE INDEX "coffees_order_id_idx" ON "coffees" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "extras_coffee_id_idx" ON "extras" USING btree ("coffee_id");