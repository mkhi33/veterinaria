USE [master]
GO
/****** Object:  Database [veterinaria]    Script Date: 26/11/2023 18:25:40 ******/
CREATE DATABASE [veterinaria]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'empleado_crud', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\empleado_crud.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'empleado_crud_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\empleado_crud_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [veterinaria] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [veterinaria].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [veterinaria] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [veterinaria] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [veterinaria] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [veterinaria] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [veterinaria] SET ARITHABORT OFF 
GO
ALTER DATABASE [veterinaria] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [veterinaria] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [veterinaria] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [veterinaria] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [veterinaria] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [veterinaria] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [veterinaria] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [veterinaria] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [veterinaria] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [veterinaria] SET  DISABLE_BROKER 
GO
ALTER DATABASE [veterinaria] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [veterinaria] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [veterinaria] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [veterinaria] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [veterinaria] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [veterinaria] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [veterinaria] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [veterinaria] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [veterinaria] SET  MULTI_USER 
GO
ALTER DATABASE [veterinaria] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [veterinaria] SET DB_CHAINING OFF 
GO
ALTER DATABASE [veterinaria] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [veterinaria] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [veterinaria] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [veterinaria] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [veterinaria] SET QUERY_STORE = OFF
GO
USE [veterinaria]
GO
/****** Object:  Table [dbo].[analisis_laboratorio]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[analisis_laboratorio](
	[id_analisis_lab] [int] NULL,
	[nombre] [varchar](50) NULL,
	[codigo_analisis] [int] NULL,
	[fecha_solicitud] [date] NULL,
	[tipo_analisis] [varchar](50) NULL,
	[fecha_resultado] [date] NULL,
	[id_mascota] [int] NULL,
	[id_veterinario] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cita]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cita](
	[id_cita] [int] NULL,
	[fecha_cita] [date] NULL,
	[estado_cita] [varchar](50) NULL,
	[id_cliente] [int] NULL,
	[id_empleado] [int] NULL,
	[id_servicio] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cliente]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cliente](
	[id_cliente] [int] NOT NULL,
	[nombre] [varchar](50) NULL,
	[apellido] [varchar](50) NULL,
	[fecha_nacimiento] [date] NULL,
	[genero] [char](10) NULL,
	[telefono] [varchar](50) NULL,
	[correo] [varchar](50) NULL,
	[direccion] [varchar](50) NULL,
	[id_mascota] [int] NULL,
 CONSTRAINT [PK_cliente] PRIMARY KEY CLUSTERED 
(
	[id_cliente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[compra]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[compra](
	[id_pedido] [int] NULL,
	[numero_pedido] [varchar](50) NULL,
	[fecha_pedido] [date] NULL,
	[fecha_recibido] [date] NULL,
	[estado_pedido] [varchar](50) NULL,
	[estado_pago] [varchar](50) NULL,
	[descuento] [decimal](18, 0) NULL,
	[cai] [varchar](50) NULL,
	[sub_total] [decimal](18, 0) NULL,
	[total] [decimal](18, 0) NULL,
	[id_empleado] [int] NULL,
	[id_metodo_pago] [int] NULL,
	[id_impuesto] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[detalle_medicamento]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[detalle_medicamento](
	[id_detalle_medicamento] [int] NULL,
	[precio_unitario] [decimal](18, 0) NULL,
	[cantidad] [int] NULL,
	[id_medicamento] [int] NULL,
	[id_promocion_descuento] [int] NULL,
	[id_factura] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[detalle_pedido_medicamento]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[detalle_pedido_medicamento](
	[id_detalle_pedido_medic] [int] NULL,
	[cantidad] [int] NULL,
	[precio_unitario] [decimal](18, 0) NULL,
	[descripcion] [varchar](100) NULL,
	[id_medicamento] [int] NULL,
	[id_pedido] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[detalle_pedido_producto]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[detalle_pedido_producto](
	[id_detalle_pedido_producto] [int] NULL,
	[cantidad] [int] NULL,
	[precio_unitario] [decimal](18, 0) NULL,
	[descripcion] [varchar](255) NULL,
	[id_pedido] [int] NULL,
	[id_producto] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[detalle_producto]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[detalle_producto](
	[id_detalle_producto] [int] NULL,
	[cantidad] [int] NULL,
	[precio_unitario] [decimal](18, 0) NULL,
	[id_pro_desc] [int] NULL,
	[id_producto] [int] NULL,
	[id_factura] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[detalle_servicio]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[detalle_servicio](
	[id_detalle_servicio] [int] NULL,
	[precio_unitario] [decimal](18, 0) NULL,
	[id_servicio] [int] NULL,
	[id_pro_desc] [int] NULL,
	[id_factura] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[detalle_vacuna]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[detalle_vacuna](
	[id_detalle_vacuna] [int] NULL,
	[fecha_administracion] [date] NULL,
	[proxima_dosis] [date] NULL,
	[dosis_administrada] [varchar](50) NULL,
	[id_historial_medico] [int] NULL,
	[id_vacuna] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empleado]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[empleado](
	[id_empleado] [int] NOT NULL,
	[nombre] [varchar](100) NULL,
	[apellido] [int] NULL,
	[fecha_nacimiento] [date] NULL,
	[direccion] [varchar](100) NULL,
	[fecha_contrato] [date] NULL,
	[numero_contrato] [int] NULL,
	[genero] [varchar](50) NULL,
	[salario] [decimal](18, 0) NULL,
	[estado_civil] [varchar](20) NULL,
	[foto] [image] NULL,
	[ihss] [nvarchar](50) NULL,
	[id_tipo_empleado] [int] NULL,
	[id_horario_lab] [int] NULL,
 CONSTRAINT [PK_empleado] PRIMARY KEY CLUSTERED 
(
	[id_empleado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[empresa_encabezado]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[empresa_encabezado](
	[id_empresa_encabezado] [int] NULL,
	[nombre_empresa] [varchar](50) NULL,
	[telefono] [varchar](50) NULL,
	[correo] [varchar](50) NULL,
	[direccion] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[factura]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[factura](
	[id_factura] [int] NULL,
	[numero_factura] [varchar](100) NULL,
	[fecha_emision] [date] NULL,
	[descuento] [decimal](18, 0) NULL,
	[rtn] [varchar](50) NULL,
	[cai] [varchar](50) NULL,
	[sub_total] [decimal](18, 0) NULL,
	[total] [decimal](18, 0) NULL,
	[id_cliente] [int] NULL,
	[id_empleado] [int] NULL,
	[id_metodo_pago] [int] NULL,
	[id_impuesto] [int] NULL,
	[id_empresa_encabezado] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[farmaceutica]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[farmaceutica](
	[id_farmaceutica] [int] NULL,
	[nombre] [varchar](50) NULL,
	[telefono] [varchar](50) NULL,
	[correo] [varchar](50) NULL,
	[direccion] [varchar](50) NULL,
	[acreditaciones] [varchar](50) NULL,
	[id_pedido] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[historial_medico]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[historial_medico](
	[id_historial_medico] [int] NULL,
	[fecha_registro] [date] NULL,
	[diagnostico] [varchar](255) NULL,
	[id_veterinario] [int] NULL,
	[id_resultado_analisis] [int] NULL,
	[id_receta] [int] NULL,
	[id_vacuna] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[historico_impuesto]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[historico_impuesto](
	[id_historico_impuesto] [int] NULL,
	[nuevo_porcentaje] [decimal](18, 0) NULL,
	[fecha_cambio] [date] NULL,
	[motivo_cambio] [varchar](50) NULL,
	[id_impuesto] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[historico_precio]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[historico_precio](
	[id_historico_precio] [int] NOT NULL,
	[id_servicio] [int] NULL,
	[id_medicamento] [int] NULL,
	[id_producto] [int] NULL,
	[precio_anterior] [decimal](18, 0) NULL,
	[nuevo_precio] [decimal](18, 0) NULL,
	[fecha_cambio] [date] NULL,
	[motivo_cambio] [varchar](100) NULL,
 CONSTRAINT [PK_historico_precio] PRIMARY KEY CLUSTERED 
(
	[id_historico_precio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[horario_laboral]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[horario_laboral](
	[id_horario_lab] [int] NULL,
	[hora_inicio] [time](7) NULL,
	[hora_fin] [time](7) NULL,
	[dia_semana] [varchar](10) NULL,
	[duracion] [varchar](50) NULL,
	[jornada] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[impuesto]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[impuesto](
	[id_impuesto] [int] NULL,
	[nombre_impuesto] [varchar](50) NULL,
	[porcentaje_impuesto] [decimal](18, 0) NULL,
	[descripcion] [varchar](50) NULL,
	[fecha_vigencia] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[inventario]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[inventario](
	[id_inventario] [int] NULL,
	[stock] [int] NULL,
	[fecha_vencimiento] [date] NULL,
	[fecha_ingreso] [date] NULL,
	[precio_unitario] [decimal](18, 0) NULL,
	[precio_compra] [decimal](18, 0) NULL,
	[cantidad_max_stock] [int] NULL,
	[cantidad_min_stock] [int] NULL,
	[id_proveedor] [int] NULL,
	[foto] [image] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mascota]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mascota](
	[id_mascota] [int] NULL,
	[nombre] [varchar](50) NULL,
	[raza] [varchar](50) NULL,
	[especie] [varchar](50) NULL,
	[genero] [varchar](2) NULL,
	[peso] [varchar](10) NULL,
	[fecha_nacimiento] [date] NULL,
	[id_historial_medico] [int] NULL,
	[id_vacuna] [int] NULL,
	[foto] [image] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[medicamento]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[medicamento](
	[id_medicamento] [int] NULL,
	[nombre] [varchar](50) NULL,
	[descripcion] [varchar](50) NULL,
	[fecha_vencimiento] [date] NULL,
	[stock] [int] NULL,
	[precio] [decimal](18, 0) NULL,
	[indicaciones] [varchar](100) NULL,
	[categoria] [varchar](50) NULL,
	[efectos_secundarios] [varchar](50) NULL,
	[unidad_medida] [varchar](15) NULL,
	[id_farmaceutica] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[metodo_pago]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[metodo_pago](
	[id_metodo_pago] [int] NULL,
	[nombre] [varchar](50) NULL,
	[descripcion] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[producto]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[producto](
	[id_producto] [int] NULL,
	[nombre] [varchar](50) NULL,
	[descripcion] [varchar](100) NULL,
	[fecha_vencimiento] [date] NULL,
	[stock] [int] NULL,
	[categoria] [varchar](20) NULL,
	[precio] [decimal](18, 0) NULL,
	[unidad_medida] [varchar](15) NULL,
	[id_proveedor] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[promocion_descuento]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[promocion_descuento](
	[id_pro_desc] [int] NULL,
	[nombre] [varchar](50) NULL,
	[porcentaje] [decimal](18, 0) NULL,
	[fecha_inicio] [date] NULL,
	[promocion_descuento] [char](2) NULL,
	[fecha_final] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[proveedor]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[proveedor](
	[id_proveedor] [int] NULL,
	[nombre] [varchar](50) NULL,
	[apellido] [varchar](50) NULL,
	[nombre_empresa] [varchar](50) NULL,
	[telefono] [varchar](50) NULL,
	[correo] [varchar](50) NULL,
	[direccion] [varchar](50) NULL,
	[id_pedido] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[receta_medica]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[receta_medica](
	[id_receta] [int] NULL,
	[fecha_emision] [date] NULL,
	[diagnostico] [varchar](100) NULL,
	[medicamento] [varchar](100) NULL,
	[instrucciones] [varchar](100) NULL,
	[id_veterinario] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[resultado_analisis]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[resultado_analisis](
	[id_resultado_analisis] [int] NULL,
	[fecha_resultado] [date] NULL,
	[resultado_analisis] [varchar](255) NULL,
	[interpretacion] [varchar](255) NULL,
	[tipo_analisis] [varchar](50) NULL,
	[id_analisis_lab] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[servicio]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[servicio](
	[id_servicio] [int] NULL,
	[nombre] [varchar](50) NULL,
	[descripcion] [nchar](100) NULL,
	[precio] [decimal](18, 0) NULL,
	[duracion] [varchar](50) NULL,
	[requisitos] [varchar](50) NULL,
	[id_tipo_servicio] [int] NULL,
	[id_veterinario] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipo_empleado]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipo_empleado](
	[id_tipo_empleado] [int] NULL,
	[cargo] [varchar](50) NULL,
	[descripcion] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipo_servicio]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipo_servicio](
	[id_tipo_servicio] [int] NULL,
	[nombre] [varchar](50) NULL,
	[descripcion] [varchar](100) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[vacuna]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[vacuna](
	[id_vacuna] [int] NULL,
	[nombre] [varchar](50) NULL,
	[fecha_administracion] [date] NULL,
	[cantidad_dosis] [int] NULL,
	[id_veterinario] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[veterinario]    Script Date: 26/11/2023 18:25:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[veterinario](
	[id_veterinario] [int] NULL,
	[nombre] [varchar](50) NULL,
	[apellido] [varchar](50) NULL,
	[fecha_nacimiento] [date] NULL,
	[genero] [varchar](50) NULL,
	[ihss] [int] NULL,
	[especializacion] [varchar](50) NULL,
	[salario] [decimal](18, 0) NULL,
	[telefono] [varchar](50) NULL,
	[correo] [varchar](50) NULL,
	[direccion] [varchar](50) NULL,
	[foto] [image] NULL,
	[id_horario_lab] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
USE [master]
GO
ALTER DATABASE [veterinaria] SET  READ_WRITE 
GO
