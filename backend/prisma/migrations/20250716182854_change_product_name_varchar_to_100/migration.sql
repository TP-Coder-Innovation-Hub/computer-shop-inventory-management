/*
  Warnings:

  - You are about to alter the column `product_name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `product_name` VARCHAR(100) NOT NULL;
