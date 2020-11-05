-- File: create_db
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.0
-- -----------------------

DROP DATABASE IF EXISTS `codewe`;
CREATE DATABASE `codewe`;
USE `codewe`;

SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `documents` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `document_id` VARCHAR(5) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT NOW(),
  `last_viewed_date` DATETIME NOT NULL DEFAULT NOW(),
  `content` LONGTEXT DEFAULT "",
  PRIMARY KEY (`id`, `document_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;