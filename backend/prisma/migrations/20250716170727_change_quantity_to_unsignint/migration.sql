/*
  Warnings:

  - You are about to alter the column `quantity` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `quantity` INTEGER UNSIGNED NOT NULL DEFAULT 0;
