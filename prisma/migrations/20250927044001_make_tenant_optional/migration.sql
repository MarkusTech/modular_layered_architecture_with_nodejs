-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_tenantId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `tenantId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
