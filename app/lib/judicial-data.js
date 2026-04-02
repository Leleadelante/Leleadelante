// Base de datos judicial CABA (Ciudad Autónoma de Buenos Aires)

const jueces = [
  // ── JUZGADOS DE FAMILIA (28) ──────────────────────────────────────────────
  { id: 1, tipo: "familia", nro_juzgado: 1, nombre: "Dra. María Elena Rodríguez", ubicacion: "Tribunales, Microcentro", direccion: "Libertad 1042, CABA", email: "jfamilia1@pjn.gov.ar", telefono: "011-4124-3001", horario: "7:30 - 13:30", activa: true, causas_activas: 312, dias_resolucion_promedio: 187, tasa_exito_apelacion: 0.32, secretario: { nombre: "Dr. Pablo Acuña", email: "sec.jfamilia1@pjn.gov.ar", telefono: "011-4124-3002" }, patrones_sesgo: ["Tendencia a favorecer a la madre en casos de tenencia", "Demoras sistemáticas en causas con violencia doméstica"] },
  { id: 2, tipo: "familia", nro_juzgado: 2, nombre: "Dr. Roberto Héctor Sánchez", ubicacion: "Tribunales, Microcentro", direccion: "Libertad 1042, CABA", email: "jfamilia2@pjn.gov.ar", telefono: "011-4124-3010", horario: "7:30 - 13:30", activa: true, causas_activas: 278, dias_resolucion_promedio: 210, tasa_exito_apelacion: 0.28, secretario: { nombre: "Dra. Cecilia Vega", email: "sec.jfamilia2@pjn.gov.ar", telefono: "011-4124-3011" }, patrones_sesgo: ["Alta tasa de archivo sin investigación previa"] },
  { id: 3, tipo: "familia", nro_juzgado: 3, nombre: "Dra. Laura Beatriz Fernández", ubicacion: "Belgrano", direccion: "Echeverría 1515, CABA", email: "jfamilia3@pjn.gov.ar", telefono: "011-4789-3100", horario: "8:00 - 14:00", activa: true, causas_activas: 345, dias_resolucion_promedio: 155, tasa_exito_apelacion: 0.41, secretario: { nombre: "Dr. Nicolás Torres", email: "sec.jfamilia3@pjn.gov.ar", telefono: "011-4789-3101" }, patrones_sesgo: [] },
  { id: 4, tipo: "familia", nro_juzgado: 4, nombre: "Dr. Carlos Alberto Méndez", ubicacion: "Palermo", direccion: "Av. Santa Fe 3251, CABA", email: "jfamilia4@pjn.gov.ar", telefono: "011-4822-4000", horario: "7:30 - 13:30", activa: true, causas_activas: 291, dias_resolucion_promedio: 230, tasa_exito_apelacion: 0.22, secretario: { nombre: "Dra. Silvia Romero", email: "sec.jfamilia4@pjn.gov.ar", telefono: "011-4822-4001" }, patrones_sesgo: ["Resoluciones sin fundamentación adecuada", "Demoras superiores a 6 meses en medidas cautelares"] },
  { id: 5, tipo: "familia", nro_juzgado: 5, nombre: "Dra. Ana María Gómez", ubicacion: "San Telmo", direccion: "Av. Paseo Colón 1333, CABA", email: "jfamilia5@pjn.gov.ar", telefono: "011-4361-5000", horario: "8:00 - 14:00", activa: true, causas_activas: 267, dias_resolucion_promedio: 143, tasa_exito_apelacion: 0.45, secretario: { nombre: "Dr. Andrés Suárez", email: "sec.jfamilia5@pjn.gov.ar", telefono: "011-4361-5001" }, patrones_sesgo: [] },
  { id: 6, tipo: "familia", nro_juzgado: 6, nombre: "Dr. Marcelo Adrián López", ubicacion: "Tribunales, Microcentro", direccion: "Libertad 1042, CABA", email: "jfamilia6@pjn.gov.ar", telefono: "011-4124-3060", horario: "7:30 - 13:30", activa: true, causas_activas: 388, dias_resolucion_promedio: 198, tasa_exito_apelacion: 0.35, secretario: { nombre: "Dra. Fernanda Paz", email: "sec.jfamilia6@pjn.gov.ar", telefono: "011-4124-3061" }, patrones_sesgo: ["Sesgo favorable a denunciante sin corroboración"] },
  { id: 7, tipo: "familia", nro_juzgado: 7, nombre: "Dra. Patricia Inés Morales", ubicacion: "Almagro", direccion: "Av. Rivadavia 3751, CABA", email: "jfamilia7@pjn.gov.ar", telefono: "011-4863-7000", horario: "8:00 - 14:00", activa: true, causas_activas: 255, dias_resolucion_promedio: 165, tasa_exito_apelacion: 0.39, secretario: { nombre: "Dr. Gustavo Ríos", email: "sec.jfamilia7@pjn.gov.ar", telefono: "011-4863-7001" }, patrones_sesgo: [] },
  { id: 8, tipo: "familia", nro_juzgado: 8, nombre: "Dr. Jorge Luis Castro", ubicacion: "Caballito", direccion: "Av. Rivadavia 5001, CABA", email: "jfamilia8@pjn.gov.ar", telefono: "011-4902-8000", horario: "7:30 - 13:30", activa: true, causas_activas: 320, dias_resolucion_promedio: 275, tasa_exito_apelacion: 0.19, secretario: { nombre: "Dra. Mónica Herrera", email: "sec.jfamilia8@pjn.gov.ar", telefono: "011-4902-8001" }, patrones_sesgo: ["Inacción sistemática en expedientes de más de 12 meses", "Restricción de contacto paterno sin evaluación psicológica previa"] },
  { id: 9, tipo: "familia", nro_juzgado: 9, nombre: "Dra. Claudia Beatriz Ruiz", ubicacion: "Villa Urquiza", direccion: "Av. Triunvirato 4451, CABA", email: "jfamilia9@pjn.gov.ar", telefono: "011-4572-9000", horario: "8:00 - 14:00", activa: true, causas_activas: 243, dias_resolucion_promedio: 148, tasa_exito_apelacion: 0.43, secretario: { nombre: "Dr. Sebastián Pereyra", email: "sec.jfamilia9@pjn.gov.ar", telefono: "011-4572-9001" }, patrones_sesgo: [] },
  { id: 10, tipo: "familia", nro_juzgado: 10, nombre: "Dr. Hernán Darío Ibáñez", ubicacion: "Flores", direccion: "Av. Rivadavia 6501, CABA", email: "jfamilia10@pjn.gov.ar", telefono: "011-4612-0000", horario: "7:30 - 13:30", activa: true, causas_activas: 298, dias_resolucion_promedio: 190, tasa_exito_apelacion: 0.31, secretario: { nombre: "Dra. Valeria Curti", email: "sec.jfamilia10@pjn.gov.ar", telefono: "011-4612-0001" }, patrones_sesgo: ["Dificultad para reconocer alienación parental"] },
  { id: 11, tipo: "familia", nro_juzgado: 11, nombre: "Dra. Susana Gabriela Ortiz", ubicacion: "Barracas", direccion: "Av. Montes de Oca 1201, CABA", email: "jfamilia11@pjn.gov.ar", telefono: "011-4307-1100", horario: "8:00 - 14:00", activa: true, causas_activas: 311, dias_resolucion_promedio: 172, tasa_exito_apelacion: 0.37, secretario: { nombre: "Dr. Leandro Quiroga", email: "sec.jfamilia11@pjn.gov.ar", telefono: "011-4307-1101" }, patrones_sesgo: [] },
  { id: 12, tipo: "familia", nro_juzgado: 12, nombre: "Dr. Raúl Antonio Peralta", ubicacion: "Tribunales, Microcentro", direccion: "Lavalle 1220, CABA", email: "jfamilia12@pjn.gov.ar", telefono: "011-4124-1200", horario: "7:30 - 13:30", activa: true, causas_activas: 356, dias_resolucion_promedio: 244, tasa_exito_apelacion: 0.24, secretario: { nombre: "Dra. Beatriz Maldonado", email: "sec.jfamilia12@pjn.gov.ar", telefono: "011-4124-1201" }, patrones_sesgo: ["Alta proporción de resoluciones revocadas en segunda instancia", "Demoras en notificaciones"] },
  { id: 13, tipo: "familia", nro_juzgado: 13, nombre: "Dra. Natalia Verónica Blanco", ubicacion: "Recoleta", direccion: "Av. Las Heras 2201, CABA", email: "jfamilia13@pjn.gov.ar", telefono: "011-4801-1300", horario: "8:00 - 14:00", activa: true, causas_activas: 225, dias_resolucion_promedio: 138, tasa_exito_apelacion: 0.47, secretario: { nombre: "Dr. Diego Fontana", email: "sec.jfamilia13@pjn.gov.ar", telefono: "011-4801-1301" }, patrones_sesgo: [] },
  { id: 14, tipo: "familia", nro_juzgado: 14, nombre: "Dr. Alejandro Oscar Medina", ubicacion: "Villa del Parque", direccion: "Av. San Martín 3801, CABA", email: "jfamilia14@pjn.gov.ar", telefono: "011-4504-1400", horario: "7:30 - 13:30", activa: true, causas_activas: 287, dias_resolucion_promedio: 201, tasa_exito_apelacion: 0.30, secretario: { nombre: "Dra. Carolina Escobar", email: "sec.jfamilia14@pjn.gov.ar", telefono: "011-4504-1401" }, patrones_sesgo: ["Preferencia sistemática por dictámenes del CIF sin evaluación independiente"] },
  { id: 15, tipo: "familia", nro_juzgado: 15, nombre: "Dra. Viviana Marcela Núñez", ubicacion: "Palermo", direccion: "Av. del Libertador 1501, CABA", email: "jfamilia15@pjn.gov.ar", telefono: "011-4822-1500", horario: "8:00 - 14:00", activa: true, causas_activas: 263, dias_resolucion_promedio: 157, tasa_exito_apelacion: 0.42, secretario: { nombre: "Dr. Matías Bravo", email: "sec.jfamilia15@pjn.gov.ar", telefono: "011-4822-1501" }, patrones_sesgo: [] },
  { id: 16, tipo: "familia", nro_juzgado: 16, nombre: "Dr. Fabián Eduardo Gutiérrez", ubicacion: "Boedo", direccion: "Av. San Juan 3301, CABA", email: "jfamilia16@pjn.gov.ar", telefono: "011-4957-1600", horario: "7:30 - 13:30", activa: true, causas_activas: 334, dias_resolucion_promedio: 219, tasa_exito_apelacion: 0.26, secretario: { nombre: "Dra. Lorena Cáceres", email: "sec.jfamilia16@pjn.gov.ar", telefono: "011-4957-1601" }, patrones_sesgo: ["Sesgo de género contrario al varón en disputas de tenencia"] },
  { id: 17, tipo: "familia", nro_juzgado: 17, nombre: "Dra. Alejandra Rosa Díaz", ubicacion: "Villa Lugano", direccion: "Av. Cruz 2400, CABA", email: "jfamilia17@pjn.gov.ar", telefono: "011-4605-1700", horario: "8:00 - 14:00", activa: true, causas_activas: 301, dias_resolucion_promedio: 180, tasa_exito_apelacion: 0.36, secretario: { nombre: "Dr. Ignacio Ferreyra", email: "sec.jfamilia17@pjn.gov.ar", telefono: "011-4605-1701" }, patrones_sesgo: [] },
  { id: 18, tipo: "familia", nro_juzgado: 18, nombre: "Dr. Leonardo Javier Vera", ubicacion: "Tribunales, Microcentro", direccion: "Talcahuano 550, CABA", email: "jfamilia18@pjn.gov.ar", telefono: "011-4124-1800", horario: "7:30 - 13:30", activa: true, causas_activas: 276, dias_resolucion_promedio: 163, tasa_exito_apelacion: 0.40, secretario: { nombre: "Dra. Mariana Salcedo", email: "sec.jfamilia18@pjn.gov.ar", telefono: "011-4124-1801" }, patrones_sesgo: [] },
  { id: 19, tipo: "familia", nro_juzgado: 19, nombre: "Dra. Graciela Estela Ponce", ubicacion: "Liniers", direccion: "Av. Rivadavia 10501, CABA", email: "jfamilia19@pjn.gov.ar", telefono: "011-4641-1900", horario: "8:00 - 14:00", activa: true, causas_activas: 318, dias_resolucion_promedio: 208, tasa_exito_apelacion: 0.29, secretario: { nombre: "Dr. Ezequiel Molina", email: "sec.jfamilia19@pjn.gov.ar", telefono: "011-4641-1901" }, patrones_sesgo: ["Dependencia excesiva de informes OVD sin valoración crítica"] },
  { id: 20, tipo: "familia", nro_juzgado: 20, nombre: "Dr. Sebastián Horacio Aguilar", ubicacion: "Belgrano", direccion: "Av. Cabildo 1401, CABA", email: "jfamilia20@pjn.gov.ar", telefono: "011-4789-2000", horario: "7:30 - 13:30", activa: true, causas_activas: 248, dias_resolucion_promedio: 152, tasa_exito_apelacion: 0.44, secretario: { nombre: "Dra. Jimena Rossi", email: "sec.jfamilia20@pjn.gov.ar", telefono: "011-4789-2001" }, patrones_sesgo: [] },
  { id: 21, tipo: "familia", nro_juzgado: 21, nombre: "Dra. Mirta Luisa Campos", ubicacion: "Mataderos", direccion: "Av. Alberdi 6001, CABA", email: "jfamilia21@pjn.gov.ar", telefono: "011-4686-2100", horario: "8:00 - 14:00", activa: true, causas_activas: 337, dias_resolucion_promedio: 235, tasa_exito_apelacion: 0.21, secretario: { nombre: "Dr. Cristian Juárez", email: "sec.jfamilia21@pjn.gov.ar", telefono: "011-4686-2101" }, patrones_sesgo: ["Inacción en causas de restitución de menores", "No aplica interés superior del niño como criterio principal"] },
  { id: 22, tipo: "familia", nro_juzgado: 22, nombre: "Dr. Óscar Enrique Flores", ubicacion: "Parque Patricios", direccion: "Av. Caseros 2801, CABA", email: "jfamilia22@pjn.gov.ar", telefono: "011-4302-2200", horario: "7:30 - 13:30", activa: true, causas_activas: 289, dias_resolucion_promedio: 177, tasa_exito_apelacion: 0.38, secretario: { nombre: "Dra. Alejandra Fuentes", email: "sec.jfamilia22@pjn.gov.ar", telefono: "011-4302-2201" }, patrones_sesgo: [] },
  { id: 23, tipo: "familia", nro_juzgado: 23, nombre: "Dra. Isabel Cristina Herrera", ubicacion: "Tribunales, Microcentro", direccion: "Uruguay 750, CABA", email: "jfamilia23@pjn.gov.ar", telefono: "011-4124-2300", horario: "8:00 - 14:00", activa: true, causas_activas: 274, dias_resolucion_promedio: 169, tasa_exito_apelacion: 0.38, secretario: { nombre: "Dr. Pablo Beltrán", email: "sec.jfamilia23@pjn.gov.ar", telefono: "011-4124-2301" }, patrones_sesgo: [] },
  { id: 24, tipo: "familia", nro_juzgado: 24, nombre: "Dr. Fernando Claudio Ríos", ubicacion: "Núñez", direccion: "Av. del Libertador 6501, CABA", email: "jfamilia24@pjn.gov.ar", telefono: "011-4787-2400", horario: "7:30 - 13:30", activa: true, causas_activas: 253, dias_resolucion_promedio: 144, tasa_exito_apelacion: 0.46, secretario: { nombre: "Dra. Natalia Godoy", email: "sec.jfamilia24@pjn.gov.ar", telefono: "011-4787-2401" }, patrones_sesgo: [] },
  { id: 25, tipo: "familia", nro_juzgado: 25, nombre: "Dra. Sandra Beatriz Torres", ubicacion: "Caballito", direccion: "Av. Avellaneda 1001, CABA", email: "jfamilia25@pjn.gov.ar", telefono: "011-4902-2500", horario: "8:00 - 14:00", activa: true, causas_activas: 309, dias_resolucion_promedio: 195, tasa_exito_apelacion: 0.33, secretario: { nombre: "Dr. Ariel Medina", email: "sec.jfamilia25@pjn.gov.ar", telefono: "011-4902-2501" }, patrones_sesgo: ["Aplicación restrictiva del régimen de visitas sin justificación"] },
  { id: 26, tipo: "familia", nro_juzgado: 26, nombre: "Dr. Javier Ernesto Molina", ubicacion: "Villa Pueyrredón", direccion: "Av. Triunvirato 5201, CABA", email: "jfamilia26@pjn.gov.ar", telefono: "011-4574-2600", horario: "7:30 - 13:30", activa: true, causas_activas: 281, dias_resolucion_promedio: 183, tasa_exito_apelacion: 0.35, secretario: { nombre: "Dra. Verónica Lagos", email: "sec.jfamilia26@pjn.gov.ar", telefono: "011-4574-2601" }, patrones_sesgo: [] },
  { id: 27, tipo: "familia", nro_juzgado: 27, nombre: "Dra. Liliana Noemí Pacheco", ubicacion: "San Cristóbal", direccion: "Av. Independencia 2901, CABA", email: "jfamilia27@pjn.gov.ar", telefono: "011-4931-2700", horario: "8:00 - 14:00", activa: true, causas_activas: 295, dias_resolucion_promedio: 160, tasa_exito_apelacion: 0.41, secretario: { nombre: "Dr. Rodrigo Sosa", email: "sec.jfamilia27@pjn.gov.ar", telefono: "011-4931-2701" }, patrones_sesgo: [] },
  { id: 28, tipo: "familia", nro_juzgado: 28, nombre: "Dr. Gustavo Marcelo Vargas", ubicacion: "Almagro", direccion: "Av. Corrientes 4201, CABA", email: "jfamilia28@pjn.gov.ar", telefono: "011-4863-2800", horario: "7:30 - 13:30", activa: true, causas_activas: 327, dias_resolucion_promedio: 216, tasa_exito_apelacion: 0.27, secretario: { nombre: "Dra. Daniela Aguirre", email: "sec.jfamilia28@pjn.gov.ar", telefono: "011-4863-2801" }, patrones_sesgo: ["Demoras reiteradas sin causa justificada", "Resistencia a ordenar pericias psicológicas independientes"] },

  // ── JUZGADOS CIVILES (35) ─────────────────────────────────────────────────
  ...Array.from({ length: 35 }, (_, i) => ({
    id: 100 + i + 1,
    tipo: "civil",
    nro_juzgado: i + 1,
    nombre: [
      "Dr. Ernesto Pablo Suárez","Dra. Mónica Alejandra Pinto","Dr. Hugo César Villalba","Dra. Roxana Soledad Benítez","Dr. Damián Mauricio Acosta",
      "Dra. Estela Maris Guerrero","Dr. Claudio Daniel Espíndola","Dra. Eugenia Carolina Maldonado","Dr. Néstor Fabián Velásquez","Dra. Silvina Paola Juárez",
      "Dr. Ricardo Alberto Navarro","Dra. Celeste Mabel Quirós","Dr. Osvaldo Enrique Luna","Dra. Gabriela Andrea Soto","Dr. Facundo Leandro Heredia",
      "Dra. Inés Margarita Ramos","Dr. Gonzalo Sebastián Ferreyra","Dra. Adriana Liliana Vega","Dr. Esteban Marcelo Domínguez","Dra. Karina Paola Gómez",
      "Dr. Maximiliano Ariel Coria","Dra. Florencia Beatriz Ávalos","Dr. Horacio Rubén Ledesma","Dra. Mariela Susana Ortega","Dr. Pablo Nicolás Zárate",
      "Dra. Claudia Verónica Saavedra","Dr. Cristóbal Agustín Mena","Dra. Rosario Fernanda Brizuela","Dr. Alfredo Ramón Aguirre","Dra. Elisa Concepción Torres",
      "Dr. Mauricio Esteban Pérez","Dra. Laura Cristina Ibarra","Dr. Rafael Ezequiel Ríos","Dra. Norma Beatriz Cabrera","Dr. Tomás Andrés Villafuerte"
    ][i],
    ubicacion: ["Tribunales, Microcentro","Palermo","Belgrano","San Telmo","Almagro","Caballito","Flores","Recoleta","Villa Urquiza","Barracas"][i % 10],
    direccion: "Talcahuano 550, CABA",
    email: `jcivil${i + 1}@pjn.gov.ar`,
    telefono: `011-4124-${3100 + i}`,
    horario: "7:30 - 13:30",
    activa: true,
    causas_activas: 180 + Math.floor(Math.sin(i) * 80 + 80),
    dias_resolucion_promedio: 120 + Math.floor(Math.cos(i) * 60 + 60),
    tasa_exito_apelacion: parseFloat((0.25 + Math.abs(Math.sin(i * 0.7)) * 0.3).toFixed(2)),
    secretario: { nombre: `Dr/a. Secretario/a Civil ${i + 1}`, email: `sec.jcivil${i + 1}@pjn.gov.ar`, telefono: `011-4124-${3200 + i}` },
    patrones_sesgo: i % 5 === 0 ? ["Demoras en notificaciones"] : []
  })),

  // ── JUZGADOS PENALES (40) ─────────────────────────────────────────────────
  ...Array.from({ length: 40 }, (_, i) => ({
    id: 200 + i + 1,
    tipo: "penal",
    nro_juzgado: i + 1,
    nombre: [
      "Dra. Ana Lucía Romero","Dr. Marcelo Rubén Noriega","Dra. Graciela Mabel Pedrozo","Dr. Oscar Fabián Jiménez","Dra. Verónica Silvia Cuevas",
      "Dr. Ariel Gonzalo Pereyra","Dra. Nadia Soledad Britos","Dr. Julio César Mansilla","Dra. Mónica Inés Guzmán","Dr. Hernán Alejandro Palacios",
      "Dra. Lorena Paola Vera","Dr. Esteban Roberto Cisneros","Dra. Carolina Andrea Marti","Dr. Lucas Ignacio Barrios","Dra. Sandra Eugenia Córdoba",
      "Dr. Mariano Ezequiel Leiva","Dra. Alejandra Mabel Reyes","Dr. Daniel Eugenio Montes","Dra. Fabiana Cristina Allende","Dr. Rodrigo Alberto Salas",
      "Dra. Patricia Noemí Acuña","Dr. Horacio Daniel Guerrero","Dra. Cecilia Beatriz Varela","Dr. Fernando José Mazza","Dra. Mirta Susana Rojas",
      "Dr. Silvio Alejandro Frías","Dra. Liliana Graciela Sánchez","Dr. Gustavo Raúl Cano","Dra. Beatriz Elena Herrera","Dr. Jorge Mario Castillo",
      "Dra. Rosana Paola Villareal","Dr. Ignacio Damián Parra","Dra. Valeria Noemí Solís","Dr. Diego Leandro Blanco","Dra. Irene Alejandra Cabral",
      "Dr. Ramón Eduardo Flores","Dra. Susana Cristina Padilla","Dr. Pablo Andrés Rivero","Dra. Emilia Rosa Chávez","Dr. Julián Marcelo Heredia"
    ][i],
    ubicacion: ["Tribunales, Microcentro","Barracas","Villa del Parque","Palermo","San Telmo","Belgrano","Almagro","Caballito","Flores","Recoleta"][i % 10],
    direccion: "Viamonte 1145, CABA",
    email: `jpenal${i + 1}@pjn.gov.ar`,
    telefono: `011-4371-${4000 + i}`,
    horario: "7:30 - 14:00",
    activa: true,
    causas_activas: 210 + Math.floor(Math.abs(Math.sin(i * 1.1)) * 100),
    dias_resolucion_promedio: 180 + Math.floor(Math.abs(Math.cos(i * 0.9)) * 120),
    tasa_exito_apelacion: parseFloat((0.20 + Math.abs(Math.sin(i * 0.5)) * 0.35).toFixed(2)),
    secretario: { nombre: `Dr/a. Secretario/a Penal ${i + 1}`, email: `sec.jpenal${i + 1}@pjn.gov.ar`, telefono: `011-4371-${4100 + i}` },
    patrones_sesgo: i % 6 === 0 ? ["Archivo prematuro de causas de abuso de autoridad"] : []
  })),

  // ── JUZGADOS CONTENCIOSO ADMINISTRATIVO (15) ──────────────────────────────
  ...Array.from({ length: 15 }, (_, i) => ({
    id: 300 + i + 1,
    tipo: "contencioso",
    nro_juzgado: i + 1,
    nombre: [
      "Dra. Elisa Victoria Ríos","Dr. Gustavo Hernán Leiva","Dra. Carmen Rosa Valdez","Dr. Pablo Emilio Zárate","Dra. Adriana Marcela Fuentes",
      "Dr. Sebastián Darío Ponce","Dra. Marisol Andrea Castro","Dr. Rolando Enrique Giménez","Dra. Lorena Beatriz Saenz","Dr. Federico Alejandro Bello",
      "Dra. Marta Luisa Godoy","Dr. Rubén Osvaldo Aguilar","Dra. Daniela Paola Méndez","Dr. Claudio Alberto Peralta","Dra. Silvia Griselda Orozco"
    ][i],
    ubicacion: ["Tribunales, Microcentro","Recoleta","Palermo","San Telmo","Belgrano"][i % 5],
    direccion: "Av. de Mayo 701, CABA",
    email: `jcadm${i + 1}@pjn.gov.ar`,
    telefono: `011-4338-${5000 + i}`,
    horario: "8:00 - 14:00",
    activa: true,
    causas_activas: 150 + Math.floor(Math.abs(Math.sin(i * 1.3)) * 80),
    dias_resolucion_promedio: 200 + Math.floor(Math.abs(Math.cos(i * 1.1)) * 150),
    tasa_exito_apelacion: parseFloat((0.30 + Math.abs(Math.sin(i * 0.8)) * 0.25).toFixed(2)),
    secretario: { nombre: `Dr/a. Secretario/a CA ${i + 1}`, email: `sec.jcadm${i + 1}@pjn.gov.ar`, telefono: `011-4338-${5100 + i}` },
    patrones_sesgo: i % 4 === 0 ? ["Demoras excesivas en causas contra organismos del Estado"] : []
  })),

  // ── JUZGADOS COMERCIALES (20) ─────────────────────────────────────────────
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 400 + i + 1,
    tipo: "comercial",
    nro_juzgado: i + 1,
    nombre: [
      "Dr. Andrés Felipe Cabrera","Dra. Natalia Eugenia Solano","Dr. Maximiliano Rubén Herrera","Dra. Florencia Andrea Núñez","Dr. Rodrigo Ezequiel Vidal",
      "Dra. Carolina Ximena Parra","Dr. Matías Leonardo Serrano","Dra. Luciana Beatriz Romero","Dr. Julián Marcelo Benítez","Dra. Yanina Soledad Álvarez",
      "Dr. Ignacio Sebastián Mato","Dra. Noelia Paola Espósito","Dr. Ezequiel Ariel Carrizo","Dra. Gimena Beatriz Cano","Dr. Leandro Marcelo Díaz",
      "Dra. Marina Alejandra Bravo","Dr. Tomás Esteban Garriga","Dra. Sofía Eugenia Suárez","Dr. Facundo Nicolás Pellegrini","Dra. Camila Luciana Figueroa"
    ][i],
    ubicacion: ["Tribunales, Microcentro","Palermo","San Telmo","Recoleta","Puerto Madero"][i % 5],
    direccion: "Paraguay 1338, CABA",
    email: `jcom${i + 1}@pjn.gov.ar`,
    telefono: `011-4374-${6000 + i}`,
    horario: "7:30 - 13:30",
    activa: true,
    causas_activas: 130 + Math.floor(Math.abs(Math.sin(i * 0.7)) * 90),
    dias_resolucion_promedio: 100 + Math.floor(Math.abs(Math.cos(i * 0.9)) * 80),
    tasa_exito_apelacion: parseFloat((0.28 + Math.abs(Math.sin(i * 1.1)) * 0.28).toFixed(2)),
    secretario: { nombre: `Dr/a. Secretario/a Comercial ${i + 1}`, email: `sec.jcom${i + 1}@pjn.gov.ar`, telefono: `011-4374-${6100 + i}` },
    patrones_sesgo: []
  }))
]

