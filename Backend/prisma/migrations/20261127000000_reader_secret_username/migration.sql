-- Reader profiles: a secret (hashed) so a Matomo visitor id alone cannot take over a profile,
-- and the time of the last username change (one change per day).
ALTER TABLE "User"
  ADD COLUMN "readerSecretHash" TEXT,
  ADD COLUMN "usernameChangedAt" TIMESTAMP(3);
