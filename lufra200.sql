-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-03-2026 a las 22:39:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lufra200`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaciones`
--

CREATE TABLE `asignaciones` (
  `Id_Asignacion` int(11) NOT NULL,
  `Id_Concepto` int(11) NOT NULL,
  `Monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignaciones`
--

INSERT INTO `asignaciones` (`Id_Asignacion`, `Id_Concepto`, `Monto`) VALUES
(11, 17, 130.00),
(12, 19, 130.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bonificaciones`
--

CREATE TABLE `bonificaciones` (
  `Id_Bonificacion` int(11) NOT NULL,
  `Id_Concepto` int(11) DEFAULT NULL,
  `Descripción` varchar(255) DEFAULT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `Observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-cf6c6c271239be4d189de89e530f92d1', 'i:1;', 1773982856),
('laravel-cache-cf6c6c271239be4d189de89e530f92d1:timer', 'i:1773982856;', 1773982856),
('laravel-cache-d00e9a6c1e6a77ac30e32fcedc3f5bea', 'i:1;', 1774032649),
('laravel-cache-d00e9a6c1e6a77ac30e32fcedc3f5bea:timer', 'i:1774032649;', 1774032649),
('laravel-cache-f423b3141cd0e6d7c1e9e869128cf98b', 'i:1;', 1774032773),
('laravel-cache-f423b3141cd0e6d7c1e9e869128cf98b:timer', 'i:1774032773;', 1774032773);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `Id_Cargo` int(11) NOT NULL,
  `Nombre_profesión` varchar(100) NOT NULL,
  `Area` varchar(100) DEFAULT NULL,
  `Estado` varchar(255) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`Id_Cargo`, `Nombre_profesión`, `Area`, `Estado`) VALUES
(1, 'Socio', 'Gerencia', 'Activo'),
(7, 'Gerente', 'TIC', 'Activo'),
(8, 'Almacenista', 'Almacen', 'Activo'),
(9, 'Informatico', 'Tecnologica', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concepto`
--

CREATE TABLE `concepto` (
  `Id_Concepto` int(11) NOT NULL,
  `Codigo` varchar(20) DEFAULT NULL,
  `Nombre_Concepto` varchar(100) NOT NULL,
  `Tipo` varchar(50) DEFAULT NULL,
  `Monto` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Descripción` text DEFAULT NULL,
  `Estado` varchar(255) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `concepto`
--

INSERT INTO `concepto` (`Id_Concepto`, `Codigo`, `Nombre_Concepto`, `Tipo`, `Monto`, `Descripción`, `Estado`) VALUES
(17, 'A001', 'Dias Laborables Trabajados', 'Asignación', 0.00, NULL, 'Activo'),
(18, 'D001', 'Dias No Laborados', 'Deducción', 0.00, NULL, 'Activo'),
(19, 'A002', 'Dias De Descanso', 'Asignación', 0.00, NULL, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contacto_emergencia`
--

CREATE TABLE `contacto_emergencia` (
  `Id_Contacto_Emergencia` int(11) NOT NULL,
  `Nombre_Contacto` varchar(150) NOT NULL,
  `Parentesco` varchar(50) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contrato_trabajadores`
--

CREATE TABLE `contrato_trabajadores` (
  `Id_registro` int(11) NOT NULL,
  `Id_Trabajador` int(11) NOT NULL,
  `Id_Tipo_Nomina` int(11) NOT NULL,
  `Fecha_registro` datetime DEFAULT current_timestamp(),
  `Observaciones` text DEFAULT NULL,
  `Estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contrato_trabajadores`
--

INSERT INTO `contrato_trabajadores` (`Id_registro`, `Id_Trabajador`, `Id_Tipo_Nomina`, `Fecha_registro`, `Observaciones`, `Estado`) VALUES
(1, 1, 1, '2026-01-11 19:32:42', '\"Hello World\"', 'Activo'),
(2, 9, 2, '2026-01-11 19:57:10', NULL, 'Activo'),
(4, 11, 2, '2026-01-24 18:57:08', NULL, 'Activo'),
(5, 12, 2, '2026-01-24 20:13:33', NULL, 'Activo'),
(6, 13, 1, '2026-03-20 00:00:00', '', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deducciones`
--

CREATE TABLE `deducciones` (
  `Id_Deduccion` int(11) NOT NULL,
  `Id_Concepto` int(11) NOT NULL,
  `Monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `deducciones`
--

INSERT INTO `deducciones` (`Id_Deduccion`, `Id_Concepto`, `Monto`) VALUES
(4, 18, 130.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_recibo_asignacion`
--

CREATE TABLE `detalle_recibo_asignacion` (
  `Id_Recibo_Pago` int(11) NOT NULL,
  `Id_Asignacion` int(11) NOT NULL,
  `Monto_Aplicado` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_recibo_bonificacion`
--

CREATE TABLE `detalle_recibo_bonificacion` (
  `Id_Recibo_Pago` int(11) NOT NULL,
  `Id_Bonificacion` int(11) NOT NULL,
  `Cantidad` decimal(10,2) DEFAULT 1.00,
  `Monto_Aplicado` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_recibo_deduccion`
--

CREATE TABLE `detalle_recibo_deduccion` (
  `Id_Recibo_Pago` int(11) NOT NULL,
  `Id_Deduccion` int(11) NOT NULL,
  `Monto_Aplicado` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_14_170933_add_two_factor_columns_to_users_table', 1),
(5, '2026_03_11_rol_column_users', 2),
(6, '2024_03_12_000000_add_id_trabajador_to_users_table', 3),
(7, '2026_03_20_030634_add_status_to_admin_tables', 4),
(8, '2026_03_20_044111_add_tipo_monto_to_concepto_table', 5),
(9, '2026_03_20_050739_add_username_and_estado_to_users_table', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nivel_educativo`
--

CREATE TABLE `nivel_educativo` (
  `Id_Nivel_Educativo` int(11) NOT NULL,
  `Nombre_Nivel` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `nivel_educativo`
--

INSERT INTO `nivel_educativo` (`Id_Nivel_Educativo`, `Nombre_Nivel`) VALUES
(1, 'Primaria'),
(2, 'Secundaria'),
(3, 'Superior'),
(4, 'Nulo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades`
--

CREATE TABLE `novedades` (
  `id` int(11) NOT NULL,
  `emp` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `monto` decimal(12,2) DEFAULT 0.00,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payslips`
--

CREATE TABLE `payslips` (
  `Id_Payslip` int(11) NOT NULL,
  `Fecha_Pago` date NOT NULL,
  `Salario_Base` decimal(10,2) DEFAULT NULL,
  `Neto` decimal(10,2) DEFAULT NULL,
  `Id_Trabajador` int(11) DEFAULT NULL,
  `Data` longtext DEFAULT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `payslips`
--

INSERT INTO `payslips` (`Id_Payslip`, `Fecha_Pago`, `Salario_Base`, `Neto`, `Id_Trabajador`, `Data`, `Created_At`, `Updated_At`) VALUES
(1, '2026-01-14', 15000.00, 15000.00, 1, '{\"periodo\":\"1Enero\",\"fechaPago\":\"2026-01-14\",\"fechaInicio\":\"2026-01-01\",\"fechaFin\":\"2026-01-15\",\"salarioBase\":15000,\"salarioMensual\":130,\"asignaciones\":0,\"bonificaciones\":0,\"deducciones\":0,\"neto\":15000,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":1,\"trabajador\":\"Kelvis Arturo Gomez Macero\",\"cedula\":\"31710465\",\"numeroRecibo\":null,\"conceptos\":[]}', '2026-01-14 18:54:53', NULL),
(2, '2026-01-17', 15000.00, 15000.00, 1, '{\"periodo\":\"2 Enero\",\"fechaPago\":\"2026-01-17\",\"fechaInicio\":\"2026-01-15\",\"fechaFin\":\"2026-01-31\",\"salarioBase\":15000,\"salarioMensual\":130,\"asignaciones\":0,\"bonificaciones\":0,\"deducciones\":0,\"neto\":15000,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":1,\"trabajador\":\"Kelvis Arturo Gomez Macero\",\"cedula\":\"31710465\",\"numeroRecibo\":null,\"conceptos\":[]}', '2026-01-17 19:23:09', NULL),
(3, '2026-01-20', 1000.00, 475.00, 1, '{\"periodo\":\"3 Enero\",\"fechaPago\":\"2026-01-20\",\"fechaInicio\":\"2026-01-20\",\"fechaFin\":\"2026-01-20\",\"salarioBase\":1000,\"asignaciones\":725,\"bonificaciones\":0,\"deducciones\":1250,\"neto\":475,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":1,\"trabajador\":\"Kelvis Arturo Gomez Macero\",\"cedula\":\"31710465\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":15,\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"725.00\",\"Observaciones_Bonificacion\":null},{\"Id_Concepto\":13,\"Nombre_Concepto\":\"Seguro Social Obligatorio\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"1250.00\",\"Observaciones_Bonificacion\":null}]}', '2026-01-20 20:06:30', NULL),
(4, '2026-01-25', 5000.00, 5503.00, 1, '{\"periodo\":\"Enero 2026\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-01-11\",\"fechaFin\":\"2026-01-22\",\"salarioBase\":5000,\"asignaciones\":725,\"bonificaciones\":0,\"deducciones\":222,\"neto\":5503,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":1,\"trabajador\":\"Kelvis Arturo Gomez Macero\",\"cedula\":\"31710465\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":15,\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"725.00\",\"Observaciones_Bonificacion\":null},{\"Id_Concepto\":16,\"Nombre_Concepto\":\"Seguro Social Obligatorio\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"222.00\",\"Observaciones_Bonificacion\":null}]}', '2026-01-25 23:52:02', NULL),
(5, '2026-01-25', 3000.00, 3503.00, 12, '{\"periodo\":\"2 Enero 2026\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-01-28\",\"fechaFin\":\"2026-01-30\",\"salarioBase\":3000,\"asignaciones\":725,\"bonificaciones\":0,\"deducciones\":222,\"neto\":3503,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":12,\"trabajador\":\"Yorkaris Rojas\",\"cedula\":\"V-31623405\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":15,\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"725.00\",\"Observaciones_Bonificacion\":null},{\"Id_Concepto\":16,\"Nombre_Concepto\":\"Seguro Social Obligatorio\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"222.00\",\"Observaciones_Bonificacion\":null}]}', '2026-01-26 00:25:21', NULL),
(6, '2026-01-25', 1000.00, 1000.00, 12, '{\"periodo\":\"1 Febrero\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-02-01\",\"fechaFin\":\"2026-02-15\",\"salarioBase\":1000,\"asignaciones\":0,\"bonificaciones\":0,\"deducciones\":0,\"neto\":1000,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":12,\"trabajador\":\"Yorkaris Rojas\",\"cedula\":\"V-31623405\",\"numeroRecibo\":null,\"conceptos\":[]}', '2026-01-26 00:34:52', NULL),
(7, '2026-01-25', 1000.00, 1503.00, 1, '{\"periodo\":\"4 Enero\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-01-25\",\"fechaFin\":\"2026-01-25\",\"salarioBase\":1000,\"asignaciones\":725,\"bonificaciones\":0,\"deducciones\":222,\"neto\":1503,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":1,\"trabajador\":\"Kelvis Arturo Gomez Macero\",\"cedula\":\"31710465\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":15,\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"725.00\",\"Observaciones_Bonificacion\":null},{\"Id_Concepto\":16,\"Nombre_Concepto\":\"Seguro Social Obligatorio\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"222.00\",\"Observaciones_Bonificacion\":null}]}', '2026-01-26 00:43:30', NULL),
(8, '2026-01-25', 1000.00, 1130.00, 12, '{\"periodo\":\"3\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-02-01\",\"fechaFin\":\"2026-02-15\",\"salarioBase\":1000,\"asignaciones\":260,\"bonificaciones\":0,\"deducciones\":130,\"neto\":1130,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":12,\"trabajador\":\"Yorkaris Rojas\",\"cedula\":\"V-31623405\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":17,\"Codigo\":\"A001\",\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"15\"},{\"Id_Concepto\":18,\"Codigo\":\"D001\",\"Nombre_Concepto\":\"Dias No Laborados\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"4\"},{\"Id_Concepto\":19,\"Codigo\":\"A002\",\"Nombre_Concepto\":\"Dias De Descanso\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"2\"}]}', '2026-01-26 02:04:39', NULL),
(9, '2026-01-25', 2000.00, 2130.00, 1, '{\"periodo\":\"11\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-06-01\",\"fechaFin\":\"2026-06-15\",\"salarioBase\":2000,\"asignaciones\":260,\"bonificaciones\":0,\"deducciones\":130,\"neto\":2130,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":1,\"trabajador\":\"Kelvis Arturo Gomez Macero\",\"cedula\":\"31710465\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":17,\"Codigo\":\"A001\",\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"11\"},{\"Id_Concepto\":18,\"Codigo\":\"D001\",\"Nombre_Concepto\":\"Dias No Laborados\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"4\"},{\"Id_Concepto\":19,\"Codigo\":\"A002\",\"Nombre_Concepto\":\"Dias De Descanso\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"2\"}]}', '2026-01-26 02:15:47', NULL),
(10, '2026-01-25', 1000.00, 1130.00, 1, '{\"periodo\":\"3\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-02-01\",\"fechaFin\":\"2026-02-15\",\"salarioBase\":1000,\"asignaciones\":260,\"bonificaciones\":0,\"deducciones\":130,\"neto\":1130,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":1,\"trabajador\":\"Kelvis Arturo Gomez Macero\",\"cedula\":\"31710465\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":17,\"Codigo\":\"A001\",\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"11\"},{\"Id_Concepto\":18,\"Codigo\":\"D001\",\"Nombre_Concepto\":\"Dias No Laborados\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"4\"},{\"Id_Concepto\":19,\"Codigo\":\"A002\",\"Nombre_Concepto\":\"Dias De Descanso\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"2\"}]}', '2026-01-26 03:00:12', NULL),
(11, '2026-01-25', 2500.00, 2630.00, 12, '{\"periodo\":\"4\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-02-16\",\"fechaFin\":\"2026-02-28\",\"salarioBase\":2500,\"asignaciones\":260,\"bonificaciones\":0,\"deducciones\":130,\"neto\":2630,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":12,\"trabajador\":\"Yorkaris Rojas\",\"cedula\":\"V-31623405\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":17,\"Codigo\":\"A001\",\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"11\"},{\"Id_Concepto\":18,\"Codigo\":\"D001\",\"Nombre_Concepto\":\"Dias No Laborados\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"4\"},{\"Id_Concepto\":19,\"Codigo\":\"A002\",\"Nombre_Concepto\":\"Dias De Descanso\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"2\"}]}', '2026-01-26 03:04:31', NULL),
(12, '2026-01-25', 3000.00, 3130.00, 12, '{\"periodo\":\"4\",\"fechaPago\":\"2026-01-25\",\"fechaInicio\":\"2026-02-16\",\"fechaFin\":\"2026-02-28\",\"salarioBase\":3000,\"asignaciones\":260,\"bonificaciones\":0,\"deducciones\":130,\"neto\":3130,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":12,\"trabajador\":\"Yorkaris Rojas\",\"cedula\":\"V-31623405\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":17,\"Codigo\":\"A001\",\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"15\"},{\"Id_Concepto\":18,\"Codigo\":\"D001\",\"Nombre_Concepto\":\"Dias No Laborados\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"4\"},{\"Id_Concepto\":19,\"Codigo\":\"A002\",\"Nombre_Concepto\":\"Dias De Descanso\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"2\"}]}', '2026-01-26 03:33:42', NULL),
(13, '2026-01-26', 3000.00, 3130.00, 11, '{\"periodo\":\"7\",\"fechaPago\":\"2026-01-26\",\"fechaInicio\":\"2026-04-01\",\"fechaFin\":\"2026-04-15\",\"salarioBase\":3000,\"asignaciones\":260,\"bonificaciones\":0,\"deducciones\":130,\"neto\":3130,\"tipoNomina\":\"Quincenal\",\"trabajadorId\":11,\"trabajador\":\"Adrian Gonzalez\",\"cedula\":\"V-31215637\",\"numeroRecibo\":null,\"conceptos\":[{\"Id_Concepto\":18,\"Codigo\":\"D001\",\"Nombre_Concepto\":\"Dias No Laborados\",\"Descripcion\":null,\"Tipo\":\"Deducción\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"4\"},{\"Id_Concepto\":19,\"Codigo\":\"A002\",\"Nombre_Concepto\":\"Dias De Descanso\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"2\"},{\"Id_Concepto\":17,\"Codigo\":\"A001\",\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Descripcion\":null,\"Tipo\":\"Asignación\",\"Monto\":\"130.00\",\"Observaciones_Bonificacion\":null,\"aux\":\"9\"}]}', '2026-01-26 23:31:34', NULL),
(14, '2026-03-20', 5000.00, 5000.00, 1, '{\"trabajadorId\":\"1\",\"fechaPago\":\"2026-03-20\",\"periodo\":\"2da Quincena Marzo\",\"salarioBase\":5000,\"neto\":5000,\"conceptos\":[]}', '2026-03-20 04:27:42', NULL),
(15, '2026-03-20', 1000.00, 983.25, 1, '{\"trabajadorId\":\"1\",\"trabajador\":\"Kelvis Arturo Gomez Macero\",\"cedula\":\"V-31710465\",\"fechaPago\":\"2026-03-20\",\"periodo\":\"2da Quincena Marzo\",\"fechaInicio\":\"2026-03-16\",\"fechaFin\":\"2026-03-31\",\"salarioBase\":1000,\"neto\":983.25,\"conceptos\":[{\"Codigo\":\"IVSS\",\"Tipo\":\"Deducci\\u00f3n\",\"Nombre_Concepto\":\"Seguro Social Obligatorio (4%)\",\"Monto\":6,\"aux\":\"3 Lunes\"},{\"Codigo\":\"SPF\",\"Tipo\":\"Deducci\\u00f3n\",\"Nombre_Concepto\":\"R\\u00e9gimen Prest. de Empleo (0.5%)\",\"Monto\":0.75,\"aux\":\"3 Lunes\"},{\"Codigo\":\"FAOV\",\"Tipo\":\"Deducci\\u00f3n\",\"Nombre_Concepto\":\"Ahorro Habitacional (1%)\",\"Monto\":10,\"aux\":\"1%\"},{\"Id_Concepto\":18,\"Codigo\":\"D001\",\"Nombre_Concepto\":\"Dias No Laborados\",\"Tipo\":\"Deducci\\u00f3n\",\"Monto\":\"0.00\",\"Descripci\\u00f3n\":null,\"Estado\":\"Activo\",\"aux\":\"4 Unid.\"},{\"Id_Concepto\":17,\"Codigo\":\"A001\",\"Nombre_Concepto\":\"Dias Laborables Trabajados\",\"Tipo\":\"Asignaci\\u00f3n\",\"Monto\":\"0.00\",\"Descripci\\u00f3n\":null,\"Estado\":\"Activo\",\"aux\":\"11 Unid.\"}]}', '2026-03-20 04:52:15', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibo_pago`
--

CREATE TABLE `recibo_pago` (
  `Id_Recibo_Pago` int(11) NOT NULL,
  `Id_Tipo_Nomina` int(11) NOT NULL,
  `Id_Trabajador` int(11) NOT NULL,
  `Fecha_Pago` date NOT NULL,
  `Salario_Base` decimal(10,2) NOT NULL,
  `Neto` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `Id_rol` int(11) NOT NULL,
  `Nombre_rol` varchar(50) NOT NULL,
  `Estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`Id_rol`, `Nombre_rol`, `Estado`) VALUES
(1, 'Administrativo', 1),
(2, 'Trabajador', 1),
(3, 'SuperUsuario', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('fMKE9kzIsS9YW2R9ANONQBxhzhvOeLQF4jDTqVMg', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoibDQxZ3V5eDBvRDVxbHpWZTlPMTRwWDJQSmlZdURTWW53TXA0dTNpdyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbmlzdHJhdGl2byI7czo1OiJyb3V0ZSI7czoyNDoiYWRtaW5pc3RyYXRpdm8uZGFzaGJvYXJkIjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mzt9', 1774032770),
('iiPYAbAvRYIpunWsjx48JZBGy6LGzwrYIi3Uyvao', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT1B2bnVnTzNXdW5GdndIclRDT21hcnlHMEJxNmIyajJjUGhocTM4cyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fX0=', 1773987444);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `settings`
--

CREATE TABLE `settings` (
  `skey` varchar(200) NOT NULL,
  `svalue` longtext DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `settings`
--

INSERT INTO `settings` (`skey`, `svalue`, `updated_at`) VALUES
('payroll_report_config', '{\"companyName\":\"Lufra 2020\",\"rif\":\"J-50032437-5\",\"address\":\"Acarigua, Portuguesa\",\"phone\":\"+58 424-5114575\",\"footer\":\"Este documento es generado automáticamente por el Sistema de Nóminas Lufra 2020\",\"primaryColor\":\"#00cc18\",\"logo\":\"data:image\\/jpeg;base64,\\/9j\\/4AAQSkZJRgABAQAAAQABAAD\\/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj\\/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj\\/wgARCAJYBBoDASIAAhEBAxEB\\/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAQMEAgf\\/xAAZAQEAAwEBAAAAAAAAAAAAAAAAAQIDBAX\\/2gAMAwEAAhADEAAAArUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIGnXzT0+ebHPbszy9PbTI1MZ05tueLZzW6Xn12VCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGUOTz68+DsGbz0ac91exh6ebk2avMuHDfO3TydES+YmW9rIJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADVR6czgv2NO3upnGdRp8nh7BQBlhcFZCIcHfp1JPi7fdxGDIkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAENWjPnx9Q5bPXlePXkAoCRjxLY1ZlsYzUEAPW7ndMbtWFJ6NvF091Ng76AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEMtHFFZRCzB6FrAAHFmsY45Su4Wmc1fo472BzdPJYYqz5jYXrrNx+iV7qQ\\/myZ1rXM2L2it9Fh8xaOko+P5rWNEyvn3yMpAZwOr3CyfuZbxvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRvjqxHcWhy8\\/ryVqnYLbe1xa9nV0BMtO6CpWK8YcnNs6+BMzfRXJLXTr6+ziw6cV7XvtHJObYfoxko\\/nY5BSAQ36EzNSlR2aXnYqW7dduTbFSHlbbRyyxnxZWLVFWL3sQuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcXbx1rVRx8wAFglqdPdG0m59Gl91V383PjgZ0AC97fETPH09EJJbIDPJh5wy9Y1bddNeJ2R10qPq6ZlSvVt4KxBt+jDHMzC5hcof3Kb9HLnn6PH2DKfPdx+vQp1uX1tHQOyoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAh6135reMMrpmBm99fYtZwd1czpGjl5wAMsDLAM4ADRumc+\\/G+9rb598vTvWdPrmwydHTs0v2y8JPWn0LWAGg2ws2iKWnoHl582iq9lpsWjt5c+rA8rQIAdOzl6vayDpgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ1a5gmOXDOM4rXPVyJmw+q5m9u\\/gKVwIgAAAAADzxd\\/J0bdfrX6xys3dTN+um5zaojZ4wxzS0Tm03TMdI9fSEz5pc3gmvQYrlk46Uqo5OeydkBY+nq5B4e4VDEs9UJr9GliHo0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAV2xclK1R688nMAAAAMmHZJXtBe7Rv0vVPdqTaq4s8Mciv+ZWJXvRPxee21t+mU5IiPd2KxyY7NMRoxsxWvgznSdmIGd6t8i96\\/1cvUSx5PXj0iKdr36OPm2W+l3Dp31Y9efF6QzccBsnfYzg52U9dNQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCQlzqfPjoGOQADPuetaNmuvPRtjJewxM55NFcO6NhZ8itPTbyu2OWwaaxKRZ1cGuBLH6j+k6dnHgkMRngmOWL0xFqn\\/m99OzGUzX+rl6iW5unmN7GqIq+pji5fFwp9x6unx5zjxOgKIqw8XZ7WXobwEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhiq2KqY5eRhiA6Vm0v46cuncJkxzmyKj6wdscCwV+wEdeKRfDdTuuqGyxV2wmiBkeQtFYssyVTVd+Aheew+yI0WDyRO2V0myTipEg+rt8HZy9XIdEVI1fLPQeefHNxrVk36tI8PYIM4Wb9vH59PPvHbUJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOfohq16N1UzhlbeatjfowzoEQ2eLDa3V05dfQEy8+YAkqlHaQABYK\\/YCOvtFvhCabNHEPrj7AUqcxks3PA8psiLbVDyADLEiR+fI3zVe6z6Lp0QUR1R2jfy87T66NNJ3p2auPoDz7gAeIGT0+pSwjuoEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBP1zLOMzhzYAADJ3Wbj7eroGNL55Y2nEnC4AAACwV+wGbbUrcQ1NsVZJmz1izlc5+jURHt4LfWZzWV11+Tmbhpl4+TIV0bTi99\\/svkZ2eoih78YrGy18\\/djfGDx9RpPfPX9\\/o0nNkHrmN05X7Z119jQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArVlrOWceObAAB28U\\/e0tk6ulAT9blT8AAAAAsFfsBm3VG3FWrNmrJM2CvzhVJSByW\\/TPVU28\\/j2SXX62G\\/rheUtCncpe4yN2mznreCxTVD7z311zZC1d8JMc89Gern57eYnt1c86p\\/Tv9jNjKWMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArNmjKVrjdp58ApUDNrrFu319jfZW7JWynAAAAAWCv2A9W2pW0q1Zs1ZJqbhJspWcZPpNEvdEPHJ1854xZ6wAAWWSjZIj9vjrI3xs8GqVjJU45qGmSVEIffjHnX6+ji6uivsdUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeIOf561qLOOPmA67VV7T07hrordkrZTgAAAALBX7AerbUraVas2ask1Nwk2UrOMn0miXSnGnk77cUrX9N9HyzH0yDKe36CyycbInF28koQXn1g1S0VLHFMw\\/KXdCzByc0rxYTwZjpskhvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP6K1lnzDmwA7rRVLV0b5G2itWWtFPAAAAeus4rAnCFt9OliPrO4Sk3X+8rYOrZzTJZuKJrx9R56xKG\\/byTxDUv6bEkNJRskckvD9pE494MyMTLnFVrTXzmkbwPfRBTpjHoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU\\/TIR\\/FyhEAbrdTLdvtvG+qtWWtFPbpEiFp2lV75riN\\/ZWeQufHB9B7jZvtIGz1fkLVr07iLkNsSRe7XYiLnOPBB7e+4FAumiAI3ZO8pGeZIbu+KGfXgPPoaZThHuHlRhkcn0Oj3M6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ8Db6hzYBlmAsdcltL2AdXQjZIVvn6q8bufxyDyDbq6iZ0y9OJCV7a8Zi7BXiWneyUKtI7+8pfVW\\/JZuKG2l185qBPSHFLGii3qiAADOOw85+k5PmvL9T+cHEADP0T519FJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACq2qJyzr45sAHZx7Jm3+46R6+ljOLTX+P3kq3jZrCU5Dmz06j6JQL1QT6PRLp8+LFWd2ksknSMFqmPnvQWOUqPklq2wfQoTxEHRaIiCLnQ+3lPCR7SBWIV3pmRZM1oWWh740AHecH0XhmjYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB49oik4tMblnEvXnnyZxlHTY6n06XtmNXrp3qUDf46s0tcPOE8vV69mPXnFkDG2fxdGRtk1lf6Zb3Cc0cI4YSx8kodMerxCpjUR03F4V98nQNF4p8kXlRMzN6UbYXbFL8l2VrYmS+e3GKlAJURV1h7CS6P3HUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjIhoKx1zl5wzoB2Wam92uloxr29G3Nr7NfDfme9fn6ZRGNMphDytbezRS29Dtc5hxaKzKIfrl3+4JtWd4eAjdjV3RHO0pjdjUPPv12205Nc1oWjfeoznPUD7TYPXN09k5HRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFdi7TV+XnwM6AAdFgq+b3uma\\/M9G27i7dHLer6ZOMz5tlgiprDfzo6\\/OO1Y87dXfwSvJJ8uG8dLxtiRW9fbxbZbNvqTz0gJjfvzvXtXfwdGG\\/Z7687w3vxnXOy+Xrg7a3jMh28cb1cvYWDq5enXryOyoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCncVrSnbxcfOCAAHryJKSrliz3j4zu4WffMwUljts21uZiYnV0c\\/TzzvLnRjtpsUBO0tDcPVy9HPtleOYx2jt0ZNxaL4Ovk3w2Y6+yswsjHbbVsnBuiebp5e7XM7ZV11cmmVm7q\\/M06+kelASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1VW38+dKi9c2OW9hM5GWYHqxVyew2gVjJrmLIK3N9Kl+WHmOpFb9WD1avP709WWtdxZcbZVyf2a6Xhpyuz9ogMWRNa9ZPGvPSI57J71pA81tzvFSsm31z3qnm2et86tZsbstdw9IEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOTX3kedW9E1qOtdV5sMDPMDLGIn0wM4wHryNvjySyIaczW2\\/L2zudb1Xiu0bFa69aMMvenNo118SzOtglhkYZGGQEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOOrWesc2GBlmANNresdk5vtWfdliKV4RjiABi5VG49XR6GlwOeAs6EbJAEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHB3oioaLnC8+MM9ecs\\/O7mtHTvIezTR49kVPlsVe5efApUD1caXcuro2jS4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGmEsKtahbc5mQmQPFUt0ZStZ8yfZFa97tnVe9YtHtMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf\\/\\/aAAwDAQACAAMAAAAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDFnARNIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQa38CXfOiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRNXd\\/wD7vP8AggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKz637\\/wB\\/y73\\/APjqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhQQAAAiWtf9uxr5Kc\\/\\/wC8kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZ520MBe\\/8vhOOz7+whVre+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP330M\\/nzy5IlOIatDlh5O30oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAc+0BPzz0w3Tz6wA7h0AAByP2L3\\/+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANZRwuDz33z330S2lE+kABiDH\\/d\\/\\/uYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABL\\/wA8999xVuSUn0XGOz7lAAEf0B85MqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4888nDDAMAIkAcgAQnQAAAdPAUtVCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC288nxAIM88wowUcIkwAEAEp74X\\/AP3QgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFa+7PP8QDLPGMIOCGBEOPGPHGM6k1\\/\\/AP4IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABez3zysQSzARAihwRxBDgDCzDvLotTH20AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3320JBjBjBiijzwjBjAQTCxALOHuJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdH33UADARARCgDxSDyDDTQzhRDAKs8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH31gADjBjBigDhSjxijDyRQCgwShIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPzw4BTARAxCQjBjzzwTDACzCjDygAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADbz3gBTTxxhhThjwxjBQxByiSAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADT3ywADhzzjBiTyAiDyAzjTDjzTAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz3gpDTjCyRijwyhRDjzjxjwzBiwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABN\\/6kNtruNGBLRhDHrd1sll3aATwwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBf32sG\\/LHEF7\\/qx7n68yw9x4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABH3zz6AvayQjKsibMBs829+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABH733zFN91f4jJ\\/+46vsL5scIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDfTYBExyitdJVfrwkWQNkoIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFLKxGfG77yKANgQEkLLLIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv3gSkoEEEkAACIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7TsIOuwsMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEsACaFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD\\/2gAMAwEAAgADAAAAEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPqwnfP3ffPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOpm8+uY09vPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPNpN8IgQ8wA2kdvPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOsglu0wShRyw4sOvPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOv0\\/PONCDyAxyOTSDwwwQ9PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPKIHqP\\/ACKW5LIjXX72xcA58Drzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyn7zxX1r32gnPoeWVxEpcVOBbzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyXbzxLf3w+7f3Gh3W1jzzxe11UEEH\\/wA88888888888888888888888888888888888pc1cbD988988+R5I1lJV8I8Z\\/6gJAF888888888888888888888888888888888888c99988y+M02fGq\\/6z0+V808pcBgBma888888888888888888888888888888888888sT899aCv8ABANJCLKFBNN\\/GOGh6gk1PvPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPsFfYdvPIMMIILCMPCNICELAxq6AUNvvPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPKPGrPcsnNCIJDMKMIGMBIHEJKS58qwQ+PvPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP7\\/PfynPADOLMGIFDAGANAGCHXNRLyEV\\/PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPfPPO9uFDJDJEDDCFPCDENIPKKokjdTLPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPvPPFPLDOLOLAPOAGMDJCGMENJLPuM\\/PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPDNvGPOBDJDJAGLCALOOLANPPHPOA51PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPN3fRvPDOLNIANCIAJPBMOEOACLBEDFPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPF\\/fGvPAHKHMPBPEHLBGPHEPCPGDDPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPfPbdOMCKJDHJHEEFMDKNOLCGOPAPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPL9fKePALBADOCHKFMMLKAAJIBDIBPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPL0\\/qEdUZy+gnvrdmMtWzX8y0IMLFNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPHfPOCbbNiH4V8b93uMpz4f8Afzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzrz30+d\\/zf5VUEXwtXegG\\/cbzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzbzz1\\/k7mQA3n8W9BH4jwUz7zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwj3bn3OE\\/rbI5R3h1wLu9vt7zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzx05JnxTJ195O+o3UPw7z7zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwDwUeKMFzzHyzwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz12vM5\\/l3P7zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzw9fzzndkTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz\\/xAA8EQABBAEDAQcACAEMAwAAAAABAAIDBBEFEiExBhATIkFQURQVICMyQGFxUhYwM0JDgIGRocHR8FOx4f\\/aAAgBAgEBPwD+5UThXe1FOq4szkhTdtnE4jbwtLvtvwCVvdqN5lGAzP8ARUe2laV2ywNv6+iilZMwSRkEH1Hvcn4StTGLTx+vd2T1dtZ5glOAV47Nu7PC7V6yLLxBEeB3dntRs1LLWRO8rjyPQ\\/8AflNORn3e3bjqxmSQ8BO7ZvFjp5FS1GG5GHxlXrsVWIveVem8adzx6nuBwvrCfbs3nCLs9e7SZWxWmOd8qJ4ewOajI1uAT191JwF2j1OexYdG7gD07oLk1c5icQrF+xZ4lcT3BpPRMqTP\\/C0o0LA6sKdC9vDgigccql2ouVI\\/DHIV7W7V4\\/eOXZjtN9JxTtnz+h+f0P6\\/+\\/36+2kgJ9iNn4iorDJfwH7Hjx5xlal2erX3F\\/Ryt9jpmZMRyrVWSs\\/w5BgpjC87WjJWl9lJrWHTeUKp2cp1fxDJTWVIeAAEZKx+FLQp2R5mhaj2QhlBdBwVf0mxSdiRve0kEEdV2fuz26bXWB5h6\\/P6\\/v8APtk7yyMuCfcleTkoknqqU\\/gyD4KBBGR3WphFGXIvLjuTbMjOhVK+97wx67Xae2UMeweYrQezkdVommGXFWbzIuGdVLcllPJRLiVtcmyPbyCq2pOacP6KaGC\\/EWuGQte0F9F+9g8qwqrQZWh3TKotayBrWdPbLH9E5EYPdnCpXmPbtceU6eNoySr9rx3Yb0XTuoN3ShSQMkILh0V65sHhs6pkMkx4Cr6YesiZUiZ0CMEfwptPjkHAwVYpvhPPRQWXQuz6KWOLUIC1w6rWNOdRsOYRx6JhLeQtI7WsgiEVgdPVQdr6csrYzxk4z7PNO2Fu5y+tHiT9FBZZMMt7r0zY4iPlZz35W4o9zoHtYHkcFac8MlGVITsJb1UWnukdvkUk0NUYChssnGW\\/YkYHt2lXqphdkdFp1jY7Yei7WaeJ63jAchdO4Lsvqf1hSAefOzg\\/7H\\/Ef6g+yzzCFm4qzZdO7JQUcrozlpQ1SUDClmfLy4\\/zFPZLD4ZUjDC9Q6rhuHhT6o5ww3hOe55y5V53ROy1Rv3tDvsXYhLGf0THFj8qdgsVC0+oVqMxSuZ3RxPkOGjK7IafaqTGR4w1w5\\/29ltw+NGWp7Sw4P2QM8BQ0ZZfRM0g\\/wBYoaTH8r6pj+UNLiC+rYlDUZCctUtKOU5KOlRlHSW+hUmlPH4Sn1pI+oVEkwjP2HDIOVNxIcKpzW5WrAC1IB8pjdzg0LQdFhrQNe4ZcUABwPZtUrhp8QI99am+c8dFBRjhHTlft\\/NuY1wwQmMDBgfYe7a0kp53PJ+VAPDr\\/wCC1N++y8\\/qo3bXArQdTjtV2jPI9mK1WUbQzvpUTMdzuiYxrBhv5LUbHhx7fUqCMySALVZxUpOJPopXbnl3dXtSV3B0bsLsxrk91xhm5x6+x2pTDE549E3VZB1T9WeRgBPkLzl3dTr+O\\/HomMDBgfkpHhgyVdD3O3nkFabV2De5dsNUD3Csw\\/ujysIBdjKmyIzEdUPYtUOK5\\/cLPeBkqlX8GMfJ\\/JuaCMFGuHsDXLXNXj06Ha0+ZTzunkMjzyVBC6d4Y3qVT7GMdHmY8p3YmLPlctOotpQCFvp7Hq39AP3\\/AOfsUIvEmAKH5QrUOzte6\\/e8nKtdimgboXcrTKxoai1lgYQIIBHstqATx7CrNR0HXv0hnJch+Wwu2DBHI2RvVdm9V+nVw134h7NZjD4yCiMHu0ofdH8xq+jM1Jm08FaRpEenR7W9fZr1tsbC0dV17tKP3Z9\\/sNLJHNPoe\\/SX8Fvv+rRbJt\\/z36dJtmAQ9+1OHxISR1HP\\/PfC\\/Y8OUMgkYCPfiMjBU+mMcPJwpIzG7ae6lc8F2HdE1wcMhWrbarN7xx+i\\/lZp+cFx\\/wAke1FHPEij7SUX\\/wBomaxTeMiQI6tTHWQI67QHHihDW6R6ShDWKZ\\/tR\\/mmWoZBljgV40fyvpEX8QX0mL+IL6RF\\/EFuB5C3LeEHA9PbdTAEvHfRvGM7X9EQyVuOoK1nsm2bMtbg\\/CsUJ60gilbgoaHOrWnzVW7nHhQNkmeI2nqvqOwm6TO6Qx+oUmjTx4z6pkOoxt2tdwtmp\\/xqc6hCAS5CPUT\\/AFkI9Sachy+tNTrcvGQrXaOaYNjgOCUZNVI\\/GhPqsQJ38LQNRfer739Rx7ZqUTo5cnoen2Kt58HHUKG3HMODyu1lXdELDerVUlMsTXn1WtTF7xB6Jg+iSNe05THbmBxUFl309zFq9x8DmgBVnmWJrz6q5bmrvyB5PVXdVjljAYOcqvIZYmvPqp7FltgNY3ypwaWnct221938qSYRNaX9SrZcIXFnXC7IEfRSPXPtlmu2xGWFSRuicWO6j7DXFvIWtai9tfwSc7lQjLIGtd1Wq05Z7ALRwr2mR14hI3qq\\/mjbj4UNaQXy8jha6C+ZjG9VTaWwtafhaxYlH3WPKVcYyCoyPHmKptLYGtPXCkumKwI3jg+qtRuliLWHBWl6fILG6QcBXrcUTw2RuUx3iMBx1Wj2nabd8F34XIH2y\\/SFhu5v4h\\/3Ch02ST8XCl0t7BkHKcNvB7tYjedj2jOENZxxsK+uB\\/4yrt424\\/Caw5Ve3PSaI5mEhO1kEeRhJUjLIlbalahrOekZVuw+8BGxhHK1SB7WxuxnahrIA5jKu2JLrmiJhyFVvTOAjMZJUNGw5pftWo07M724jPBUdaw5udi+iWLNyPyEBpTRgY9v1OIMkyPXuIytjfhbB8INHoERu6oMYOgRGeqpU2ObuITaUYHRWdPa8cJ1Jwdt2qrRawZxyo6zGcgLGOi2hYWPcNWz4gz31q5ndhM0+IDkK1p4A3MRGO\\/Tx90O8xgprQPdZYmSt2vGQrWlvj80XI\\/1\\/wDqIOcLT4PDZk9SsIjIwr8HhSHHQ9zWOd0CosLYgD73JWikO5w5QGOB32arbA8yj0+JvplNhYwYA\\/uV\\/wD\\/xAAwEQACAgIABQMDBAEEAwAAAAABAgADBBEFEBIhMRNBUCAiURQVMkAjMDNhgEKBof\\/aAAgBAwEBPwD\\/AKVpjsw3BifmWJ0HXJE6zoRsRgNiEEHR+bEr7qOWRVsbE0d6mNUV+48r0DLs\\/MKpY6E\\/S\\/b\\/AMx0KHRiKWOhFGgBz6F\\/EHKwbUwjU18tRUFXfJlDeRFQL4HPqE6h+YCObY6sdyupU8TIo6fuXx8dvUa5F8mV3JZ\\/E\\/R6qb1uV5BQaEXKB8xWDDYhOu8syQvYR8hj33GyAD3afqU\\/MW\\/8GV5BH8olgfx9F6BW+34y1iqEiNk2N5MJJmLb6dg\\/5gO+\\/K+0VoTCxJ3FvdPBmLmMzdLTFs9jLr9ntMjNWrsO5lmU9nkzuZoxXZfeU57Ds0pyAe6GVXhx35Me0cksd\\/GXf7Zh888XLUr0se8NyAbJmXkeodDxzwhuwQEjxM3K6B0r5i1PYdynh\\/u8XGrX2hpQ+0swq3HbtL8U1d5Te1TbEouDAMJU4YcrMUsdiHGcDfw9tq1DbQcQfr37Sq5bBscsu0IhH07PNqmVQx8GYLAW945PSdSvEZ26rI9teONCU3LaNj6HUONGZeP6TdvEwbirdJmK+jr6Mivoft4PwttoqXqMvvNrb5JY1Z2pn6+zWpZa1h23+hjBXq6DLFNLyriGhphLc8sNL2jMWOzKbWrbYiN1KD9GVV6lZEVultiY77AaKdgciQPMyXVhofC5NXqoVEYFTo\\/SASZXiWP4EThp\\/wDIz9vT8z9vT8wYFc\\/Q1yvGWv8AjLMVLPMPD0h4cv5j8PYeI9Dp7TFJNY39DDYlg051MM\\/4xK\\/4iE6l1rMZ3+G4hSB94g5blGM1p\\/4lOIlft3\\/1CgI0RFUKND6GOhuOepyZiD\\/GJX\\/EQ+JchVvh+I2DQQc8TE9Q7bxFQKND+lm3BE6R7ylC7gShO4WDsNciobsZkVBO4+DyLDVWXEXiLjyI3EXI7CM5c7PLGp9Vte0RQg0P6TsFGzMrqZ+r2mDR0DrMxa9DqP0ZTd9fB8QP+E\\/Rr2mLSK0H9MjYhpDKAZj09eh7QKAO0ZtDcbKIPafq2juXOz8HxH\\/a\\/wDf0YlfXYP61d7J4i5Z947B17Q+fhb6RcnSZfjNUefDV8t\\/YxdEEGX19DfDXoHQ7h88uHj7P7Fdprlthfv8Nl5CopX358OO6\\/n7gVsKn258ObsV+f4hX02dX554T9Nnz+dV11bHtzrbpYGVP1qD88RvsZdgqRtY6FDo8sXKNZ03iKwYbEA6joT9NZP07\\/iGhx7Q1OPaek\\/4nov+J6L\\/AInpP+IVI8iH7e5nr1\\/metX+Z6yexgO+W\\/js8AWdueLldB6W8RW33EpydfynqKV6oeMUDsZjZ1WS2kltgqXqafvFAh4lUEFntE4pS+9RuJ4xPePn4rjRlX6K06UT1MH8QX4I76lV+Pb9qmGlUBY+BP3DG8Rc7GchZagVu3xmdWyWbPg+Pooy2r7HxKshLfEobe1PvM2sVWlROC0gIbDLgLaystULYVEyKgMJTOE4i2qzNMqsV2lRMTEpvTW\\/umHw1qnPUe0y0FdpUSqihqOtz3isQ46fMJ3j6b8RKDYzdPgTEUesA0yfI18ZfSLk6THQoxVvP0KxXxOFWWWMSx7CcQcPeSJwzKrroIJ7zE4i2RYUImSCtp3L70bCC77zgzdNJLTNYNcSJwvHq16m+8x7HtvZiewma4a9isqwg9BdT3ExHFVoZpxDNT0NKe5mDi2WoWVtS0GqzsZU65FIYeR8bl4ouXY8iV4Lt57SzAde4M6SD35cJZQGVj5jcJDHfWJ+0D2eYeGuK\\/qM0ycOnLbqrbvF4Ro7du0rNBqNNZn7R1H+UxML9LtiZgWL1urdtxuEbJPUJg4oxwQzb3L+EAsXB7R+HbAXqmFijHUqT5j8L2xPVMPHGNWQT5+O1yz0CvscgSPEFrfmeq\\/5htc9txXYeIbnPYmBiO4mCpC9RM6pdQtg7djGouDa3Mer012fMLE\\/KcR31jnjUm1ouHWPaZOGNbSHtN8sQ7qHzNla2DpYbl\\/D2T7q+4\\/+wgg6mFV0Js8iNzMq9Ozt45BWPgTEUrWN\\/NvSjnbDvANc7sdbh90TCrUwVqPA\\/wClf\\/\\/EAE4QAAEDAgIECAkJBgUDBAMAAAEAAgMEBRESBhMhMRAgIjJBUXFyFBUzNDVSYGGRFiMwNkJTYoGSQ1RVc6HBJEBEgrElRWMmZIOikKDR\\/9oACAEBAAE\\/Av8A9GjFawIbeMCD7dPlwReeFsuQjHdxZndHA2UjftTXB2724fzjxHjFpVK\\/PF7xwk4BOOJ4Rs3ITho+cOA60No2e2z+ceLFyJMegrFYqV+OwcW6Oy0Ui0ec7wXAnZ7YOeAmvB4r+ceNmKxPGvPmRVhGFIPa+R+HAFHJ18Mj8Bs+mrIdfA5itbclKG9XDiMfauR+CO3iB5CLz\\/kI3ZFrQnS9Sx2qKTHYd\\/tU\\/nfSEgb0ZoxveF4RF941CaM\\/bCBB3H6OJ+bYd\\/tTXOMPzmGLelRXGnk+1lPvTXB24g8d72sGLyAFUXaJmyPllS3Wd\\/N5IT55pN73FBkjvWXg8vqlaib1XIGoj3F4UdzqWc7b2qnu8btkoylRyskGLHA\\/QxvzD3+zZIG8qSqiZznhS3eJvN2pl4xkALdiY4PaHDp49TcI4H5TtKhuEEn2sCn5JWEYg4qstMgeXR7kWVNOdmYKK6zsOEgzBUlXHUt5O\\/q4ScN6rbq2PFsO09amnlndy3EqnopZjsaoLNsxlKFNRQjlOavCqGPdtXjKk9X+ibX0Z935Jr6OXcWp9up5BswVRZPUKdS1NI7FuKpLptyVAwPWmuDhi04jj3Cv8Ewyc9UVSyrp2yx9O8dXsxVzinizlTXeV3N5KkqppOc8ouJ3nhstXj8078uNVSiGFzyp5DJIXHgbNI3mvIUN0qI+cQ8e9MukEmyaPBR0lJUjMzAqS2ah+tpzu6ENymlbEwuecAq+4OqDlZsYqemkndyQqe3RUzc85Ut0ZHyaZn5lTVc0x5bzxoqqaI8h5VNeOidv5hRyRVLOSQ4KttUcuJZsKaai3PwcC6NU87J4w5h4rjg0lTF9VVnpxKtdL4LBh0nf7MXvzTjU8mrla5QP1kYdxb5U4nVN6N\\/Gs1QIZsHHYVvCqJGwtc524Kuq3VMn4egK3W907gXc1TTw0DMkYBkVRUSTuxefooZXwuxjOCoLm2bkSbHqaFkzcHBTU0tDLrIeb0hU8zZ2Zm8SUYxuHuVipQZ3ud9k+zN38zdx7JUZmas7+JXTiCAu6ehSvMjy48b7TcOtUfmzMVpFsjAVqt5ndmdzVX1jaZmpgwzIkk4nbwlwCMvUszjuWWQ9BWEo6CszhvCDgeJa7juim\\/IpzQ9u1TQGjm1jOYd4TXBzQRu4lLGIpnEbnezN18zfx4JXQvDmqlukb2\\/ObChVw4eUCnuUMY2HEqtq3VL8Tu6uO3yzO1U\\/kWq50pqXs6lWztoacRx88onE4nfwF4CdJjuVPSSznkgqmsfTKVFbaeP7KFPEPsBGCP1QpKCB+9iqLKx22MqoopqfeMRxLPXZxqpDt6FIwSNIKY008urPNO7ih5C1hUchzbd3sfXXJsBys2uVFcWT7Hcl3GvDstI73\\/Q4n6GmGarYoxgwKZ4jjLj0KpmM8znuROCc8lUlHJUnYqaxtacZHYqKFkTcGDjvYHjBwVxtf24PgnAtOB4GOLHBzd4VvqRUQg9Kq4tZH7wmHFvv48TszfePY253HJjHFv604knEoEg7FQXTLgybd1pjw9uLTiOFxwGJV2q9dJlbzR9PUz6kt2b01wc3EbuCi86YU3cFcYXzQZYyqkalxaecgHPOAVPQtY3PUnAKSsy8mAZWq33MtdlmOITXBzcRu41TVQ02XXyNZm3YobRs4LpQZwZIxtRGBw4LbUGGYdRTDmbipG5JD1HjxOyv9jLpccMY4t\\/WicTieJS10lOdh2KK8RkcsYJ93hA2AlVlyknGA5Lf8hJD4RhGBt6FA59LOYZRhwMdlcCFb65k0YDjg9O2tOCqbbI+dzjuXzNG3BmD5FLK6V2Lzw2qv1Z1ch5KacRiOJI8RsLnHADanay+3nZjqW\\/0CY3K0NG4bOAq8Uuqlzt3Hhs8+shwO8KduLcfoInZm+xV2ry35qP80dv+YzFpBbvCu0uvkhfhg\\/DAoHoPACRuQq527pCpJ5ZOc8njWd7nQYHo4mlkxitmDftnBaJ07Y7drBzpDtPEukWtpXe7hssuSoy9adtbxnODRi44KpusUexnLcrRcny3DLJzZBgO32KvcGSbONx\\/yDYXu3NKFHOdzCvAKj1F4BUeovApulhQon9S8CcvAyvAyvAXFXqDUTQDrH90bc52V3uUtM5nQjsQGKyLKVhxLI7k4cTTLzBneWjHoiL8+JIMzCFOMszh7+CmdkqmKM4xhO5x4lwrW0ret56FPUzVLuU49ipbdNP9nAKgtLKdzXuOLh7FXGn18BHSntLHEH6MDHcqegmm3NwChs7R5RyioYI9zEGNG4DhnmjgjL5XBrVV1Tp49bM80tH0es9SVs2tfqpZMmOzavD6n75\\/xXjCq++f8U25Vg\\/bvVHW3KaZgY6R23oC0v8APKXu\\/wB1Vi45YfAcmTIMcUYr4d7Yv6Lwa7faghcnR3Jv+gjPYi6raOXbD+SdVYD5ygnb+S8LpT0yMP4mrFrvJua\\/sK6duzgsjuVhxNMvMGd5aMeiIvz4HuDGlzjgAhtR3Ks85f28GOErFSHGnb2KTnHiVhdUVzh78Arba2RMDpBi5BobuHsZeaT9owfQjbuVJbZJtp2NVLQRQDdiVhxausbDyGNMkx3MCuNYymfrKtwnqfsxDmsVuEl7uf8AinnINuCu0TYbhNHGMGtdgFT08tQ7CFhcfcqXRurl8phGPerfYqWkbym62Trcp5IqSHO4ZW+4LTDbW0vd\\/urvd57f4OyJrSCwHavlTU\\/dRr5VVH3LENKpumFi+Vcn3Dfim6V+tT\\/1XylpZPK0qF3tEnlKbL\\/tRq7VM3kyZe1PiiO2CZh\\/NWdpEu3iaZeYM7y0Y9ERfnwXHbQzd1R+Tb2J2xpVScZ3n38DvKNVD5qxP554lBTf9Ufm6NqHsbKwPYQVVx6uoe3jxQvldlYMSqG2NiGaXa5AYDZxScBtU9W6YOEB1cQ50zt35K4XhsQdDb8fxTHeU5xc7FxxK0M9IP7ivnpao760YgZFao3Acp+0nh0gqoDS6oStMhcNgK0t89pO5\\/daV+Wp\\/wCWOClsVbUxiRrAGn1ihozW9cfxXyYrPWj+K+TFb\\/4\\/inaN3AbmMP8AuR0fuI\\/Y\\/wD2CdZ69p82kTqCsjO2CUfkopKumeCNY0hWmp8LoY5Tzjv4dMvMGd5aMeiIvz4Ll5jN3VF5NvYq1+rpnn3Jxxdwb5mhUmymajv4jWATB\\/SgcfY66HGsfhxqSldUPwG5UlIynbsHK6+NPM2Ecrf0AdKuVXHCzPWu2fZgad\\/arndJq52HMiG5g4dDfSD+4r36WqO+rKzJa6cfhUnMOBDfeVpBLKP+4CT8DVAcZ2Y9a0s8+o+6tLPLU\\/8ALCbsKk0gpvFeRubW5MuC8LqOiaT9SoqS51dO6WKZ+A6C4qHxrrQ0OqBicMTiq5l5osvz0kgPq7UyvvDfvT2tUNXe3wGUN5I6whpHXDnRN+Chv9RPj\\/ghJhvwCj0liiOR1KY+sBW6801dJq48Wv6jwaZeYM7y0Y9ERfnwXT0fP3VF5NvYr7PgwRD8+GkbnqghyYR2cYEhNl60NvsXXVAghJO9SOzPJPFo6Z1RIANypadsEeVo40s52thwx6XHcFcr1HTFzKQ62c75T\\/ZTyvmkL5HFzjxNDfSL+4r36WqO+rb5hT9wLTKeRhhY1xDT1cFP5dnatMNlVSO\\/Ar1XNrpYywYNa0N2qkppaqURwtzOKotF2gA1chJ9VqprVRU\\/k4G49Z2qWeCmb849jApL\\/b2ftC7sam6QW937R35tXjy3\\/ff0Xju3\\/fj4Lxpa3ftY\\/go6+2sJMcsLcepVHiipdmldAXdeKpKe1wyCSAxZuvMhLGdz2n81W00VbAY5MCP+Fa6XwKjbCXZsOnguno+fuoyiKmDndDVVzGeZzzwSHBqsMOeozKY7MPoIK1hnMOO0ew1bUtpYg93ScE26wHrCFfAftrwuH1wqi5xRjk8oqrqX1D8XcWCIyyBrVQ0zaeLDp6eK9waMSq+sZDFmqXatnQ3pcrpeZaoauL5qD1RxtDfSL+4r36WqO+rd5hB3AtJbdUV08OobiANpVHou0baqTH3NV68EoNXS00TdY4jM7pWmfPpT+HgsbaykifVxRt1e7lLWXIsBEUOPatZctoliY7HdlfgtU6eirXSY66JwO09HHOIWJQe4bnFMqp2c2V4\\/NaP3OqfWMhfPyD66EzccMR8Vc3DwCbE7MquVbrQ1jOaBwuOZ2AVlg1VPmO9POLuPI7IxzupWzGa45vf7DaRu5ELesk8OJ6+MBiVaKTVM1jhyjxXvw2DaVdr3FSkthwln6+hqqqmWplMkzy5x4+hvpF\\/cV3aX3mdrRiS9UnIp4Yzzsm5Egbyq29UdKDjJnd6rVAXXa9tJ2ZnY9gWktOJX0WLdmfKtKAyGqbBFGxjGt6AmV809new4YQFuGA6FUaS1kjcseWIe5W6tmddIHyyOec3SVSxgXa6U5\\/aMKeMHEca5tHg9G8dMfEtWXxhBrG5m5toUlppcPm4sHdqu8eUOjLS3\\/csdQ8NL+QR0oHEYjcpHYK10xnnHUE75uMNH0F3l1dI78WxaNw7TIfYbSM\\/PxD8P0NqptdPieaEBgOJW1cVLHmmeGj+pV1vstTjHB83D\\/U\\/Q6G+kXdxRfWw\\/zCj543uLSiaFjY2yvk7relTOa6QmNuVvUtFPS8fYVfN9H\\/NC0v8ASv8AtCtAz0tdH\\/48eCB2WZjuorMI9JoXDdNH\\/ZXOPVV87Opx41wZ\\/wBGoX9o4kLskrHdRULs8LHdYxV9pWvpZJftAK57C1U7sKWNQxumkACt9MKWDbvROJ4kkjIxi9wC8YU2PlAm1kDt0jUJYzueFe5hLKyNhxAVni1VI33+w2kBxrh7mD6BoxOCtkGppx1nhKu1\\/hpcWQYSS\\/0CrauaslzzvLj9Fob6Rd3CofrYf5hR87Hc\\/utNfLwd3g0U9Lx9hV751H\\/NC0wH\\/VP9oWjPKrXxnc9hCnbkme3qPBcH5WWmrx3YBaQ22easNRTRmSOQY4tXi+r+4k\\/SjRVI3wyfpXg833T\\/AILwab7p\\/wAF4LP90\\/4KZrn2WCHI\\/WtedmCFFUk7IX\\/BC11h\\/wBO\\/wCCZZa93+ncvEVwx8gfira10dDCyXDO1uBVwYZKOVjecQr63LKAqVhkjjDVaqAQtzv3p7s3EqZhBEXlVE8lVJtxPuUNsqJRjlwCNnqB0J1uqW9BVHb5nVAzNOCjbkYB7DX30gewfQWuHW1I6ghw6XVEkNGwRuyhxwP0mhvpF3cUP1sP8wo+djuLTXy8HZwaKel2dhWlUpgpYZGc5r8VX1kldPrZucrRLRxVFE5ji2T9oXbl8n6aqnfK2ozNcceSn2yzxPLJKrBw3jFaQmKWngZRyRvhi2ZQdqoaW8FgEGtYz3nBRWy8O59Xl\\/3KK0Vn7W4SfkoraG86omf2lRQtjGzE9qwHUFgOrgnqqmaV8dC1uDNjpHpza3H564wx9ikZDm+fvB\\/Iqk8CbcYGwVckrsduJ2K7NZ4FI5xLcBzh0KehjqZPm65rh1uKpKGvotsIgnaPenXl8eyspnxe8blHOyRgcw4grHhv7jq2N6yrFQDDWyBAYbuDBYew989IP7B9BYYsI3P4mmvmsPe+k0N9Iu7hUH1sP8wo+djuLTXy8HZwaKel2dhWmXo9ne4ArOMttpx+FXSjp3XGcvrWMJduwKpqNgna6mrIXyt5QBB2p2kdeTsewf7Vb79TSUrXVMgZL9oJ2kFA39oT+SfpPSDmteVJpWP2dP8AEqTSmpPMijan6R17tz2t7GrRavqauolFRKXgN6VX5obDVFpILn\\/3UFHUVNPJOzayPeqKhnrc+oGOQYlUMFRJU4UwJlZtVTcq+5f4TAY47Q0b06KRsuqLTrMcMFhUU8uTlsk6laJpK221sVUc4a3ZitGmg2iLEdf\\/ACjG09CmpjhjGdqhqMXFj9jgrpBrYmkb2lUYAp2YdXsXffSLu6OON6t7NXSsHE0181h730mhvpF3cUH1sP8AMK\\/1Q7i018vB2cGinpZnYVpl6OZ3+Ab1a\\/R8HdV89K1PeVq8+j\\/P\\/jgII3jjaFecz91Xj0BP3v7qw+gq1aJMyx1JPUtFvS83YVYfrE7tcqj6zf8AyqtGOlUPc\\/srFzLp2FaNeiIu0\\/8APDc49XOJGqI5o1THAZfYu524VTs452CqKSanPKGzjU7c0zR71GMGAcTTXzWHvfSaG+kXdwqD62H+YV\\/qh3Fpr5eDs4NE\\/SzOwrTL0czv8A3q1+j4O6r76Wqe8rT59H+f\\/Ci8s3p2rSwOFNSYxsaPdxtCvOZ+6rx6Bn7391o96FrFo35KdaLel5uwqw\\/WJ\\/a5TfWc\\/wA1Vf1qh7n9lY+bdewrRn0RF2n\\/AJ4bx5IKm8mFuUbs7cfYt7GvGDhirpQCIayPdxbaMatnF0181h730mhvpF3cUH1sP8wr\\/VDuLTXy8HZwaJ+lmdhWmXo5nf4BvVr9Hwd1X30rU95Wrz6P8\\/8AhfaUslTUBok1jwNyMEo3xv8Agi0jeOJoV5xP3VevQM\\/e\\/utHPQ1WtH2ZYZuxaK+lpuwqw\\/WF\\/a5TfWj\\/AOVVX1qi\\/lqyc269hWjPoiLtP\\/PDc4tbCqVwy5cdquVe2nblZterBVukzMd7GV4xpZMepHfxLT543i6a+aw976TQ30i7uFQfWw\\/zCv8AVjuf3Wmvl4Ozg0T9LN7CtMvRzO\\/wDerbVwi3Qcv7KukUs9fNIyKTK52zYrbRVclW1sLHNd1kblbrFS0rcXt1snWU2Njea1o\\/JYDqU9FTTjCSFh\\/JXDRmNwLqR2U+qVVUs1LIWTMLTwaFecT91Xn0DP3v7rRn0RVdqtbcsMnYtFfS03YVYfrFJ2uUo\\/8AVB\\/mKp+tcX8tWXYLr+atV\\/dQwah0eZoOxUekVHOcryYz70x7XtxYQR7uCrohJtj2OVRbp9Z1q0UQp48TzvYy8TCOlI6TxbT523i6a+aw976TQ30i7uFQfWw\\/zCsnz2f8OC018vB2cGifpZvYVpl6PZ3uGKvqomBkczw0dCbcq0nAVEnxVuBpbc19ZLi7e5zkdJqMS5csmX1lBNHPEJIXBzT0p1a2KqMM3J2ZmnrTb4x+2KmqHt9YNTbq13+lqf0KufBXRFktLP7jk3KrpZKd5zse1vRmC0K84n7qvXoGfvf3Wi\\/oqp7VQ+Tk7Fop6Wm7CrD9YZO1yIHyld31P9ao\\/wCWrP8A91\\/NHnFYFWq6VFBKMCXR9LSqKqjq6dssW4\\/04CAVlw3exdVVRwNxcdqral1RLid3FtmyrZ28XTXzaHvfQhpduBKhtlXNzIHqn0Zqn+Uc1itVoitjzKZcXEYbVSPbJpVmYcQXlaW1EtPTQGGRzMXHcppZqh2aVznn3plPK88mNx\\/JW0zWuqZUzwPybty0jrpKuigdqiyFx2E9PDTQuqJ2RR85xwCobPJDeIYp8PX2LSu4GWo8FjPzbN\\/vPBolXGKq8GeeRJu7VpdBmomzN50ZWiE+stxjO+N3DpNT6+1yHDlM5S0L85n7qvPoGfvf3WjJy2iqPUVY6jXio9wWinpSfsKsP1hl7XKV2Gk\\/\\/wAim+tLP5Ss3\\/dfzVBGJa6Jh3FyFvpP3eP4LxfSfu8fwVM4UF8dSt2QzDFo9\\/sdVF4ne15JLThxqV2Sdh96btAPE0182h73FjhkkPIY53YFBZK6bdCR27FT6LP31E7W91CzWqlGM8mPecjdLRRbIWAn8LVPpV0U9Ph3iqjSCul3PyD8KlqZpT85I53aVY5mQ3SF8hwbjvWkUlO4UTpiHQazbgvHFpg2Q02P+0J+lDG+RpPiVdb1LcIxG5jGMBx2KvdFcLFAY3tEsI2sx4I6WaTmRPP5KC2XAPDo4JAR0qzxVVK+pqK7NnbHszFTvMsznneSoqKplbmjhe5vXgqYupqyNzsWlrulXOrpKm1zATMOLetRTSQ46p7m9hXhtT99J+peG1P38n6k6rqHAh0zyD71onUxU9TLrnhmLelXCshmsU7WytLs2781bLnFTWuogeHZ37sFo\\/c4qHX6\\/NyxswVhuEVHXySTY5XBWyvip7y6ofjqySpqyN178JGOrz4qS7UpvzagE6oMy44KguMNOK8nEmXmhRyuilEjDg4HFfKG4feD4L5Q3D7wfBOuU8tbHUSvxewqCQSwskG5wx9jb3Hq69x6HjNxmnAhUT89Mw+7iaa+bQd5Q08sxwijc7sCg0frpf2eQfiUWjUUYxq6kBaux0e9wkd8U\\/SKkg2UtN\\/ZT6T1TvJtaxVF0q5+fM\\/sRc528kqltlVVNzQxOLetOsda3nMA7XKl0ZnfgZ3sY1fJaLJ5ZxPYpIaRhe0ySZx7lmc7BhccuKg0azta41LMp6l8nqNp+crW\\/FeKLS3nVf8A9leoKOAx+AzZ8econBsjXOGYA7l8pywAQ0zGgJ+lFUeaxgTrvJU26rMxGd2DQFo7bfDqrGTyTNp96rtdBTNFDGC7HDDqWkltFRR69rQJ2DE4dKtFnfcY3PbIGAHBS6NMgjzz1Qa3rwTrZbx\\/3BvwXi6h\\/iDP0rxdQ\\/xBn6V4uof4gz9K8XUP8Rb+leLqH+IM\\/SvF1D\\/EGfpXi6h\\/iDP0rxdQ\\/wAQZ+leLqH+IM\\/SvF1D\\/EWfpXi6h\\/iLP0rxdQ\\/xFn6V4uof4gz9K8XUP8QZ+leLqH+It\\/Sre1jaKFsTs7A3YfY3SKLGKOUfZOB49jkzU+Xq4l6LBGwvpDUnHYOpeF3PJhS25kQ7FLFfpxyiWjqBwU9quGb5zafe9OtNWBzB+oKRpY8tdvHDTRmaeONu9xwV3u09LP4LRO1cUPJ2dKut0bW2+lzn58HlYK5176iRoic4QsAa0LRKvkfUOp5XlzSOTitJYdTdZcNzuVwWe31Fwdg2QsiG8pujEH2p5SmWCCavcyN79THzj1lM0coG72vd2uXglvqLnNHrNRCzd70LbZm76wn80aWws3zuP5rSGOnZ4N4H5Ms2LR6BlPZw5+zOMziqG\\/Q1NX4OGFvQ1xO9UNTVvv0kU+Z7DiwjoC0Zj1Qq4\\/VkwWlnol3eHHGJOxeAVX3MnwXi+r+4k+C8AqwPISfBHEHA8aweiafu+xtdFr6SSPpI2ceyPyyYcXSmungMUVMSCeUcEblX1GA1rzk27FcanwiRkmbllozdqzHrPEtsrYK6GWTmtdirdb46q2TzSsBknxcD1KRuSRzeoq322LxBg5jS97c2KsDjFeoMPWyrTIf49nd4NGohHaYsPtbSnc0qwcqjc484yHFT+Qkw34KXHWOx6+GSZ8oja87GDAKuxZowcn3YVszeMKfLvzhS3OSnvj6eEMyukGbYrSA2prgPvFpZ6Jd3hx7QM1ypwfXHEvGy51HfPGsHoin7PY66w6itkHQeUONb35ZQo3ZmDhKo5W3K61TyzARx5AtFqcaysJG4ZVMMJXj38a1tDbbTgbsirx\\/j5R+NUoAoIh0asf8ACouTfY\\/5q0wifJUxuY0uaG7xwWG+xUlLqKgHZuIXylovx\\/BUV+p6eonGDtS45mqiu8Nc8sp2uLsOlO0ekfXmV+TVF2OTFeK6UDF1HEB3lW1lsgLmNoo3u6wdiJxdjuVtyVVkjD+YWZSqS3R2yV1XUSxuDPJgHerZmrL5G93S\\/MVYX55a0\\/8AlWlfoh\\/aOPbpWw1sMjua12JQu1Dh5wxeNaH94Z8V42of3hiucjZq+aRm1rnEjjWD0TT932O0ggzQNmG9mw9nGjdlcrbUBzcOF24rRqUNrq9p7VorMNZWj\\/cqg4zvPv4LFbRcZntc\\/KGjFV1K+kndG9pHVj0qkoZ6pkjoG5sm9TQyQPyzMLD71aJg6zQvx3M2qqfmqpHdblQzB1ojkx\\/ZqZ2Mzne9GrnIw1r8O3gIw38NJWTUhJgeWE7145r\\/AN4cpLtWSMLHzuLTw6O1Wso6igLsHuadWo3yUla3XMLsh5jlTkUcNTcZIxE+XZDGoayeB5dFI5pO9VNzqqmHVzSlzFHG+Q4MaXdihs1dNzYHDtTNGawjlFjfzXyWqfvY18lqn7yNfJap+8jXyWqfvI18l6r7xi+S1V97GrraprdlMhBa7pHFs1F4dWtiOIb0pujNGDtLz+ahibDE2OMYNbsHsdKwSxuY7c4YKbGGZ8Ug5TTggceLSzmJyo6gTs9\\/AVpDR+LJWz0jnN1mIcoKiWAuMTy3MMDw6HHJJO87sMFpHSS180TocMGjDaVo1TPoNdr8OVhhgtIaA3DVvgLczetNr6qhp5qLcCdvu4IbtURW91I3DIenht0WuroWdblVW2gqX5pI+V7l4ltvqn4rSG3Q0hY+mxyHfxmPcx4cw4EKLSB2X5+nillG55G1V9dNXS6yY9g6Bw6L0Xg1FrH8+TasViseNeqPw6hfGOdvapGGN5a4YEcTRS3+D05qJBy5N3Z7I1luhqZNY4cpVNmyDGFPYWHBw4tHVOp5AehU0zZ4w5qfHn6XDsKq7XDVMyzF7gPen6PUjfX+K8QUn4\\/ijo9Tes9RWUQ46qpkaD1LxW\\/97lXiuTorJUbZUdFbIpNH9a8vfU4uP4V8mv8A3I\\/Svk1\\/7lvwR0bk6J2fBfJyX71iisNTA8PimYHLwG5\\/vLV4FdP3hqqbdc52ZJJGOb2rxBWfg+K8QVh6G\\/FfJ2u9VvxR0er\\/AFB8VPZqyFuaRgA7V4JL6q8El6l4JL6q8El9VNppmkEN3IV9yH2v6I3O4j7aF1uHrD4LxtX9YQvNwHV8F47uH4fgvG1wcehRVF6yjCnaV4Re\\/wB1YvCb5+6sVfbblWz619KGu6cq8Q3D7g\\/FeILh9x\\/VUNmrYKhsj6XOB0EplXcccPABh3kKiu\\/c2\\/rUctQTy6cN\\/wB\\/sjfKcZBIBxrfWOppPw9KhkbKwOaeAjFPjw3f5Brsq1i1irKbwp3KeQOpeK2+uV4rHrrxW3114rZ668Vt9dG1NI55TrKeiRRWb1nJ1kb0FeJhjtevEzPvCobSyOQOzkpj8rQFrkx2b2YvjwKbDr49vrXU7\\/wqCZkzMzDwujBTmFqecrCepeM5PVC8Zyeq1eM5PVaqd+sia49PBWSmCHO1eM5PVC8aSeqFQVbqhzg4DYp7g+OVzQBsXjOT1Wrwt\\/geuwGK8Zyeq1eM5PVavGknqtXjOT1WrxnJ6rVT1DpKZ0h3heM5eoLxpL6rV40l9Vq8aSeqE26H7TFTVcc\\/N2O6kHbFUvMcLnjeF4zl9ULxnJ6oXjOT1QobjI+VrcBtUXO9mL69\\/hOR27o+gpap9O\\/FpVHXxzgDHB3CVMMWuAVRA+E8vp4IIXTOys3qmaWQta7eOCvidNBlZvT2lri07xwWeMjF\\/QVcInMnJP2lGwvcGjeV4NJ4BqsOViponQvyv38EED58dX0J9FMxpcRs4LeC6hcFUROhflfv4KWndUEhvQp6GSJmbeOCN5jeHBQvzxNd1hVTDJTva3eVIwxvLXbwujHgoIXSShzfslRc72YutJ4VT8nyjdrVu3\\/QNcWnEKiurmcmXaFBUxTDkO4Jgr1z4+C0ecHsQWA4Krzh\\/bwWrzUK9c+NUXnMfbwXbzn8uC31DacuzdKhnZVNcMNi8Cg9RRRtibgwYBXjzkdnBa5o4XO1hwVXXRGFzWHEngAxICp25IGNO8BSuyRud1KR2d5celNpv+mk\\/a38FrlyVGB3OUXO9mb5RZT4RGNh5\\/8A\\/fomSOYcWnBU91lj5\\/KCgrG1Q2DDBXrnR8Fo84PZweGQ+uo5GyNxYcQqrzh\\/bwWrzUK9c9iovOWdvBd\\/Ovy4IIHzE5FbYHwl2cK6zvje0MdgrXI+SNxecVePOR2cEUT5eYMVLG6J2DxgeC1RxucSeeOC7y5YcnS5BeMJMmXI3DDBHemnBwKppM8TXJhxHsw4BzSHDEFXOjNJNs8k7mn6IDE4KBjYYBh1K5zsmc3Id3BbpWxTEvOATq6DA8pO5xVp82Ve3LUv4LZUsZGWPOCuczZpRk3BW5uaqapHtjbmduVxlbLPmZu4LZOyFzs53pjxIzM3cqxxlqiHdeCia2GEYbAArlK2WfFhxGHBa5mRSOznernDrIs7RtHBTymGUOCZVxOYXY7t6uE2umxHNVvEeu+dwwWpiwxyN+CuOr1uMWGHu4LZVNYzI89ihdt9maiFlREY5BsKrKZ9LMWP\\/I9f0LOeE\\/yB7Ed54tq82VxpdaM7OcnMc04OGHAxjnnBoJVupdS3M7nFXLzV3EofNWKbz095S+bu7Ed\\/BHzwgMWKth1M5HR0cFOP8PP2LApnPC\\/Y\\/knc48FP5Znaod49mq2lZVw5Hb+g9Sq2PpZTHIMHBYufuQppztDSi2RnPbhxQcCqSpZLEMSMVkj9ViyR+qxZIvUYskXqsWSL1WJ0kcLegKC4xvJD9i+alH2XLwWD7tq+ai9Vqqbi1hwj2qOaOZm8H3LJF6rFki9ViyxeqxT1MUDN47EZM0pf71TVEc0Y27epZIvVYskXqsWSP1WKashhIDnBAxyjHkuTadp+w34JtOwDmhGnj9RvwRpmdDG\\/BatCmZ6jfgvBo\\/Ub8Eado3Mb8FGzDf7N3ChjrY8H7HDc5UlthgG7EoMaNwClpo5Bg5oVyoPB+U3m8bO7rKzu6ys7usrO7rKzu6yiSd54A9zdxWvl9dyc9zt5PACRuRkcBvK1j3nYSqS2TzDFxICNjxHP2qotM0G1m0LEtOB2FZ3dZWd3WU+UtG8pjXTSYDaVardqWh0m9Ae090GNFJ2f5KXqVktwIEsgQGA2cNwtjJxmZscp4XwOyvCc8BRRunkwG0q121sDczxi72pupwopPoC8LWFB3X9A1uadgVOzJC0Di1VKyobg4Kossms5HNVstzaZuLtrvaq7xvkpHasYnq48jtuAVBbJKjadjVDaIWDlbVLa4HDYMFWW99Pu2t48HnEfao+YPbKvtsdTym8iXr61U00tM\\/LK3D39B4jjgFa6U1FQMdyiYI2BreGRge0hyuNPqJyOjjReWZ2qLybfbOSNsrC2Roc3qKrbORi6lOI9Qp7XMcWvBB6jwScpwaFZabVQBx3ni3qDPDnG8cXFNeNY3tVMcYGdntrU00VQ3CVgPv6VW2eVgJpjrB1dKttI99ZhI0jDeCExuVoA4sjc7CCq2HUTEFGQIyrM4pkEr9zSqS0zOeC4YBQsyRtb1e2+Ax492oDVNGTnJtjnx5WChsbR5QqK207Ps4pkTG7mj\\/8APD\\/\\/xAAsEAEAAgECBAUFAQEBAQEAAAABABEhMVEQIEFhYHGBofAwkbHB8dHhQJCg\\/9oACAEBAAE\\/If8A8NCTVmWriBZyrU0R8dWECL6xV1hKRrMG+SvCC7zF4IZa8bunKK51lJew8bhly8Uq1TLaRemIBQjonjVh5bSO4QDEHWdkcvmAqJs06D08Y75zyMV8wBoxbV5mlO5LVv4vr0axVcxI4luNcEdOB0ao5fq7iOkuIp1cdJefFZ4GsVreTQGL6\\/8AguOzCduIs2vM+FX4pYUd\\/U1AEZoPrP7kWov85og\\/S0lL+nxSUlFoJiPKYwazOzzowrdl0L7ExSO1EpWSpQih5g9cBEEHsj4ne6Spp7fQFGzWF2mvhvRAgf5MxRXHIxscmwXz+fgqU4HYZg0DeZTEy3uZbcEvKrr4hNoCJbLhG9ggS4PKGAoTWW84KqnkJT1xq9eaMCmXI5bQm2WJ+tpcIMTAnU52ONbo7TQAw6i6nhhwF9o0hB2jmRNSHgSgPzOiQYiKasGtJ7STAK2BAPqgXMDTtKNg690VhgdgixH88Ni09ZX2ecKrSYNDYirq8hjSXIfa5pyFkSQgRFz1AJrJNTqcvbgudVVBCHvPDAX6uZjOjBGdTkZUpjmEtLHBLzIxsKkuvAgOVR+jpRG97bfSGtXaMHm28q4bmcjeA1fM25EI1VADzA8MC4OvMKrhpyWqOmGJtXmzmUxfcVAldWBTwnQuUp0jNVPV5EzYTfIaCP8AyPCfbOIo2YY1pzpFMCxmf90mTtcmAnK+cHwwbk68ykokOE6be7EnlxLI9vOFjBo+0Gax1hFgNeUZ0tavFtBNTd3h0eimkFe8Ex9mLM\\/ahOCW1BjObdIN8LRs1lBhdT1gV2MY7pJydandgDfLwctTBiR+HZg8oiXMdfodxlrq\\/QUMqfaabwuNRq4hnMRowSsmjdhTyiECgc6QCQsl5woGk4KxSXLDYmYOI6wygXzc+s7HgxamY764VJay9KmNrEChE6nEWSgmbfrtIygk9rgQdvPZRsQvW5fIRtMjFhLtPqxRgfU1ZdUvWEHtc2rEVZrEAqx0Ylw+4AiMjJwFlkJjRmFbnPQbOHwWoFsApvQiO2o8hSx2wJapmURl5YRz9etYPK2lIpdZ6PBNdDBmhimYpdI8IJ1WXVd30JZuvAxFK09HaCSWPJVedmYNhPswNOtOAsp0mKOHo2SnaGIan0Kncw+CmXDuiVb\\/AOhUVZBg9Ul3zKK1K4M2kYZRfWflO5TCS9NmjkWNWV5QuQs8g5Dw8iyOGuGVOIFhNGuWvAd5d+iaS4wVDYZP34KrfryC6DGvwp+pcH65V1yjSekdqp2mdtnbYbiKzrZDI3SH2i+phvVMuSztO1LnTkufK\\/3\\/AOXJe2iTtlwXuWXchrzuSgmwhBcHoiBS3GOGVZ28FANoyQy6T6bOhbHsm4ysbHYgJQveaavSVwNsOrKzw\\/8AHDoJKr0wPhCaJ9yEGkXA0HWWO9kNa78JI6jek\\/Isf7LCuchutL\\/I6\\/YoW\\/Rsn2i1QK78K+W\\/3\\/5cBhZSsQBNGa0964ZDrcsPITDVmAQSZhFEHgtn5Z9EKoZjYPeYMx30gDQ5XT+pDtN3sD7kNjDWNA2JZoQJ5MuRsd\\/VmFE+oWPtFYBoqStHWTq0SsOv7kOp7s\\/1hh1ICr8U0KRO9MR1W9f1Hg3aWNVV0IBoPTiXbfB\\/f\\/lwNF0tPb\\/xHY7TzocPez2nIHSaPwqTR4NBKxJ2pecmhIUo2toVAo5TZQB1Z2BbX+ky8HEO2Ymqz3ae5QD2WpnXgoawbQjuOvIyw2\\/sabijJ8O3orn2NDDND5Qpj5wXKi555Y316MU\\/QUe\\/Ifv\\/AMuHv09n\\/EzvFw8PukNHtFb5AyVpe8MY8GukN+7mLj5oXO85ltyW6YwBashC8XsuHH36e9TyLsSIp6BFnBurar7RrZWsx+PXg5UuzLI7KK1TW8FfyUvKeqJY7dcgoQBvpGj+vrMDM22CP2mDQmucqmG6iemXCvSW41oOvH\\/d\\/lw9wns\\/4l1MueJj95huZprLsQgY8Ft8WKCJrJeU++5gbK6vLcYgQi9PxtORl1Aq8nvE98hr5GIQdlRVcVdYfs477Q\\/aKX7mIrfop6ccP3lA+oKX7Z6hE+k701YID9H3zDpeqX8+v\\/zGAmrRc+25DB5Tpl\\/c9v4Q71GHdvHLLXDh7hGywH4nXIeNLYMErA+g0h4GgBsGvzymsw6eJjv349HBUuOhyhlawUDPVy29oibaoyqVRp1fOXy+8T3qfL7QlNAR0le1SAj0EyC4fXeDBK143npKIKOrjbnxSCr6ttiWpOa2dRZcC0WLWH1il+XOFzod0aFf2ECoFkRFievGr8iYgylk85KdFwZh63wNV\\/zhX+8Ld53kW9eWoDrKnZHLo38J5xQdH+tNzEDz+8R4SoBOmJFwTZBuyoke7MFbE2IeXKxvIQF9HqvrDquWBcEBqVZt95V0EZYyBYe87HNcprPMTejyOoSkSWSO4L\\/YVcReFmVSnC2wAS11mmNYxVmlNl\\/Qq3WFngZLdun7v\\/PosQdVlQGhyM\\/nZUoO9r3WLf0PfoLgDJ3\\/AJIZ5q216mMATRNz4jaHhVMQXfsscMzRVLDQBrXrcM5zI6ev7+RANQYZeh+zhqQbM7sr9wClVhxGZGueSkB7xCkgvyprp9Z1TAreaYzl4GoOw936CGNWHcOs8VRbgg\\/RuCjpAdD6Xznbhz3L8J7pw+I24SoDvI9UHPSKzqxDCS\\/NBPRIByhyRLX7yfvUiTn7mC6cAC+k5lwSgLfPAsRC2D5wofgRNwQLuZEqYTsfAiVT9wGcqu3J0\\/dCJV2OBKi8xOgJoPpzAsOVhj9DwMr7P0LPTcgoA0OKZrMOsVW36fv3CnuX5J77w+E2lUVEXGiDSsdJl4ExIu8UoMHrLaLpNExkw6qzbQGJ7yk8\\/kyhqtuHaad6hc\\/kTtPtKNiFs7QXsSopvJLS92\\/zljGdG6Je+3WUxbuhtFCNUhV2UInTUiuf7GATWDfChtMkRnNrgChRwo9IA0DwP8Rt9CzDLjk9y+swnuX5J77w+U2nw+3DUQaSsYsiKu4i\\/wAdWBmY6GwIavlfsl9VXaBG\\/wDKpVyXNXEd7ZdUnYljiAdGZcI20gZOq3Ft7Bhfow9KhY2wZRG8ViDubjprdFjM8m3mjKLFs+6DaYBOB0Z3MIYhu7HpDfwWMA3gcxsE30S3k9y+p79wo++\\/JPfeHzG0+V24aE9vmPnZn5\\/5I6wEsL35vi9+EjZnzEr5lpPmt58d3gt+WUtBP9Jh8DWfI7uOka9ZXX1J5F08F3vo0lBV3y+XuXHYork9y+syj778k994fFbT5XbhoT2+e4z43dOkBVwzGCnOu605vg94alfN5R4+zwl8l3ntk+f3T4jvPid3HFe8d+VBsJqQxHr4LdBDHAd5ty1XvDk9y+p7two++\\/JPfeKvlduGhPZ57rPld0yWNbjaC4ttQSweuM0g9+T5vfgAWff9TJ+qnw28+e7zU8k+d2Z8x3nxO7iuDUhw8PRjFx\\/aXLt1vwYEQaXJ73l9y+p8Z24Ufe\\/hPeeHx20+V24aUZHQejH\\/AJir6Q3A1qAggXVHHoQABDaFikPpFFp66o6P02G2O\\/Xh83vwwL+TSecnwkPhbyzyMN\\/HowUO37SgNxQ05YDQ\\/T94Ca9FXEHDAHzol6opdZ1H\\/BlgenUvPJ7\\/AJfcvx9ZlNG+DD6xYOt+Hz20+P246JFg6QXYOIfApc6dpnMDWGJpqHEScTtI6nnA2z6MNnRGWr8bqCZQt6LJ8XvwQbLtlADfPht58d3l6ZPz7M0fPrPeTsMQGnZMZ6zydVtw1QGFtweCkYdhEXljlUY5PdvovU5sEr7g9UqUiXtds7WtQIwBSkjRkCurxOmX7VymPdnDQM8qQ0Na3PEOQ5xLl9FrXiKKC6OA4\\/AkZLGtNmXOzMdnPGkLYU0nznhy\\/dLPaA4dQg+Z14e6z0T43aK3yfvAJsInrAAcGcrCpmh4OINDl2ebbUhd0OT3bkCUBiGn7vJ9CNhbKY2dn2IUi3ztlFh7v1Etw9o1FCt3JUHsl0lhxG67KmcnvCg2A+PQmDWBrmXloo6Z4UaS6VKh+sBVSoVcyI4tqZ22okcRyg0zM7uQMrimQ64rn9pP7iYSlIvMfzqh80skXVssbX52I1pNE6yia6kLm0j4zmZZ69OamVLLcqZXZKtbmK0xn8rP5WVaoRmgiR4NrYwB+H8c1ihH9nJ7hLcPzJVKNxVA2+wa\\/MMst3grOrRogFDvK4k4z0NEctzuyy1dWCDGX0oJZOtm5SnEWVAaqpT1w2MgXBFpcXcH2oUI4ZX2EvwqaXdQnIirrE1CoLn4BoUPRRWOsBi+aI6KAKYEV9oZOsx2TGNC\\/VQJif8AvJ\\/eT+8nQ91P7yf3k\\/pJ\\/ST+8n9hP7Cf2E\\/vJ\\/eQv\\/CpVjQ3fBtHM+hP89+ewXVyaDlX3QDYvDe9dBDHfdo\\/2XBT4bwcK1uIkWOkUgMYMogBYq8X85hWhrLr8QrpIVL\\/AKOD7USv44LaBDpHOwTJ94hoLlK7t6z8ZqZvt5\\/xMXa7uzrMbBNJiMzPVELQp06mKKt4MW7y2Wy2Wy2ARZWCln3s\\/oYsLRBVYJqMtlstlsHwc2Er+5GTn7KeUUqK66lFU3\\/VjX9G8rE\\/vReN8FZ12iRBc12R0NaIpLPYZNoKLW71lS1rwtFbskwQ1qJydVesv3DX2nU1243mPRczcjXZ5k612nnKYKFqVq8zvgfb6GBCWMKJUqECAH7PCh0qU\\/ov\\/b5rJfWXA4qi5dtW5vXEcebDKsKpHKazoFMANpb8wwkBDbAP2meWELrhiauyTtS22\\/Mi6wums0og1uxHTtF4ANVQ3xKLdoSAouh0iYjVvSCtZbRfSZcX5dWYZbYqplz1ifD5EQHX78LIF+\\/HlsR25vjd\\/B1VcnqP+\\/nmqWA254+ylTBY\\/ay0KLuO9zeC\\/tNGYfKFuKpvEQkiDWddC0alWVVdlQCXCMrWQzfIijNN2yJWyKqDLGVBHvxC2NU6xklwCkiq54OYZo3TSXBmfqS3MOk16x5a3R1mSQXTLQ7YXM8JvjD3qUfIZ85nzmfGZ\\/bYf9Bg2CwXryg\\/Rlm0u\\/YmKsCo8HHfbFBXBSgDHKZRh2nDXgLKiAEXXesREJV1I5beGxh90vzpWCD4fWLmJlIi6TA+gtr5I5cxUfuwbcdoQvylEmFK6vhYhdGFunmZYqxJTp5XuaZi2qDQ7cDLUxaH2hKbkpvKby+Fm8s3lkHRX7ka8ukeIW1FoPSvTwiW0mUu8RWvtG9ROUAPdFbu9Yer0hC7YsvrjulIW6wToHrBhrYU4W2wC\\/UioeQrFP8Asjs+5hdR6of3oRU6OZs\\/ciOiesykK6jtRGUKz\\/LwHX9MV7i15UQMpRXBgKB2Ramr5TqGgF\\/RwyXIUYZvSoxjXq\\/2H8z\\/AGUf8P8AY8ZCsBc\\/nIbr7ID\\/AD6mZoTOmJG6h6YUCNwMPB7C0JunmAZt6JeiHgRpj55n16nQEvtL7RxTOgn8SZ9VeU319p3n2nffaVgL0m4vMgXRcAHTHlP5MwgXSUyYIdkHR4YJPVc4YVXqQ0JOOm4ZrBKn1FxF4OExTVInWPaFusx4apQgOka7FXDDcrXNmJmGWZtIk8mAL0RXaE0u4jFLlLqF5jxvdYFaqPCHhfACEvuPoaWXUjoG2w4GyPq5ITDXRwopeqYXAzDWISG1zYZHgEx0hhP4SkyEpRCzRrVcrnWrg8BfVcPnTvwMOrZKaVS+CmB3RYqDWuDC0kovcmhEUTvFEp0McK7qC5p+GBanXN+0RSCk1PoAERlPbv8AWG0V24Vtz2HHCdeCz3Lh7qeweKfjcFMr0VCy91zt\\/vPJuOIqdZMSiFa04MYWsfcAgsdFxtWK5dQy4aLaI6EPDFjtodH6S7FTG+qiu9ap7LjF0KxFpN8h4F7qexePfgcAQ3Ux7XFNYZqMgV9eNuo6NZYLwM2OgPChDuTV5QKIFaYxHRuUX1JSvhgQgqR6k1xcmx2+lUboaCgs4mYY1cMWYii6zaK0NLmj5xTJq3CHzq2XLw2dXG7FuO1oSzt04JtXRCmRaTo0UQ+GoMLVCnDABWiGf+T4dAZzBRiOiDe2MEbZ0GB6zZqBSlhk6ODBl3FFPDN5j7w7kAPv0Bv9H3vCT97l0vOP0h03lyC78LCSfxu4vMJ7XjXltwH34ADokeizzwN6SdqH78+PpC+pKgfQcAeGXGE566jH\\/sE3Jaq3pDoKFNyqBhCAlIzq+wT+eT+QT+UT+URqqexOoRwx21OtABwFAvW5YWQSZU\\/lk\\/hk+eROp1oJVGraGScKVP5RP5ZKeh3qW3Tt0gYV988ClQxuuIsktQLpSYnUwP8AzEUuI6vw2CnqS1P+QTZgBQjyjfJdpc5eKaKT+lP6U\\/pT+tP6U1QYTWM8mYq96ahvXhqBIgfejS2\\/OEvOyainulhL1Ql\\/an9qZ596BhUmdTtgGhyV4jGwaWjrzV9O9AneLBDqFHBL1jAfLi9XnANcwIajAwInijz0VHV5zaZZZoS\\/RX0O9bCDVRypR3vA9dSjQvioqcso1qOuea6JEugEpaKwVGVHd+hnsfGVvVtTHmJcHs\\/AeS2ZQzFtgwAHEurGJTZ6c2Dxn5XjNog1CeaIOfRgoXqFPBRFWOWxxFw8lN5gcXDxq7Oz0PJndSPB\\/wBgJu9CSBpo5T0MkbFy8MD1ubBHS3NX8yaidjFeN1LIXvzslabx+hPOVzbKXHzQeiekr\\/7wf\\/\\/EACwQAQACAQMCBQUBAQEAAwAAAAEAESExQVFhcRAggaHwYJGxwdEw8eFwkKD\\/2gAIAQEAAT8Q\\/wDwzqBrD8B6xOgLLQWeUgrpFKC+PrlaImVjeW+VTKpWWuVSWlfDAAjhL8jVXO8E3a+Y4eq6kydcm59b60T60uXCUbqMPWVHHFdvEkNCKw3bDwMoDci3WAsDvx3ghGtFicj9a6Ih3JUrw0yR2LX3bmAWIw1UARHZ1MrxqO4MxWGdmX6eD6w1lt4lKDXB8iwwlXv5bqG0ksbGZ38tYLsntcVk1\\/Vy0QFXPSOlKvMEKRIQuw3gloSKGsRIK4iUXV\\/1BfA2uE0mcBUHmEuCCu+hev1UsFdvFsLfC6l8TFpURyjsxVbW3z3\\/AIEAMlsQb3KiOI3hZXcAjUdH41+qdDCHV5aleRYNwS+6NS0K4TOX7ODFeFYNfYG4MvPjXhXiKhGk0YdzQPp9cP8AEIcYea5jthbWsgdw3JlkvyXDihlAivIkwIyrmxzLQ7eKX9RWjetxBj7bMKCs2DMeR1YSR7fsiBk77g898v8AAkqBsSZXRpP39NLDbB6tRsirYsy56sYJSg4o5IRgQJ5lolR0dGyMoLoyh3wwGG4oIBBFAdlqAjBySmGjGZ3JB8Gp3lVqGsHa2EtabpWj0l7ldeE1kaRqZ+DrgymLG9twVRWbxjBdiAVmeUGOupIC27BLshldqfSHfBgrR6wYgWJY+ex55MxlkejFuoLLh6nb3Kd\\/pjB6YOTNpDd0VoXFz30GOZgibRrhrU\\/jzIqGk5YpJWcxFaR6SnxGTBNsAAZ+8DvbhIIssetNO8FqC9kbkvgpQU6w8J76vaHYOAMPdHb9asK17Ode0fpUUBR6EvwG\\/RGWxvlmdp6vg1WkejBtd3WPtEu6NKtO5BhU2pTvKWQ0CX9pS5o6QQSDK5OGX4EYD+jfZFwujuC5lMGdR+mHRCwhFcyvG6j91Sst1BPkWJyWlHeGfJURWTU4uHnD2PJCTXHvExqqL8scvrq4uE6CoCn1Qwetl8eib+Tv4XfglkAL20WH0lS9VCcSpHjWoy9FlIRS9N9Q18dM9D7QmKwLN4AKNPpjbWEmCPKYgA+VxDwYxiRQ7se8sqw8qkEQS60tN3FkauoY5MUcmGXLpo2JdSVqWsqWQ\\/LbxFdnLFhdAiVo9GNC6usDswdmaO24YN+BJUMiYSOH2ynXowOx6uNTWM6d4QQNieKTa2RxAJY3L6wb+kb8v2hNXv5nqhoOsRZMy7MDGh5itivGhEygOJwR83W4YldcYBLJFfAitlaxtzbTVZpljiXb0josBg8IuohVt6olPWt4qhDslK+zRIFvcIIltEd0\\/YuEL9vAARBkSLjbrZIRQVZl116jt0ivxMaQajGPOghZgb26\\/RwC3SVA3W4QRetE4YCCNnkYdQQAuLfnWmjUCMVd4otHv\\/hsnU\\/M2AoxhwVl2jRFqHBLq44ymCoVfbmCm0U44h4crBKleVqDKRIPGoKJhjNXUjBuNYECRgCoHrEDte6R8dBQ4SGnmrBbj9P0YAtaOYKJoonTtHZKtWGGA2JGlumbyFgCxL8Q4CtVqoaXGord\\/wBxutVrsECeexPx38KDKCRCxpSJZ8rtSK4pTsICBWxKEtkZ9gj3TQ+4MDsMB5SEoLYm\\/mSOw\\/W+bwQgrDInMAIljCpBLA1jGhKb8HaDUkWWxuUgUFO8281kWvouGSAGVZb\\/ADLexE4tLVm3gNIzabS9IOU3KNlxa7T4jVKvVTrEpVtf9tpSpbRujnkuOwE8EkoSQkm2Sr7RBBaqSWg\\/4xUDhHWuXmPdozQDgIssrIlxFI6oHIVib+QJyqtgmDpaQwz8v5YHFFHgCjwFwtYRhLRa+g+AoIiNjGuYKzrMSZbhp5nrMib\\/APMfoliTLcDr2ilVXdhL8hjwxMf7pnfQj3OEDWVH7RtOI\\/EGdd8DCIYgBCna1S3dh4tUYRh5YKC215HzInGuTGjFIZsoO2sPEKbO9KBdaj4X9AMEDWBIlnDyXEofm3UJXRi9D1l0wS6WE\\/Dun0S6xrhnXo\\/7MWpV8EDCR3tGMo2bQSw+5HVemRaEsTiekQafTInr9uI3+GVtGXSWP2niKS2Hm1JUkXIRrVnaJRVd4aZh20x1SmTwMMew9PJ8bpPiOXkDUTH7QzzCHv4KS0LTBsbpzKbto8hEQWtp1jQmYTH2gy92NodB3WGn0UTGP1IuRSI\\/5XAquAIPUe3RUHX3okBbc3AgreBAmACUcTWgnudA3ekyd42dMagxWCSSl8X1qf0hOM\\/VFcx4bQ+PRRKvNtYmCgWVG8NvA3nJe2BN5FbzbH8MGFTvYiyE3U\\/gipX9WL94YrqVHbDL56eD7mZgvdjUrFwEvl2hp4+zfhnxHLwDi1tQEUsQsTcg+xCY\\/k+BQMA\\/mXdw8idEGpdi4BqHsQomkOm2wVA+ihZTkg29QQiIo6+dahtitiZCcNGsQOWtZhNABsHksmN4Oa91slWazkvZG7F67VQ9C2NCZP8AA3QTkf47XeGIl1KnYmtclkO2iPBkQFq0AE2PWEKHqUVa6PSGc06H9S1k+sBcs6BA6vsond7n\\/lBxidAfvLWAaAH70nCdsN2vaBMgqGfRnDaWhIeHTN47T2r8M+M5eAgRVwza6fpQ0MAn2hjN3+aEGSLqLeMd93xFo6SzlGbjmACGh9GgeSMkIAocPOysNAhDJybYGEDQCB4V4BHa1KAgp7gKjkLr66Sgi6pautLoR1\\/2m1e8+W5JnF51SIyAvjEISqAC7ZUnqbBurSDD0R8fxAVoLZVTYhjmtaghS4z\\/AFCj9\\/8AkIZfg\\/8AMYwPz5YqexZ+4+VrhvZlAGyP8ootaWHszhQLKOHx+d0YvlbvF3xvCAnREHdit5VVYS0o2XHY2P4lx5fJVOC02SzMT6NdWibWYw8rQ6JewhElGYywIaeQQjjgtcBMofuD2v8ArSbcOwVtYastvwdBz+UhseYkeafeZ\\/crUjH3iZOcJx7tDFtFerbqSqnSv4w6Wn6Zhu6GuZQjqSjCunGuJTbK6D\\/uBvIsTC8Fwhv7QsatuXATBTgrUrGstlPj+CJLcY8luWYLp0sWYRi8lqHXDAgsXBs9BHNIYN6GDctbWP4Ya+Fl4y+N4QxPRh+0IoFuk1nH9wGk0APSF7+VS2JifdghVj9FhTMtZWJsqm2HixkNHIYCBIKaOV8DxaLdBzNVovo+V3ehGwk1ReBtXTHeKXPJm5cuXPl+SfHcypfOka\\/Fyy6zUVtK8sa2mj88HOHLXQw7WzcgyzQ9AMAcrsRqxpcI6K\\/UtQisXqWyutfwpGBe5UDGV2WDFB3\\/AIQdCJ2f5wSEu+K\\/vGsFKBjriWSvqinekl4TqgjsMO051X7jfpZxaMCLE1goIqmGGfCRDhindpEgaxHBxCWvLiZnnvJLjdWHmuocIlXesPoVdxANbRfwoOXR5lRVjmIaVGES4rSLVzwuCV5GlrrEA8ldOrAqHiqOH3egbwNKdFtqNBiLRBFJ6t4pbfL8ryT137JY5f0IdAAAZ7w7WulQerBOjTilZd2d3n7kdaYLdSzbEe9iaemlVfpMPYB18bbsFRVNcV3gUit0+AxVlo6wTdgqrQsvFk0hdmWZvIyWYHRfuKmKZ0sFAXNseKrqgX7zUSAXEbKCKaKiGY0F7R7wl06wDoDek4Z2h5nJoWMllqri4afQuVtXOwftDEC0UwV7kTUWaS\\/FDVqqGIU3YyEIeDDSKq3NdVbQzDGzPZbsdzl3iOgbEVW3zfK8kFrgdq3AI89dSgH3YpI8qUEDbPrJXhdCXL3e16ivsQqxmORWK3uoIxnUM6rqYXSaYI6Na5qEiA4F5tFcRRXC1CiBi02D7zrp\\/Y+XEMqoFYgrKHiQbg2sItfubpmAy4yhfLRFVhmu1A7WHPELkCwNjKRrjPSOpUFeYCYKpjwNfMJzmDzHCYChh9C5R23uH+JhFliYgGwCgh4XBHMaL9AQpJKIvUg7VVWPn+X5IQ0Euz2mlNmV070cOnQi\\/G1kd2CeslLQfK4RTDDyTCoO0o5K7OiShsP0FjT1CCNVQKrF48pE0FBO2X7j4EUlBqdG4qdjvUMAgiXuQoFJZA3zePVKmymiDGLjHT9vA8EIlu6ih2dCXhx1pDRP6GCSHaVipWlBC+hvgCL+\\/wDARbSgmNwbPAgMgGVXBGUFaRt+qavSLeOEcPAbEb\\/x+O5j4riCOYUfBh4PGzgy2n7UKqLw3uBRpKcUx2rqmGMJecLcfa5gIojGi9O00R9\\/4QBRV8NIsAvUv1NdHr\\/k\\/wC1go1bYprpUNMm0LAz1kIjHgH5ZpiL1Qr3g7mAaJtcN0TtasKgpFJwx7KQo6of7CwTMTjguAgSoEI+66mrtOjSDBDjk00QJRu00yVyi6IKHEIKgj6GqPD9r\\/f+CZYlwZqgo8CLckrSA0uOlVd3wf8AH4\\/knzXHge+C58fNGYyssGLTgIaAbEyyvjI4MxpdyZRbo0MQ3gRKNRxK78WIb1OpjadQvD0iLMgchQfYjCrtkMe8oVzfCexHGU1bvvP+cgOg+iVaB6RqW2GO8N6lEc6lb7sMAaZIftHcvCSyrXrtMT6zsgyfyF7PoMehyMLPrCgOcRK6PPJRoQZhJeAV3gaG\\/ALdXPRB4ntELgDQCax1AfSL4T0IfQ3zfH\\/AQS2jA8fiOI\\/5\\/Lck+a48H3wXPgLTiT238oT3UNgouOpEf0SK7NG0r0q4A4ZxoOJcQTt3vcweIBBTYcM9YE8x+HaCLQ7vbdD2JXaJqFfci1iaBK+9zH271KmksDLXSjRL7RSpLTM7QitLjMcd4xkEGvkjnzgeQvIYs9CpfIQN9OrMEYSqTTC667RVLXEzRCiIdiElKxMMImroFXK0gd+6A2ADBD6KZDlPtX687qY1BCK+6oePxHEf8\\/jeSfEceG74Lnx89o\\/Lw95Pj+I8PE721g6neLAeRRLi35Rk6fwmfdQutEqESRtkrEzyTG2c1NX6vL7kDJYomsADMB+eOP4RWIYq2LJYSJQ9YGTjLtg\\/RR9hvfV1+YqHnQXBOonfyuRmor1gllB+yHj8Rx\\/p8tyT4jjw3fBc+KHsn5eHvJ8fx4Sx70ZUVAGk50iWRKw0FqjTyk9o\\/CVPqj35Ha0vkeZf42sD7l7k\\/OwwL535ExiBF7NKREaZCKEXoOv0WdKqbJrukFVjyYUsCwYIePxHH+nz\\/JPmOPDd8Fz4fAcT2T8vD3pPl+PHWaotpYqUNQAEdJVicv8ACJB7UFSnwJ7J+Ex7+OsQhUCrMJmmItx+aM\\/iZIb6cXzfPkTCgVS8QWBhcDBGXRWe+LJX5uYP0WXgQaXzKGc+QXZB5PiuP9PnuYPzNo8MTVfK\\/Gj2D8ozBHQYF7AQRsMmCL\\/OhXsdIhFlTQEVvosRfM3wYA1SgIr2lWdwhm+xlJ9xAWAUa10HaMDxCmOodyE9i\\/CZW84EtaggSkGXxMwgQwfmhMR1vcnIC0qWMBwao\\/lCxJiEcVyeyFNWxA+pDUBHaPcnphisnos3CACOWV9FmMmF0bxTl5EF28HlEf8AP57knznEW66O+hv2hNwpi9fFj2190YQXi1VnZHmWADys5ggc9LPESDBqbdau6gtStuOzwxf7FYGX2FS6LdyraUzCKVdf\\/URuqUqnI3A7BK1GY9l+EGjzjqx+CHVIuqDLIFb5XDai6J3xLEqQlJxDOjlAHAejGJlmNXThmsjA7hdSEUGs5IdinTaKz6Ke2phbVjvIGr8BN\\/IKFrDyviOP8AuHXHcLGto1V92HvDVfhS\\/5CWG3r7RFrSrEpjaqlsGI1BYSUc6gZmLpn6lazqteza4IZCCobHGdYmfA+RAVCsOsQwBDo+pFwjAWKN+2kvN7x2jo1wZiu+kSkgL6TWgkKGbtE\\/e4eBGVRqyBr7TUuH4T3GB0EVF\\/pqLhXOpIPTT3YyjQS9yG04f5TTMAvWw0TVAowFGMVP04Jl2Op5DvTDxr6JSxGIYDq1sP15m2QX94ZmgPk+c48iLQXBzRoI3HhT74PeH4prUuS2ibkKVj8kQrOAm\\/sRQDZC72aCvvBlfsV99YlWa2v3CX0+ksVmX9fJGnxLNYbMXutx6L7JBXaGPQIKnuw306ogpQ30GJCtY0yMC0Za1yMMhE5Ks75rMW0mq3qzqqpJFfjwGguyKF0O4MhXNxaUxSetUfnP5nyT9weOW8DhLlsZq0LlVx5vo8TIo7Rt\\/WgrFZbxLJ3GvHg5gVBNkFbLJSkdW4Fqa9ZTbUWlCbekZ5ZqGTaYLGrcOXjWM0IFsjc+QfqLfI9onygqgBuqJn19Ui\\/o3CJQnNfkT6+ZBNm46mxdzyBaj\\/AIQ6p7N+EPbmxp6awmMZGP3UpMwatdOhiJyjEAe2Y6LCXkPvE9zWr+0RjrAqLCmGwVnZdYidei+7CQSHXvbaGcsIFMPvpLoxTnmAOjkWTF1tBTTkLwneEalahX5maMfBUPiCYSujfWaHMTiOR7wOnBYAbYhgdVUwg45IXWhHbNWxbb1yiffA37UGHFRQZh1TUltCQVV9ImJQwFsvKnufxNjwUEBxB6B1qLCWUhsnPBE8BRw5hnimWeEXT3c6GMD8\\/RuqoWOGxez5is3ATZsDpXkHhlWwq1f8hRhKGo43CfBdXiQH3+3feERM4aBXJoCNPpL8G6k43tqA\\/ApoBaqcwLipKUaZOXDDC3BDAKOVuNTS7WYhfS4PoODG4z7wW5QzscQ6DdmEub0Bf5hYoDCncraArILVfqChnKxbTmCs8a1\\/KKd1Nv7Q\\/UGoLZtleblJzFZY89Aj60tMM0s2uE7uY4DTWgGPvK8ooL4uJKVP\\/ePI+86k6zOszrM6zDCSoDVYSSHSA7iAcYC1vAgerARnWZ1mdZnWYlmWa9y\\/0\\/RtNWJHyMhEpp18prLRuyw6eLC43dYGnY1ly+mREDWj9zeCyTFb2CKlYO6Iqrb4pyaR2uo9yAhaEQtwdoDdKfoyhoHqiXR12hThS3gIym6UZ5ywhWYabqxunDT7RBVatVvK8nZtbtO9GvW7mVxfpAbgktANLXXvGsbvOaRfZY1xU3fBDZHiWoQXGx+8hgt+PysY6+UDlqHvAigK7SnEQiIJ1huhiCjV5TWfL6v0d6CTWrR0KPTzaUMISa7PGzWgXN1BGllL3zDx7xLc3cGtFZ6+XS7wigGj1LfzNHXECIAB0pK9D5cBKbYYhR3m\\/WIbHCnDqMVM\\/Y\\/2FNHsDZlXpccagwA6sXJVQLa8ql5kTRerEjLQjTd\\/kACg7Q4JY0lNABF9KuW67JDuIspI5mit6Ygf0+Wa0g7F\\/ePmV2ynAcsqHAsvPwswVZmVX0gVacPlDMCXfFvo7Lhjpu4fSn3Qb8rHtUwl+HMGzw90\\/EVOhraW2\\/ZjqMQq6lsz2JfGmV8Lmk7cm6CGKiXotAmZ6A7txRvBlGAak9YoLCg6ij+JcqBvdZX8KhwNL+Ir5QpVZlyIhNE4gaC1feLyvUFMLmblk4BtRX\\/hLPkk1ZxECrWEeyY3Q5heXaNuJ9apiqZjUgljcDgxEVBuwTzCdbeckRgO7XtABFBArnvGxB1LK+0HP2\\/xP+l\\/E\\/6X8Qu\\/d\\/EdLT+GkQ5D4cRdyWRAbNy\\/IK4kvIIMLjdCn2hDD+CH0dSUZ9Eq+8ewigw04TomezLYr8qiAHS4kHVh4Aq0So4\\/T62o00Rjumne6kaiWurKgBnU9rbfqCLQCZXco8vIVXf5lPKs0OozM+RZjzWveJRVrD\\/bAQrtQ3pFtXnwaqvsINr9oTIq0Lbobyr5\\/wAQWknEj16+YkPn6RNGAptiGGjhmIado\\/hDaEKALXBCJL6jOyT\\/AKkON95033gHRGWRJyCG2Flm5BBNe6dvWLuKZSJ4sILXQlWKUCn\\/AN\\/A+j6WJm4YF61j0I22uZXljInk0yRY9HC9occDC9GPrf4zRSPpq1Srm7bo\\/wDM0gPR\\/J+CI\\/qO+y6C2Nv50g8H3D+ygrd7\\/uP5\\/LlfvF9B7l+4pq3r\\/SMNb1Kbv7P8QCToOi8cRvT7r\\/JZWx87QWsZBM\\/af8BPTviNOEkjR2X9oGUdx2zKtX9yPPmPVOujEagsEsitxABQEYD4KwZXdRLhf3mppfeEBWcBLTUDU\\/eAXqwC2P8AwkNj9mBMyWCfKXrPmH7iNR+PMalqihVjeGDCBoh95UJTz\\/KKjmtF9KmR9HixOYHbKDzEqm0rioNY99vB6NjMUdGNjSVGV4VKzElZiQGUyo+Fqw1CGFXVYcGYNMCAOFg8LKYhycpXG4PtoIzOUjuCXlNLJwWeYYU75JfD9qV7noiTs7EARAOmiJYJg+WTUhKlSpUr6S4DT51DNSukZyi03PBBl4yLZk5I4S0gY0NF3uU\\/+0t\\/2gUrRCXdCHCE06oN\\/rPiss4IIejcLdzIGD1ingcWzH\\/vTH\\/aFv8AaXtvvR\\/60BzChoxGJf6T\\/gMEf1sCq\\/RGXRRutUwIhbhY5ezFwDqONDBKRP8Avw3\\/AHYHcNIMYqdfpg6vO+zbnuen+A519VwyvkMtVxCWaeAOJcOTOAYOlXaN+FbYFhaxDYKEDcfTmPIJotaQkASg8B+B5G8AENY3ZAfwhe8L6QhV8xAGnQ3iOkFyhdlQyU7UtLdIZucD0lObUg3jwaGC4U\\/M2aSiPSVdkHaEu8IcXgu8PUGoDcbNlWrl3CATF2mobgH0vQDm9w9dfcI5RSIUjx\\/gXNZEagJx4DojJJvaSXZiGJ31mPc+GfcRDxjsBCF1PkufA33vgL2WViavgH7iEKH2UcbI\\/wDrYQJbdG46p4flm0oKUKljcXAWKuOWMSRRU01Cd0rapcnpMnDFL+d1MZoiNtwnNFe3faCbmLH0xrnGFqadjo9c7\\/44rEAim41Kp\\/cEU9\\/mkP3sJ75EIKAtjYEYSVg6Vkwv5\\/mFR6XOfJczLtomGakDSDhevMJMGVmK11IUMXqj2S3oPywMQ7y2DaYbneYMzNm0YrmBmBUyfYRIGrtdcwuNqU6VUsAq26Nor1JBgJ7QvvAuC\\/ph8gDrEwjF9FFGepvJ7mef8rs3BCkEOZONY21RFVZlS\\/AVuoMbqB6ILS0kmy5yiwVGaohcsNEP\\/VgblJllzpU3T+auWI1y6rPhUYgMLjhU7VVcwStBehcACM1a4zKTQJqs2w0gE1Sg3lpLIpqxVKRL+JycRY9Z4Li+mYui9wRToju6aS\\/fQBQjwOMpBV6xg2uSH0xW+uE7JNkllwMM6Mfs2f8AH2\\/8zD59JyGqU9ZTwxM6e0B4ZcN5wXodMHQ5sKicw8oOgRkHBpwhvvH5jbtK4S1lC5m\\/ucvk1nef+ILA6sB0idev5gFCEeuIKEOp0lRlI52OsoMqN6P8yqqyFh3\\/AJluJpJ\\/9Jl2yaPpkocwZfK6jub\\/AGZoyC+yTcYGK7dIIv75JadaWkGHjQOo2QIYUtcQVdXmVureJJZ0uBZbnGXAK2n0SUC2OQYo2s5qNUluUSnao4wlsqFH3lJQkEtfgdIBr9iFt4Snr2JfD+jBBUXc3BNF7wN4IOdhZoCpcCdU7jiVWFIXYZ0EfUdAGmb0OyGsOmxBcxkwqq2jn8d\\/JQx8jpDoyNiCyMSrgh9NXblTZdzqtyUofVS50\\/QCJ+cjKMwK3XjwfHPudGp\\/30\\/7yf8AeR\\/9pMf7k9zJmDGLb7EDoI74tavWG3WZHsrUdFR1QqomgFFI7OVLfaF2YNaDUCDlF1HEB\\/ojT+5MlS7WiSHoHMsanObRBaAJXhXgqVKlfTtSo4gtC4KRKj4p4NPCpUrwuHgxq9tYMBulECHDABCGUAjswGAi2NWHTA4piM0Dwg3xABpGXAu00gAo0h9T5o1Ar73hUfBi0ZmNwIKws0aOGczEoZRKJUqWoWAMLAB08iRKyuKZI6wRrxAlArU0gcQ+qF6bQ2ug37EsICN5HxdfFi9jeEFa1TWdZXuU9xhCLcqsG0SmnWHlrb0x23T5qJR9V5OjOqPe7me+ky8OlkOdztrz4sJSWJNgrEHC9UHibUVZIPUJb6Sq8rQ8AfzHZ5P1nvR\\/A79HrH9ynAd7Xs\\/dikfpAO4x1igbVDuw6zG\\/IyuvtbXECg6nioRHUEMCtA4nUkfj61wNBWl2TJ20lI+zeE6Onsektz+YZwjCgoKryMDoVFQvbU7CROj0Il6RG6sOhFzP9JRHgq6zNt0W+txDRwIyesrzV5r9WGZw6WLIEbDDaIM2IDHnEACgD\\/4AqVK\\/+17\\/\\/gADAP\\/Z\"}', '2026-01-14 19:16:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_vacaciones`
--

CREATE TABLE `solicitudes_vacaciones` (
  `Id_Solicitud` int(11) NOT NULL,
  `Id_Trabajador` int(11) NOT NULL,
  `Fecha_Solicitud` date NOT NULL,
  `Fecha_Inicio_Vacaciones` date NOT NULL,
  `Estado` enum('Pendiente','Aceptada','Rechazada') DEFAULT 'Pendiente',
  `Fecha_Respuesta` date DEFAULT NULL,
  `Observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_vacaciones`
--

INSERT INTO `solicitudes_vacaciones` (`Id_Solicitud`, `Id_Trabajador`, `Fecha_Solicitud`, `Fecha_Inicio_Vacaciones`, `Estado`, `Fecha_Respuesta`, `Observaciones`) VALUES
(1, 12, '2026-01-24', '2026-01-26', 'Rechazada', '2026-01-24', NULL),
(2, 12, '2026-01-24', '2026-01-31', 'Aceptada', '2026-01-24', NULL),
(3, 11, '2026-01-27', '2026-01-30', 'Aceptada', '2026-01-27', NULL),
(4, 1, '2026-03-12', '2026-03-15', 'Rechazada', '2026-03-12', NULL),
(5, 1, '2026-03-20', '2026-03-25', 'Aceptada', '2026-03-20', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_nomina`
--

CREATE TABLE `tipo_nomina` (
  `Id_Tipo_Nomina` int(11) NOT NULL,
  `Frecuencia` varchar(50) NOT NULL,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Fin` date NOT NULL,
  `Estado` varchar(255) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_nomina`
--

INSERT INTO `tipo_nomina` (`Id_Tipo_Nomina`, `Frecuencia`, `Fecha_Inicio`, `Fecha_Fin`, `Estado`) VALUES
(1, 'Semanal', '0000-00-00', '0000-00-00', 'Activo'),
(2, 'Quincenal', '0000-00-00', '0000-00-00', 'Activo'),
(3, 'Mensual', '0000-00-00', '0000-00-00', 'Activo'),
(4, 'Mixta', '0000-00-00', '0000-00-00', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajador`
--

CREATE TABLE `trabajador` (
  `Id_Trabajador` int(11) NOT NULL,
  `Id_Cargo` int(11) NOT NULL,
  `Id_Nivel_Educativo` int(11) NOT NULL,
  `Id_Contacto_Emergencia` int(11) DEFAULT NULL,
  `Nombre_Completo` varchar(150) NOT NULL,
  `Apellidos` varchar(150) NOT NULL,
  `Fecha_Nacimiento` date DEFAULT NULL,
  `Genero` char(1) DEFAULT NULL,
  `Documento_Identidad` varchar(50) NOT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Telefono_Movil` varchar(20) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `Estado_Civil` varchar(50) DEFAULT NULL,
  `Ingreso_Anterior` varchar(255) DEFAULT NULL,
  `Fecha_de_Ingreso` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `trabajador`
--

INSERT INTO `trabajador` (`Id_Trabajador`, `Id_Cargo`, `Id_Nivel_Educativo`, `Id_Contacto_Emergencia`, `Nombre_Completo`, `Apellidos`, `Fecha_Nacimiento`, `Genero`, `Documento_Identidad`, `Correo`, `Telefono_Movil`, `Direccion`, `Estado_Civil`, `Ingreso_Anterior`, `Fecha_de_Ingreso`) VALUES
(1, 7, 2, NULL, 'Kelvis Arturo', 'Gomez Macero', '2006-10-30', 'M', 'V-31710465', 'Kelvis@gmail.com', '0412-3143674', 'Complejo Habitacional', 'Soltero', '', '2020-04-05'),
(9, 1, 2, NULL, 'Kelvis', 'Gomez', '2006-10-30', 'M', 'V-31710466', 'Kelvis1@gmail.com', '0412-1234567', '0', 'Soltero', NULL, '2026-01-11'),
(11, 9, 2, NULL, 'Adrian', 'Gonzalez', '2004-05-20', 'M', 'V-31215637', NULL, '0412-3948848', NULL, 'Soltero', NULL, '2024-05-20'),
(12, 8, 1, NULL, 'Yorkaris', 'Rojas', '2006-07-16', 'F', 'V-31623405', NULL, NULL, NULL, 'Casado', NULL, '2025-01-20'),
(13, 9, 1, NULL, 'Daniel', 'Lara', '2006-05-30', 'M', 'V-12323242', 'Daniel@gmail.com', '0412-5461654', NULL, 'Soltero/a', NULL, '2026-03-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'trabajador',
  `Id_Trabajador` int(11) DEFAULT NULL,
  `Estado` varchar(255) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`, `role`, `Id_Trabajador`, `Estado`) VALUES
(1, 'superadmin', NULL, 'superadmin@example.com', NULL, '$2y$10$KKg4ZXtk.D3zR7p8pnwO/.k3fg9WpT1cIaPyDb7xGHI6qrF5dXhya', NULL, NULL, NULL, NULL, '2026-01-12 00:30:47', NULL, 'SuperUsuario', NULL, 'Activo'),
(2, 'Kelvis_1', NULL, 'Kelvis@gmail.com', NULL, '$2y$10$DtJUrMWrku74DWikPdO4x.0v13fACS5q7/q5NAzqKI7YfGRC88uqG', NULL, NULL, NULL, NULL, '2026-01-12 00:50:20', NULL, 'Trabajador', 1, 'Activo'),
(3, 'Kelvis_2', NULL, 'Kelvis1@gmail.com', NULL, '$2y$10$W3GdARGPNlESDF5flpxHx.g5QN8TGfJPMYDWMZerbIWw.OUbbLW3y', NULL, NULL, NULL, NULL, '2026-01-19 21:56:31', NULL, 'Administrativo', 9, 'Activo'),
(4, 'Yorkaris', NULL, 'Yorkaris@gmail.com', NULL, '$2y$10$/c6fZLHpmPVCbypfwZM1q.xTHoTJWsl8zKwLacJScgqnJDLjptKQC', NULL, NULL, NULL, NULL, '2026-01-25 00:29:10', NULL, 'Trabajador', 12, 'Activo'),
(5, 'Adrian_1', NULL, 'Adrian@gmail.com', NULL, '$2y$10$mD9vpx8RblMKiFKuu5eso./vYFWeU/zlKyNCqXdsXDjxYNWlq1rbW', NULL, NULL, NULL, NULL, '2026-01-26 23:18:15', NULL, 'Trabajador', 11, 'Activo'),
(6, 'Kelvis_31', NULL, 'Kelvis31@gmail.com', NULL, '$2y$10$I8oMgEubzMrZ2y9o7z9L9evHcIWNdJwcdvZsR.//p5Z4bKwWrJsmm', NULL, NULL, NULL, NULL, '2026-01-29 02:22:05', NULL, 'Trabajador', NULL, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id_Usuario` int(11) NOT NULL,
  `Id_rol` int(11) NOT NULL,
  `Nombre_usuario` varchar(50) NOT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Fecha_creación` datetime DEFAULT current_timestamp(),
  `Id_Trabajador` int(11) DEFAULT NULL,
  `Estado` varchar(20) DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Id_Usuario`, `Id_rol`, `Nombre_usuario`, `Correo`, `Contraseña`, `Fecha_creación`, `Id_Trabajador`, `Estado`) VALUES
(7, 3, 'superadmin', 'superadmin@example.com', '$2y$10$KKg4ZXtk.D3zR7p8pnwO/.k3fg9WpT1cIaPyDb7xGHI6qrF5dXhya', '2026-01-11 20:30:47', NULL, 'Activo'),
(8, 2, 'Kelvis_1', 'Kelvis@gmail.com', '$2y$10$DtJUrMWrku74DWikPdO4x.0v13fACS5q7/q5NAzqKI7YfGRC88uqG', '2026-01-11 20:50:20', 1, 'Activo'),
(10, 1, 'Kelvis_2', 'Kelvis1@gmail.com', '$2y$10$W3GdARGPNlESDF5flpxHx.g5QN8TGfJPMYDWMZerbIWw.OUbbLW3y', '2026-01-19 17:56:31', 9, 'Activo'),
(11, 2, 'Yorkaris', 'Yorkaris@gmail.com', '$2y$10$/c6fZLHpmPVCbypfwZM1q.xTHoTJWsl8zKwLacJScgqnJDLjptKQC', '2026-01-24 20:29:10', 12, 'Activo'),
(12, 2, 'Adrian_1', 'Adrian@gmail.com', '$2y$10$mD9vpx8RblMKiFKuu5eso./vYFWeU/zlKyNCqXdsXDjxYNWlq1rbW', '2026-01-26 19:18:15', 11, 'Activo'),
(13, 2, 'Kelvis_31', 'Kelvis31@gmail.com', '$2y$10$I8oMgEubzMrZ2y9o7z9L9evHcIWNdJwcdvZsR.//p5Z4bKwWrJsmm', '2026-01-28 22:22:05', NULL, 'Inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacations`
--

CREATE TABLE `vacations` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `requested_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD PRIMARY KEY (`Id_Asignacion`),
  ADD KEY `Id_Concepto` (`Id_Concepto`);

--
-- Indices de la tabla `bonificaciones`
--
ALTER TABLE `bonificaciones`
  ADD PRIMARY KEY (`Id_Bonificacion`),
  ADD KEY `Id_Concepto` (`Id_Concepto`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`Id_Cargo`),
  ADD UNIQUE KEY `Nombre_profesión` (`Nombre_profesión`);

--
-- Indices de la tabla `concepto`
--
ALTER TABLE `concepto`
  ADD PRIMARY KEY (`Id_Concepto`),
  ADD UNIQUE KEY `Nombre_Concepto` (`Nombre_Concepto`),
  ADD UNIQUE KEY `Codigo` (`Codigo`);

--
-- Indices de la tabla `contacto_emergencia`
--
ALTER TABLE `contacto_emergencia`
  ADD PRIMARY KEY (`Id_Contacto_Emergencia`);

--
-- Indices de la tabla `contrato_trabajadores`
--
ALTER TABLE `contrato_trabajadores`
  ADD PRIMARY KEY (`Id_registro`),
  ADD KEY `Id_Trabajador` (`Id_Trabajador`),
  ADD KEY `Id_Tipo_Nomina` (`Id_Tipo_Nomina`);

--
-- Indices de la tabla `deducciones`
--
ALTER TABLE `deducciones`
  ADD PRIMARY KEY (`Id_Deduccion`),
  ADD KEY `Id_Concepto` (`Id_Concepto`);

--
-- Indices de la tabla `detalle_recibo_asignacion`
--
ALTER TABLE `detalle_recibo_asignacion`
  ADD PRIMARY KEY (`Id_Recibo_Pago`,`Id_Asignacion`),
  ADD KEY `Id_Asignacion` (`Id_Asignacion`);

--
-- Indices de la tabla `detalle_recibo_bonificacion`
--
ALTER TABLE `detalle_recibo_bonificacion`
  ADD PRIMARY KEY (`Id_Recibo_Pago`,`Id_Bonificacion`),
  ADD KEY `Id_Bonificacion` (`Id_Bonificacion`);

--
-- Indices de la tabla `detalle_recibo_deduccion`
--
ALTER TABLE `detalle_recibo_deduccion`
  ADD PRIMARY KEY (`Id_Recibo_Pago`,`Id_Deduccion`),
  ADD KEY `Id_Deduccion` (`Id_Deduccion`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_reserved_at_available_at_index` (`queue`,`reserved_at`,`available_at`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `nivel_educativo`
--
ALTER TABLE `nivel_educativo`
  ADD PRIMARY KEY (`Id_Nivel_Educativo`),
  ADD UNIQUE KEY `Nombre_Nivel` (`Nombre_Nivel`);

--
-- Indices de la tabla `novedades`
--
ALTER TABLE `novedades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `payslips`
--
ALTER TABLE `payslips`
  ADD PRIMARY KEY (`Id_Payslip`);

--
-- Indices de la tabla `recibo_pago`
--
ALTER TABLE `recibo_pago`
  ADD PRIMARY KEY (`Id_Recibo_Pago`),
  ADD KEY `Id_Tipo_Nomina` (`Id_Tipo_Nomina`),
  ADD KEY `Id_Trabajador` (`Id_Trabajador`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`Id_rol`),
  ADD UNIQUE KEY `Nombre_rol` (`Nombre_rol`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`skey`);

--
-- Indices de la tabla `solicitudes_vacaciones`
--
ALTER TABLE `solicitudes_vacaciones`
  ADD PRIMARY KEY (`Id_Solicitud`),
  ADD KEY `Id_Trabajador` (`Id_Trabajador`);

--
-- Indices de la tabla `tipo_nomina`
--
ALTER TABLE `tipo_nomina`
  ADD PRIMARY KEY (`Id_Tipo_Nomina`);

--
-- Indices de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  ADD PRIMARY KEY (`Id_Trabajador`),
  ADD UNIQUE KEY `Documento_Identidad` (`Documento_Identidad`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD KEY `Id_Profesion` (`Id_Cargo`),
  ADD KEY `Id_Nivel_Educativo` (`Id_Nivel_Educativo`),
  ADD KEY `Id_Contacto_Emergencia` (`Id_Contacto_Emergencia`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id_Usuario`),
  ADD UNIQUE KEY `Nombre_usuario` (`Nombre_usuario`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD KEY `Id_rol` (`Id_rol`),
  ADD KEY `fk_usuario_trabajador` (`Id_Trabajador`);

--
-- Indices de la tabla `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  MODIFY `Id_Asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `bonificaciones`
--
ALTER TABLE `bonificaciones`
  MODIFY `Id_Bonificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cargo`
--
ALTER TABLE `cargo`
  MODIFY `Id_Cargo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `concepto`
--
ALTER TABLE `concepto`
  MODIFY `Id_Concepto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `contacto_emergencia`
--
ALTER TABLE `contacto_emergencia`
  MODIFY `Id_Contacto_Emergencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `contrato_trabajadores`
--
ALTER TABLE `contrato_trabajadores`
  MODIFY `Id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `deducciones`
--
ALTER TABLE `deducciones`
  MODIFY `Id_Deduccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `nivel_educativo`
--
ALTER TABLE `nivel_educativo`
  MODIFY `Id_Nivel_Educativo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `novedades`
--
ALTER TABLE `novedades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `payslips`
--
ALTER TABLE `payslips`
  MODIFY `Id_Payslip` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `recibo_pago`
--
ALTER TABLE `recibo_pago`
  MODIFY `Id_Recibo_Pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `Id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `solicitudes_vacaciones`
--
ALTER TABLE `solicitudes_vacaciones`
  MODIFY `Id_Solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipo_nomina`
--
ALTER TABLE `tipo_nomina`
  MODIFY `Id_Tipo_Nomina` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  MODIFY `Id_Trabajador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `vacations`
--
ALTER TABLE `vacations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD CONSTRAINT `asignaciones_ibfk_1` FOREIGN KEY (`Id_Concepto`) REFERENCES `concepto` (`Id_Concepto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `bonificaciones`
--
ALTER TABLE `bonificaciones`
  ADD CONSTRAINT `bonificaciones_ibfk_1` FOREIGN KEY (`Id_Concepto`) REFERENCES `concepto` (`Id_Concepto`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `contrato_trabajadores`
--
ALTER TABLE `contrato_trabajadores`
  ADD CONSTRAINT `contrato_trabajadores_ibfk_1` FOREIGN KEY (`Id_Trabajador`) REFERENCES `trabajador` (`Id_Trabajador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contrato_trabajadores_ibfk_2` FOREIGN KEY (`Id_Tipo_Nomina`) REFERENCES `tipo_nomina` (`Id_Tipo_Nomina`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `deducciones`
--
ALTER TABLE `deducciones`
  ADD CONSTRAINT `deducciones_ibfk_1` FOREIGN KEY (`Id_Concepto`) REFERENCES `concepto` (`Id_Concepto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_recibo_asignacion`
--
ALTER TABLE `detalle_recibo_asignacion`
  ADD CONSTRAINT `detalle_recibo_asignacion_ibfk_1` FOREIGN KEY (`Id_Recibo_Pago`) REFERENCES `recibo_pago` (`Id_Recibo_Pago`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_recibo_asignacion_ibfk_2` FOREIGN KEY (`Id_Asignacion`) REFERENCES `asignaciones` (`Id_Asignacion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_recibo_bonificacion`
--
ALTER TABLE `detalle_recibo_bonificacion`
  ADD CONSTRAINT `detalle_recibo_bonificacion_ibfk_1` FOREIGN KEY (`Id_Recibo_Pago`) REFERENCES `recibo_pago` (`Id_Recibo_Pago`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_recibo_bonificacion_ibfk_2` FOREIGN KEY (`Id_Bonificacion`) REFERENCES `bonificaciones` (`Id_Bonificacion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_recibo_deduccion`
--
ALTER TABLE `detalle_recibo_deduccion`
  ADD CONSTRAINT `detalle_recibo_deduccion_ibfk_1` FOREIGN KEY (`Id_Recibo_Pago`) REFERENCES `recibo_pago` (`Id_Recibo_Pago`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_recibo_deduccion_ibfk_2` FOREIGN KEY (`Id_Deduccion`) REFERENCES `deducciones` (`Id_Deduccion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `recibo_pago`
--
ALTER TABLE `recibo_pago`
  ADD CONSTRAINT `recibo_pago_ibfk_1` FOREIGN KEY (`Id_Tipo_Nomina`) REFERENCES `tipo_nomina` (`Id_Tipo_Nomina`) ON UPDATE CASCADE,
  ADD CONSTRAINT `recibo_pago_ibfk_2` FOREIGN KEY (`Id_Trabajador`) REFERENCES `trabajador` (`Id_Trabajador`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `solicitudes_vacaciones`
--
ALTER TABLE `solicitudes_vacaciones`
  ADD CONSTRAINT `solicitudes_vacaciones_ibfk_1` FOREIGN KEY (`Id_Trabajador`) REFERENCES `trabajador` (`Id_Trabajador`);

--
-- Filtros para la tabla `trabajador`
--
ALTER TABLE `trabajador`
  ADD CONSTRAINT `trabajador_ibfk_1` FOREIGN KEY (`Id_Cargo`) REFERENCES `cargo` (`Id_Cargo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `trabajador_ibfk_2` FOREIGN KEY (`Id_Nivel_Educativo`) REFERENCES `nivel_educativo` (`Id_Nivel_Educativo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `trabajador_ibfk_3` FOREIGN KEY (`Id_Contacto_Emergencia`) REFERENCES `contacto_emergencia` (`Id_Contacto_Emergencia`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_trabajador` FOREIGN KEY (`Id_Trabajador`) REFERENCES `trabajador` (`Id_Trabajador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Id_rol`) REFERENCES `roles` (`Id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
