-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2024 at 06:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartstock_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'junar3x74', 'junarafable@gmail.co', '$2b$10$8JXzrOz2vtwku'),
(2, 'junar3x75', 'junarafable@gmail.co', '$2b$10$gf9g4UZjQgp3I'),
(3, 'junar', 'junarafable1@gmail.c', '$2b$10$Hq52dImJNNFYG'),
(4, 'junar3x70', 'junarafable2@gmail.c', '$2b$10$xzUeAHUK7YLfH'),
(5, 'junar3x79', 'junarafable3@gmail.c', '$2b$10$OHR6uVTVADvB5'),
(6, 'junar3x75', 'junarafable5@gmail.c', '$2b$10$yYdAXyDMjjTx4'),
(7, 'junar3x76', 'junarafable6@gmail.c', '$2b$10$Nj1/DAzKyySL8'),
(8, 'junar3x78', 'junarafable8@gmail.c', '$2b$10$gW9hsGVcqNULn'),
(9, 'junar3x7', 'junarafable14@gmail.', '$2b$10$0aa/G/74.GYvO'),
(10, 'lolo', 'lolo@gmail.com', '$2b$10$YklLB9BObZDoJ'),
(11, 'junar', 'junarafable0@gmail.c', '$2b$10$xoUj2cOyeGIBF');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