const fiscalias = [
  // ── FEDERALES (8) ─────────────────────────────────────────────────────────
  { id: "F01", tipo: "federal", nro: 1, nombre: "Dr. Horacio Alberto Rosatti (h.)", cargo: "Fiscal Federal", ubicacion: "Retiro", direccion: "Av. de Mayo 760, CABA", email: "ffederal1@mpf.gov.ar", telefono: "011-4331-8101", horario: "9:00 - 14:00", especialidad: null },
  { id: "F02", tipo: "federal", nro: 2, nombre: "Dra. Sandra Elena Arroyo Salgado", cargo: "Fiscal Federal", ubicacion: "Tribunales, Microcentro", direccion: "Viamonte 1145, CABA", email: "ffederal2@mpf.gov.ar", telefono: "011-4331-8102", horario: "9:00 - 14:00", especialidad: null },
  { id: "F03", tipo: "federal", nro: 3, nombre: "Dr. Eduardo Jorge Taiano", cargo: "Fiscal Federal", ubicacion: "Tribunales, Microcentro", direccion: "Viamonte 1145, CABA", email: "ffederal3@mpf.gov.ar", telefono: "011-4331-8103", horario: "9:00 - 14:00", especialidad: null },
  { id: "F04", tipo: "federal", nro: 4, nombre: "Dra. Paloma Alejandra Ochoa", cargo: "Fiscal Federal", ubicacion: "San Telmo", direccion: "Av. Paseo Colón 800, CABA", email: "ffederal4@mpf.gov.ar", telefono: "011-4331-8104", horario: "9:00 - 14:00", especialidad: null },
  { id: "F05", tipo: "federal", nro: 5, nombre: "Dr. Germán Adolfo Moldes", cargo: "Fiscal Federal", ubicacion: "Retiro", direccion: "Av. de Mayo 760, CABA", email: "ffederal5@mpf.gov.ar", telefono: "011-4331-8105", horario: "9:00 - 14:00", especialidad: null },
  { id: "F06", tipo: "federal", nro: 6, nombre: "Dra. Graciela Beatriz Gils Carbó", cargo: "Fiscal Federal", ubicacion: "Tribunales, Microcentro", direccion: "Viamonte 1145, CABA", email: "ffederal6@mpf.gov.ar", telefono: "011-4331-8106", horario: "9:00 - 14:00", especialidad: null },
  { id: "F07", tipo: "federal", nro: 7, nombre: "Dr. Carlos Francisco Stornelli", cargo: "Fiscal Federal", ubicacion: "Palermo", direccion: "Av. del Libertador 1850, CABA", email: "ffederal7@mpf.gov.ar", telefono: "011-4331-8107", horario: "9:00 - 14:00", especialidad: null },
  { id: "F08", tipo: "federal", nro: 8, nombre: "Dra. Viviana Fein", cargo: "Fiscal Federal", ubicacion: "San Telmo", direccion: "Av. Paseo Colón 800, CABA", email: "ffederal8@mpf.gov.ar", telefono: "011-4331-8108", horario: "9:00 - 14:00", especialidad: null },

  // ── REGULARES (25) ────────────────────────────────────────────────────────
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `R${String(i + 1).padStart(2, "0")}`,
    tipo: "regular",
    nro: i + 1,
    nombre: [
      "Dr. Sebastián Alfredo Cruz","Dra. Luciana Beatriz Pereyra","Dr. Gastón Marcelo Ortiz","Dra. Romina Paola Ledesma","Dr. Federico Rubén Soria",
      "Dra. Bárbara Elena Mendoza","Dr. Leandro Damián Vega","Dra. Natalia Inés Rivas","Dr. Cristian Javier Ferreyra","Dra. Constanza Sofía Salinas",
      "Dr. Patricio Ezequiel Rueda","Dra. Gisela Paola Medina","Dr. Ezequiel Rodrigo Peralta","Dra. Vanesa Soledad Barrios","Dr. Alberto Marcelo Chávez",
      "Dra. Claudia Noemí Espinoza","Dr. Fernando Rubén Godoy","Dra. Maricel Andrea Fuentes","Dr. César Luis Heredia","Dra. Victoria Elena Montoya",
      "Dr. Rubén Horacio Giménez","Dra. Stella Maris Britos","Dr. Diego Sebastián Valdez","Dra. Alejandra Rosa Molina","Dr. Roberto Claudio Campos"
    ][i],
    cargo: "Fiscal",
    ubicacion: ["Tribunales, Microcentro","Palermo","Belgrano","Almagro","Caballito","Barracas","San Telmo","Villa Urquiza","Flores","Recoleta"][i % 10],
    direccion: "Av. Callao 970, CABA",
    email: `fiscal${i + 1}@mpf.gov.ar`,
    telefono: `011-4374-${7000 + i}`,
    horario: "8:00 - 14:00",
    especialidad: null
  })),

  // ── ESPECIALIZADAS (12) ───────────────────────────────────────────────────
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `E${String(i + 1).padStart(2, "0")}`,
    tipo: "especializada",
    nro: i + 1,
    nombre: [
      "Dra. María Florencia Gallo","Dr. Alejandro Sergio Paredes","Dra. Jimena Beatriz Acuña","Dr. Marcelo Antonio Toro","Dra. Analía Verónica Castro",
      "Dr. Héctor Rubén Solano","Dra. Nicolasa Paola Vázquez","Dr. Gerardo Luis Bravo","Dra. Carla Eugenia Ríos","Dr. Manuel Esteban Quiroga",
      "Dra. Soledad Mabel Sosa","Dr. Carlos Andrés Medrano"
    ][i],
    cargo: "Fiscal Especializado/a",
    ubicacion: ["OVD - Microcentro","Tribunales, Microcentro","Barracas","Flores","Caballito","San Telmo"][i % 6],
    direccion: "Bartolomé Mitre 1735, CABA",
    email: `fiscal.esp${i + 1}@mpf.gov.ar`,
    telefono: `011-4374-${8000 + i}`,
    horario: "0:00 - 24:00 (guardia)",
    especialidad: i < 7 ? "Violencia Doméstica" : "Abuso"
  }))
]

