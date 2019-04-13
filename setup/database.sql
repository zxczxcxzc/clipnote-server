-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: clip
-- ------------------------------------------------------
-- Server version	8.0.11


--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;

CREATE TABLE `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `author` varchar(45) NOT NULL,
  `locked` tinyint(4) NOT NULL DEFAULT '0',
  `spinoff` tinyint(4) NOT NULL DEFAULT '0',
  `hidden` tinyint(45) NOT NULL DEFAULT '0',
  `rating` int(11) NOT NULL DEFAULT '0',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `permissions` int(1) NOT NULL DEFAULT '1',
  `stars` int(11) DEFAULT '0',
  `joinDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastLogin` timestamp DEFAULT CURRENT_TIMESTAMP,
  `banExpires` timestamp NULL DEFAULT NULL,
  `hash` varchar(99) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Dump completed on 2019-04-04 21:17:32

