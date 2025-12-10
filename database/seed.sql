--
-- PostgreSQL database dump
--

\restrict YwBaVctvzblguGQ7QQ6mfucGM6eYaqvZSiLZqBliC3iAIltezS3ceBsAHbWLSmH

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Users" ("Password", "Email", "Name", "CreatedAt", "Role") VALUES ('daniel', 'daniel@gmail.com', 'daniel', '2025-12-05 11:12:11.895041+00', 'Manager');
INSERT INTO public."Users" ("Password", "Email", "Name", "CreatedAt", "Role") VALUES ('vitor', 'vitor@gmail.com', 'vitor', '2025-12-05 16:55:04.744641+00', 'Admin');
INSERT INTO public."Users" ("Password", "Email", "Name", "CreatedAt", "Role") VALUES ('user', 'user@gmail.com', 'user', '2025-12-05 16:55:04.744641+00', 'Customer');



--
-- Data for Name: Carts; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Carts" ("Id", "UserId") VALUES (1, 1);


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (1, 'potato', 'potato', 5, 250, 1);
INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (2, 'Smartphone Galaxy', 'Ecrã AMOLED 120Hz, 128GB', 699.99, 50, 2);
INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (3, 'Portátil Gaming', 'Processador i7, 16GB RAM, RTX 4060', 1250.00, 10, 2);
INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (4, 'Monitor 27"', 'Monitor 4K IPS para profissionais', 350.50, 25, 2);
INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (5, 'T-Shirt Algodão', 'T-shirt básica preta, tamanho L', 15.90, 100, 3);
INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (6, 'Casaco de Inverno', 'Impermeável e térmico', 89.90, 30, 3);
INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (7, 'Clean Code', 'Livro clássico de engenharia de software', 45.00, 60, 4);
INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (8, 'O Senhor dos Anéis', 'Trilogia completa', 50.00, 40, 4);
INSERT INTO public."Products" ("Id", "Name", "Description", "Price", "Stock", "CategoryId") VALUES (9, 'Candeeiro de Mesa', 'LED ajustável', 25.00, 15, 5);


--
-- Data for Name: CartItems; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Categories" ("Id", "Name") VALUES (1, 'agricula');
INSERT INTO public."Categories" ("Id", "Name") VALUES (2, 'Tecnologia');
INSERT INTO public."Categories" ("Id", "Name") VALUES (3, 'Roupa');
INSERT INTO public."Categories" ("Id", "Name") VALUES (4, 'Livros');
INSERT INTO public."Categories" ("Id", "Name") VALUES (5, 'Casa e Jardim');
INSERT INTO public."Categories" ("Id", "Name") VALUES (6, 'Tecnologia');
INSERT INTO public."Categories" ("Id", "Name") VALUES (7, 'Roupa');
INSERT INTO public."Categories" ("Id", "Name") VALUES (8, 'Livros');
INSERT INTO public."Categories" ("Id", "Name") VALUES (9, 'Casa e Jardim');


--
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (1, '2025-12-05 11:14:43.307114+00', 250, 1);
INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (2, '2025-12-05 11:16:33.217328+00', 250, 1);
INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (3, '2025-12-08 16:30:01.285061+00', 1250.00, 1);
INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (4, '2025-12-08 16:30:03.948816+00', 1250.00, 1);
INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (5, '2025-12-08 16:30:04.581057+00', 1250.00, 1);
INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (6, '2025-12-08 16:31:36.874652+00', 1250.00, 1);
INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (7, '2025-12-08 16:37:59.838697+00', 1250.00, 1);
INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (8, '2025-12-08 16:38:07.430069+00', 1250.00, 1);
INSERT INTO public."Orders" ("Id", "OrderDate", "Total", "UserId") VALUES (9, '2025-12-09 15:29:15.553023+00', 5, 1);


--
-- Data for Name: OrderItems; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (1, 1, 1, 50, 5);
INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (2, 2, 1, 50, 5);
INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (3, 3, 3, 1, 1250.00);
INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (4, 4, 3, 1, 1250.00);
INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (5, 5, 3, 1, 1250.00);
INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (6, 6, 3, 1, 1250.00);
INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (7, 7, 3, 1, 1250.00);
INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (8, 8, 3, 1, 1250.00);
INSERT INTO public."OrderItems" ("Id", "OrderId", "ProductId", "Quantity", "Price") VALUES (9, 9, 1, 1, 5);


--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20251114170053_InitialCreate', '9.0.1');
INSERT INTO public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20251117161646_AddProductEntity', '9.0.1');
INSERT INTO public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20251117163454_AddCategory', '9.0.1');
INSERT INTO public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20251117171652_AtualizarTeste', '9.0.1');
INSERT INTO public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20251117181644_AddUser', '9.0.1');
INSERT INTO public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20251126160501_AddCartSystem', '9.0.1');
INSERT INTO public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20251126162225_FixCartRelations', '9.0.1');
INSERT INTO public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20251126165052_AddOrders', '9.0.1');


--
-- Name: CartItems_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."CartItems_Id_seq"', 4, true);


--
-- Name: Carts_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Carts_Id_seq"', 1, true);


--
-- Name: Categories_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Categories_Id_seq"', 9, true);


--
-- Name: OrderItems_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."OrderItems_Id_seq"', 9, true);


--
-- Name: Orders_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Orders_Id_seq"', 9, true);


--
-- Name: Products_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Products_Id_seq"', 9, true);


--
-- Name: Users_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Users_Id_seq"', 4, true);


--
-- PostgreSQL database dump complete
--

\unrestrict YwBaVctvzblguGQ7QQ6mfucGM6eYaqvZSiLZqBliC3iAIltezS3ceBsAHbWLSmH

