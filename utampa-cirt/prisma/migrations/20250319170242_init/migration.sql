-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `f_name` VARCHAR(50) NOT NULL,
    `l_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `user_role` ENUM('Reviewer', 'Author', 'Viewer') NOT NULL DEFAULT 'Author',

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pdf_path` VARCHAR(255) NOT NULL,
    `author_id` VARCHAR(191) NULL,
    `status` ENUM('Sent', 'Under_Review', 'Approved', 'Declined') NULL,
    `type` ENUM('Article', 'Journal', 'Poster', 'Paper') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Keyword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_id` INTEGER NULL,
    `keyword` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Keyword` ADD CONSTRAINT `Keyword_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `Article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
