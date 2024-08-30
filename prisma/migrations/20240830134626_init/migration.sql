/*
  Warnings:

  - The values [PEDING] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'DELIVERED', 'CANCELLED') NOT NULL;