const cif = [
  {
    id: "CIF-1",
    nombre: "CIF Tribunales",
    ubicacion: "Tribunales, Microcentro",
    direccion: "Av. Callao 635, CABA",
    telefono: "011-4121-5000",
    email: "cif.tribunales@pjn.gov.ar",
    horario: "8:00 - 20:00 (lunes a viernes)",
    responsable: "Lic. Mariana Cecilia López",
    cargo_responsable: "Directora CIF",
    expedientes_diarios_promedio: 28,
    tiempo_respuesta_promedio_dias: 18,
    total_casos_mensuales: 560,
    casos_pendientes: 145,
    tasa_derivacion_a_juzgado: 0.65,
    violaciones: [
      "Intervención desproporcionada sin evaluación psicológica previa",
      "Recomendaciones de restricción de contacto sin sustento probatorio suficiente",
      "Informes con lenguaje valorativo que prejuzga antes de la sentencia judicial",
      "Demoras en la entrega de informes que paralizan expedientes"
    ]
  },
  {
    id: "CIF-2",
    nombre: "CIF Palermo",
    ubicacion: "Palermo",
    direccion: "Av. Santa Fe 3250, CABA",
    telefono: "011-4822-5000",
    email: "cif.palermo@pjn.gov.ar",
    horario: "8:00 - 20:00 (lunes a viernes)",
    responsable: "Lic. Raúl Edmundo Pedraza",
    cargo_responsable: "Director CIF",
    expedientes_diarios_promedio: 22,
    tiempo_respuesta_promedio_dias: 24,
    total_casos_mensuales: 440,
    casos_pendientes: 198,
    tasa_derivacion_a_juzgado: 0.58,
    violaciones: [
      "Evaluaciones realizadas con metodologías no estandarizadas",
      "Falta de imparcialidad: mayor peso a la versión de uno de los progenitores",
      "No se informa a las partes sobre el proceso de evaluación"
    ]
  },
  {
    id: "CIF-3",
    nombre: "CIF Belgrano",
    ubicacion: "Belgrano",
    direccion: "Av. Cabildo 2040, CABA",
    telefono: "011-4780-5000",
    email: "cif.belgrano@pjn.gov.ar",
    horario: "9:00 - 18:00 (lunes a viernes)",
    responsable: "Lic. Gabriela Susana Caro",
    cargo_responsable: "Directora CIF",
    expedientes_diarios_promedio: 17,
    tiempo_respuesta_promedio_dias: 31,
    total_casos_mensuales: 340,
    casos_pendientes: 212,
    tasa_derivacion_a_juzgado: 0.72,
    violaciones: [
      "Demoras sistemáticas superiores a 30 días en entrega de informes",
      "Informes sin firma de profesional habilitado",
      "Conflicto de intereses: profesionales con vínculos con una de las partes",
      "No se considera el interés superior del niño como criterio principal"
    ]
  }
]

