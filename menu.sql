-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 12 2021 г., 14:46
-- Версия сервера: 5.7.31
-- Версия PHP: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `vtiger`
--

-- --------------------------------------------------------

--
-- Структура таблицы `menu`
--

DROP TABLE IF EXISTS `menu`;
CREATE TABLE IF NOT EXISTS `menu` (
  `itemid` int(11) NOT NULL AUTO_INCREMENT,
  `parentid` varchar(11) DEFAULT NULL,
  `itemtype` varchar(255) NOT NULL,
  `settings` text NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`itemid`)
) ENGINE=MyISAM AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `menu`
--

INSERT INTO `menu` (`itemid`, `parentid`, `itemtype`, `settings`, `position`) VALUES
(84, '77', 'Sub Menu 3', 'SalesOrder', 3),
(78, 'null', 'Main Menu 2', 'Assets', 2),
(82, '77', 'Sub Menu 1', 'ServiceContracts', 1),
(77, 'null', 'Main Menu 1', 'Accounts', 1),
(83, '77', 'Sub Menu 2', 'Services', 2),
(85, '78', 'Sub Menu 4', 'Services', 1),
(86, '85', 'Sub Sub Menu 1', 'SalesOrder', 1),
(87, '85', 'Sub Sub Menu 2', 'ModComments', 2);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
