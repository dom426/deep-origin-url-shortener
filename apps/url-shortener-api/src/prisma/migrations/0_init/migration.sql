-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "last_logged_in" TIMESTAMPTZ(6),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shortened_url" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "alias" VARCHAR(255) NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "account_id" INTEGER,

    CONSTRAINT "shortened_url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortened_url_alias_unique" ON "shortened_url"("alias");

-- AddForeignKey
ALTER TABLE "shortened_url" ADD CONSTRAINT "shortened_url_account_id_foreign" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