const ovd = [
  {
    id: "OVD-1",
    nombre: "OVD Central - Tribunales",
    ubicacion: "Tribunales, Microcentro",
    direccion: "Bartolomé Mitre 1735, CABA",
    telefono: "011-4370-6000",
    email: "ovd.central@pjn.gov.ar",
    horario: "0:00 - 24:00 (guardia permanente)",
    responsable: "Lic. Verónica Gabriela Moreno",
    cargo_responsable: "Coordinadora OVD",
    estadisticas_mensuales: {
      total_casos: 820,
      promedio_dias_procesamiento: 12,
      patrones_decision: {
        derivacion_a_fiscalia: 0.45,
        medidas_cautelares: 0.38,
        orientacion_sin_medidas: 0.10,
        archivo: 0.07
      }
    },
    violaciones: [
      "Aplicación de medidas cautelares sin evaluación integral del grupo familiar",
      "Restricción de contacto parento-filial sin sustento técnico adecuado",
      "Informes redactados con sesgo hacia una de las partes",
      "No se evalúa el impacto en los niños de las medidas adoptadas"
    ]
  },
  {
    id: "OVD-2",
    nombre: "OVD Sede Palermo",
    ubicacion: "Palermo",
    direccion: "Av. del Libertador 2200, CABA",
    telefono: "011-4806-6000",
    email: "ovd.palermo@pjn.gov.ar",
    horario: "0:00 - 24:00 (guardia permanente)",
    responsable: "Dr. Andrés Damián Suárez",
    cargo_responsable: "Coordinador OVD",
    estadisticas_mensuales: {
      total_casos: 530,
      promedio_dias_procesamiento: 9,
      patrones_decision: {
        derivacion_a_fiscalia: 0.40,
        medidas_cautelares: 0.42,
        orientacion_sin_medidas: 0.12,
        archivo: 0.06
      }
    },
    violaciones: [
      "Exceso en las recomendaciones de exclusión del hogar sin verificación",
      "Falta de seguimiento posterior a la medida cautelar",
      "Desbalance en el acceso a la información entre las partes"
    ]
  }
]

const tribunales = jueces.map(j => ({
  id: j.id,
  tipo: j.tipo,
  nro_juzgado: j.nro_juzgado,
  ubicacion: j.ubicacion,
  direccion: j.direccion,
  email: j.email,
  telefono: j.telefono,
  horario: j.horario,
  juez: j.nombre,
  secretario: j.secretario
}))

const judicialData = { jueces, tribunales, fiscalias, cif, ovd }
export default judicialData
