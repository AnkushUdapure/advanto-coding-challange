-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: ratings_app
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_rating` (`user_id`,`store_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (17,20,27,4,'2025-09-14 22:50:14','2025-09-14 22:50:14'),(18,20,25,4,'2025-09-14 22:50:20','2025-09-14 22:50:20'),(19,20,29,5,'2025-09-14 22:50:28','2025-09-14 22:50:28'),(21,20,26,3,'2025-09-14 22:50:45','2025-09-14 22:50:45'),(22,19,25,5,'2025-09-14 22:51:13','2025-09-14 22:51:13'),(23,19,26,3,'2025-09-14 22:51:18','2025-09-14 22:51:18'),(24,19,27,5,'2025-09-14 22:51:23','2025-09-14 22:51:23'),(25,19,29,5,'2025-09-14 22:51:29','2025-09-14 22:51:29'),(26,24,25,3,'2025-09-14 22:53:11','2025-09-14 22:53:11'),(27,24,26,5,'2025-09-14 22:53:16','2025-09-14 22:53:16'),(28,24,29,5,'2025-09-14 22:53:21','2025-09-14 22:53:21'),(29,24,27,2,'2025-09-14 22:53:28','2025-09-14 22:53:28');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(400) DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (25,'Maa Durga Collection','ankush@gmail.com','Amagon road, Fulchur, Gondia',8,'2025-09-14 22:37:37'),(26,'Kalyan Jwellers','dinesh@gmail.com','Shivajinagar, Pune',8,'2025-09-14 22:38:44'),(27,'Paswan Tyers','paswan@gmail.com','Karanja, Gondia',8,'2025-09-14 22:41:10'),(29,'Lata Tailors','lata@gmail.com','Fulchur, Gondia',8,'2025-09-14 22:45:43');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(400) DEFAULT NULL,
  `role` enum('ADMIN','USER','OWNER') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (8,'Admin Ankush Udapure','newadmin@gmail.com','$2b$10$vAcq56VoEO.50TE3tlPtgugRfWZt3XBNhJ81y5X3tJ0.44MqfI1Lu','Delhi','ADMIN','2025-09-14 12:19:05'),(16,'Subodh Sambhu Paswan','paswan@gmail.com','$2b$10$AnH02PP.Oej/USvl9tNEn.mrWgCX/ih2PlQpYjBlX1CrXLwSqRrpK','Sales Tax, Gondia','OWNER','2025-09-14 18:55:03'),(19,'Shreyash Viju Sonwane','shreyash@gmail.com','$2b$10$VPrhG2ERcDqBNVtsS6XTf.0au/HMWzoXkLZYmG.IM/VA8Gc3qhiKa','Gondia','USER','2025-09-14 22:32:40'),(20,'Bhushan Lilhare Raisoni','bhushan@gmail.com','$2b$10$fNADkW1m3h4dZ7HtfoiQq.DysuPXBsyiR/eGcW1Rt48zsSumK3lr2','Nagpur','USER','2025-09-14 22:33:45'),(21,'Dinesh Mitaram Udapure','dinesh@gmaiil.com','$2b$10$BIwz8OqzkLPH8Y8PJpbl9.hBizMYaEK.4Z12UAqZespO.m/sNpuJu','Pune','OWNER','2025-09-14 22:35:41'),(22,'Ankush Dinesh Udapure','ankush@gmail.com','$2b$10$f3A/JQwduhpep8Xo1.9udOQnvoCfXX.ZoqKGDXlAzoREobTRx8qbS','Fulchur, Gondia','OWNER','2025-09-14 22:36:27'),(23,'Ankit Lilhare Engineer','ankit@gmail.com','$2b$10$iFZhqgYYCWm6SZWn2P0l8OYK1ngQBZHRdFtita8cXhPlOGQQIQZMi','Raaipur','USER','2025-09-14 22:39:50'),(24,'Ashish Mohan Gajbe','ashish@gmaill.com','$2b$10$9whD33CJTegI3qPRLEc/g.sI..ld77egm9Kc4IQUVCdzgqzPvubpq','Bhilai','USER','2025-09-14 22:42:09'),(25,'Sahil Sahare Student','shail@gmail.com','$2b$10$EdGYZWQvvUjbmAeSLuIWFujdYUMXGWQ2mwYjERH0jWelsVa0D5e2O','Wardha','USER','2025-09-14 22:42:57'),(26,'Lata Dinesh Udapure','lata@gmail.com','$2b$10$ohOHm167uTogtUp8oG0ukub8HARE0UiEhFfMleBu7RWDu1apuwpmO','Gondia','OWNER','2025-09-14 22:45:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-15  4:26:48
