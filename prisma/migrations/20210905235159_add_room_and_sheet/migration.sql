/*
  Warnings:

  - You are about to drop the column `numberOfPlayers` on the `GameRoom` table. All the data in the column will be lost.
  - Added the required column `name` to the `GameRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `characterInfo` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameRoom` DROP COLUMN `numberOfPlayers`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Sheet` ADD COLUMN `characterInfo` VARCHAR(191) NOT NULL;
