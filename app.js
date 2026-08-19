const roles = ["Dirección", "Guion", "Dirección de Fotografía", "Cámara", "Dirección de Arte", "Producción", "Sonido", "Montaje / Edición", "Color", "VFX / Motion Graphics", "Música"];
const profiles = [
  {
    "id": 1,
    "name": "Julia Romero",
    "primary": "Cámara",
    "secondary": [
      "Sonido"
    ],
    "skills": [
      "foquista",
      "operación de cámara",
      "documental",
      "gimbal"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en cámara, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "02 ago 2026"
  },
  {
    "id": 2,
    "name": "Mateo Ferreyra",
    "primary": "Sonido",
    "secondary": [
      "Música"
    ],
    "skills": [
      "mezcla",
      "diseño sonoro",
      "sonido directo",
      "postproducción"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a sonido y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "03 ago 2026"
  },
  {
    "id": 3,
    "name": "Camila López",
    "primary": "VFX / Motion Graphics",
    "secondary": [
      "Dirección"
    ],
    "skills": [
      "motion",
      "after effects",
      "3D",
      "composición"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en vfx / motion graphics para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "04 ago 2026"
  },
  {
    "id": 4,
    "name": "Tomás Herrera",
    "primary": "Guion",
    "secondary": [
      "Dirección de Arte",
      "Sonido"
    ],
    "skills": [
      "ficción",
      "comedia",
      "drama",
      "desarrollo de proyectos"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en guion, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "05 ago 2026"
  },
  {
    "id": 5,
    "name": "Sofía Molina",
    "primary": "Producción",
    "secondary": [
      "VFX / Motion Graphics"
    ],
    "skills": [
      "logística",
      "presupuesto",
      "locaciones",
      "plan de rodaje"
    ],
    "available": false,
    "students": true,
    "bio": "Perfil orientado a producción y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "06 ago 2026"
  },
  {
    "id": 6,
    "name": "Franco Acosta",
    "primary": "Color",
    "secondary": [
      "Música"
    ],
    "skills": [
      "finishing",
      "cine",
      "davinci resolve",
      "color grading"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en color para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "07 ago 2026"
  },
  {
    "id": 7,
    "name": "Valentina Quiroga",
    "primary": "Dirección",
    "secondary": [
      "Cámara"
    ],
    "skills": [
      "puesta en escena",
      "ficción",
      "publicidad",
      "videoclip"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en dirección, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "08 ago 2026"
  },
  {
    "id": 8,
    "name": "Nicolás Suárez",
    "primary": "Cámara",
    "secondary": [
      "Montaje / Edición",
      "Color"
    ],
    "skills": [
      "gimbal",
      "foquista",
      "operación de cámara",
      "documental"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a cámara y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "09 ago 2026"
  },
  {
    "id": 9,
    "name": "Martina Vega",
    "primary": "Sonido",
    "secondary": [
      "Color"
    ],
    "skills": [
      "postproducción",
      "mezcla",
      "diseño sonoro",
      "sonido directo"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en sonido para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "10 ago 2026"
  },
  {
    "id": 10,
    "name": "Agustín Pereyra",
    "primary": "Música",
    "secondary": [
      "Dirección de Fotografía"
    ],
    "skills": [
      "producción musical",
      "soundtrack",
      "composición",
      "banda sonora"
    ],
    "available": false,
    "students": true,
    "bio": "Realizador/a especializado/a en música, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "11 ago 2026"
  },
  {
    "id": 11,
    "name": "Lucía Ortiz",
    "primary": "Dirección de Fotografía",
    "secondary": [
      "Sonido"
    ],
    "skills": [
      "16mm",
      "cámara",
      "iluminación",
      "digital"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a dirección de fotografía y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "12 ago 2026"
  },
  {
    "id": 12,
    "name": "Joaquín Roldán",
    "primary": "Producción",
    "secondary": [
      "Montaje / Edición",
      "Música"
    ],
    "skills": [
      "plan de rodaje",
      "logística",
      "presupuesto",
      "locaciones"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en producción para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "13 ago 2026"
  },
  {
    "id": 13,
    "name": "Malena Navarro",
    "primary": "Color",
    "secondary": [
      "Dirección"
    ],
    "skills": [
      "color grading",
      "finishing",
      "cine",
      "davinci resolve"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en color, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "14 ago 2026"
  },
  {
    "id": 14,
    "name": "Bruno Funes",
    "primary": "Dirección",
    "secondary": [
      "Dirección de Arte"
    ],
    "skills": [
      "videoclip",
      "puesta en escena",
      "ficción",
      "publicidad"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a dirección y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "15 ago 2026"
  },
  {
    "id": 15,
    "name": "Victoria Soria",
    "primary": "Dirección de Arte",
    "secondary": [
      "Sonido"
    ],
    "skills": [
      "publicidad",
      "escenografía",
      "utilería",
      "vestuario"
    ],
    "available": false,
    "students": false,
    "bio": "Trabajo principalmente en dirección de arte para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "16 ago 2026"
  },
  {
    "id": 16,
    "name": "Lautaro Arias",
    "primary": "Montaje / Edición",
    "secondary": [
      "Música",
      "Guion"
    ],
    "skills": [
      "ficción",
      "documental",
      "premiere",
      "davinci"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en montaje / edición, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "17 ago 2026"
  },
  {
    "id": 17,
    "name": "Emilia Paz",
    "primary": "Música",
    "secondary": [
      "Cámara"
    ],
    "skills": [
      "banda sonora",
      "producción musical",
      "soundtrack",
      "composición"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a música y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "18 ago 2026"
  },
  {
    "id": 18,
    "name": "Facundo Mercado",
    "primary": "Dirección de Fotografía",
    "secondary": [
      "Dirección de Arte"
    ],
    "skills": [
      "digital",
      "16mm",
      "cámara",
      "iluminación"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en dirección de fotografía para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "01 ago 2026"
  },
  {
    "id": 19,
    "name": "Clara Torres",
    "primary": "Producción",
    "secondary": [
      "Color"
    ],
    "skills": [
      "locaciones",
      "plan de rodaje",
      "logística",
      "presupuesto"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en producción, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "02 ago 2026"
  },
  {
    "id": 20,
    "name": "Santiago Almada",
    "primary": "VFX / Motion Graphics",
    "secondary": [
      "Dirección de Fotografía",
      "Cámara"
    ],
    "skills": [
      "after effects",
      "3D",
      "composición",
      "motion"
    ],
    "available": false,
    "students": true,
    "bio": "Perfil orientado a vfx / motion graphics y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "03 ago 2026"
  },
  {
    "id": 21,
    "name": "Renata Giménez",
    "primary": "Guion",
    "secondary": [
      "Cámara"
    ],
    "skills": [
      "comedia",
      "drama",
      "desarrollo de proyectos",
      "ficción"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en guion para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "04 ago 2026"
  },
  {
    "id": 22,
    "name": "Ignacio Ceballos",
    "primary": "Dirección de Arte",
    "secondary": [
      "Montaje / Edición"
    ],
    "skills": [
      "vestuario",
      "publicidad",
      "escenografía",
      "utilería"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en dirección de arte, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "05 ago 2026"
  },
  {
    "id": 23,
    "name": "Ana Bustos",
    "primary": "Montaje / Edición",
    "secondary": [
      "Dirección"
    ],
    "skills": [
      "davinci",
      "ficción",
      "documental",
      "premiere"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a montaje / edición y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "06 ago 2026"
  },
  {
    "id": 24,
    "name": "Benjamín Peralta",
    "primary": "Música",
    "secondary": [
      "Guion",
      "Dirección de Arte"
    ],
    "skills": [
      "composición",
      "banda sonora",
      "producción musical",
      "soundtrack"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en música para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "07 ago 2026"
  },
  {
    "id": 25,
    "name": "Mora Luna",
    "primary": "Cámara",
    "secondary": [
      "Sonido"
    ],
    "skills": [
      "foquista",
      "operación de cámara",
      "documental",
      "gimbal"
    ],
    "available": false,
    "students": true,
    "bio": "Realizador/a especializado/a en cámara, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "08 ago 2026"
  },
  {
    "id": 26,
    "name": "Ramiro Ávila",
    "primary": "Sonido",
    "secondary": [
      "Música"
    ],
    "skills": [
      "mezcla",
      "diseño sonoro",
      "sonido directo",
      "postproducción"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a sonido y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "09 ago 2026"
  },
  {
    "id": 27,
    "name": "Paula Correa",
    "primary": "VFX / Motion Graphics",
    "secondary": [
      "Dirección"
    ],
    "skills": [
      "motion",
      "after effects",
      "3D",
      "composición"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en vfx / motion graphics para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "10 ago 2026"
  },
  {
    "id": 28,
    "name": "Gonzalo Moyano",
    "primary": "Guion",
    "secondary": [
      "Dirección de Arte",
      "Sonido"
    ],
    "skills": [
      "ficción",
      "comedia",
      "drama",
      "desarrollo de proyectos"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en guion, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "11 ago 2026"
  },
  {
    "id": 29,
    "name": "Carolina Flores",
    "primary": "Dirección de Arte",
    "secondary": [
      "Color"
    ],
    "skills": [
      "utilería",
      "vestuario",
      "publicidad",
      "escenografía"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a dirección de arte y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "12 ago 2026"
  },
  {
    "id": 30,
    "name": "Simón Rivero",
    "primary": "Color",
    "secondary": [
      "Música"
    ],
    "skills": [
      "finishing",
      "cine",
      "davinci resolve",
      "color grading"
    ],
    "available": false,
    "students": false,
    "bio": "Trabajo principalmente en color para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "13 ago 2026"
  },
  {
    "id": 31,
    "name": "Julieta Juárez",
    "primary": "Dirección",
    "secondary": [
      "Cámara"
    ],
    "skills": [
      "puesta en escena",
      "ficción",
      "publicidad",
      "videoclip"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en dirección, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "14 ago 2026"
  },
  {
    "id": 32,
    "name": "Marcos Villagra",
    "primary": "Cámara",
    "secondary": [
      "Montaje / Edición",
      "Color"
    ],
    "skills": [
      "gimbal",
      "foquista",
      "operación de cámara",
      "documental"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a cámara y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "15 ago 2026"
  },
  {
    "id": 33,
    "name": "Florencia Carrizo",
    "primary": "Sonido",
    "secondary": [
      "Color"
    ],
    "skills": [
      "postproducción",
      "mezcla",
      "diseño sonoro",
      "sonido directo"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en sonido para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "16 ago 2026"
  },
  {
    "id": 34,
    "name": "Lucas Godoy",
    "primary": "VFX / Motion Graphics",
    "secondary": [
      "Guion"
    ],
    "skills": [
      "composición",
      "motion",
      "after effects",
      "3D"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en vfx / motion graphics, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "17 ago 2026"
  },
  {
    "id": 35,
    "name": "Milagros Sosa",
    "primary": "Dirección de Fotografía",
    "secondary": [
      "Sonido"
    ],
    "skills": [
      "16mm",
      "cámara",
      "iluminación",
      "digital"
    ],
    "available": false,
    "students": true,
    "bio": "Perfil orientado a dirección de fotografía y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "18 ago 2026"
  },
  {
    "id": 36,
    "name": "Federico Salas",
    "primary": "Producción",
    "secondary": [
      "Montaje / Edición",
      "Música"
    ],
    "skills": [
      "plan de rodaje",
      "logística",
      "presupuesto",
      "locaciones"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en producción para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "01 ago 2026"
  },
  {
    "id": 37,
    "name": "Delfina Méndez",
    "primary": "Color",
    "secondary": [
      "Dirección"
    ],
    "skills": [
      "color grading",
      "finishing",
      "cine",
      "davinci resolve"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en color, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "02 ago 2026"
  },
  {
    "id": 38,
    "name": "Juan Aguirre",
    "primary": "Dirección",
    "secondary": [
      "Dirección de Arte"
    ],
    "skills": [
      "videoclip",
      "puesta en escena",
      "ficción",
      "publicidad"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a dirección y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "03 ago 2026"
  },
  {
    "id": 39,
    "name": "Elena Vargas",
    "primary": "Cámara",
    "secondary": [
      "Producción"
    ],
    "skills": [
      "documental",
      "gimbal",
      "foquista",
      "operación de cámara"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en cámara para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "04 ago 2026"
  },
  {
    "id": 40,
    "name": "Pedro Ríos",
    "primary": "Montaje / Edición",
    "secondary": [
      "Música",
      "Guion"
    ],
    "skills": [
      "ficción",
      "documental",
      "premiere",
      "davinci"
    ],
    "available": false,
    "students": true,
    "bio": "Realizador/a especializado/a en montaje / edición, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "05 ago 2026"
  },
  {
    "id": 41,
    "name": "Candela Silva",
    "primary": "Música",
    "secondary": [
      "Cámara"
    ],
    "skills": [
      "banda sonora",
      "producción musical",
      "soundtrack",
      "composición"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a música y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "06 ago 2026"
  },
  {
    "id": 42,
    "name": "Martín Domínguez",
    "primary": "Dirección de Fotografía",
    "secondary": [
      "Dirección de Arte"
    ],
    "skills": [
      "digital",
      "16mm",
      "cámara",
      "iluminación"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en dirección de fotografía para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "07 ago 2026"
  },
  {
    "id": 43,
    "name": "Josefina Cabral",
    "primary": "Producción",
    "secondary": [
      "Color"
    ],
    "skills": [
      "locaciones",
      "plan de rodaje",
      "logística",
      "presupuesto"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en producción, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "08 ago 2026"
  },
  {
    "id": 44,
    "name": "Leandro Ponce",
    "primary": "Color",
    "secondary": [
      "Guion",
      "Dirección de Fotografía"
    ],
    "skills": [
      "davinci resolve",
      "color grading",
      "finishing",
      "cine"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a color y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "09 ago 2026"
  },
  {
    "id": 45,
    "name": "Pilar Oliva",
    "primary": "Guion",
    "secondary": [
      "Cámara"
    ],
    "skills": [
      "comedia",
      "drama",
      "desarrollo de proyectos",
      "ficción"
    ],
    "available": false,
    "students": false,
    "bio": "Trabajo principalmente en guion para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "10 ago 2026"
  },
  {
    "id": 46,
    "name": "Manuel Núñez",
    "primary": "Dirección de Arte",
    "secondary": [
      "Montaje / Edición"
    ],
    "skills": [
      "vestuario",
      "publicidad",
      "escenografía",
      "utilería"
    ],
    "available": true,
    "students": true,
    "bio": "Realizador/a especializado/a en dirección de arte, con experiencia en rodajes de ficción, contenido digital y producciones autogestionadas.",
    "reel": "https://vimeo.com/",
    "updated": "11 ago 2026"
  },
  {
    "id": 47,
    "name": "Abril Barrera",
    "primary": "Montaje / Edición",
    "secondary": [
      "Dirección"
    ],
    "skills": [
      "davinci",
      "ficción",
      "documental",
      "premiere"
    ],
    "available": true,
    "students": true,
    "bio": "Perfil orientado a montaje / edición y desarrollo audiovisual. Interés en propuestas narrativas, rodajes cuidados y procesos de equipo.",
    "reel": "https://vimeo.com/",
    "updated": "12 ago 2026"
  },
  {
    "id": 48,
    "name": "Matías Campos",
    "primary": "Música",
    "secondary": [
      "Guion",
      "Dirección de Arte"
    ],
    "skills": [
      "composición",
      "banda sonora",
      "producción musical",
      "soundtrack"
    ],
    "available": true,
    "students": false,
    "bio": "Trabajo principalmente en música para ficción, publicidad y proyectos independientes. Me interesa el trabajo colaborativo y los equipos pequeños.",
    "reel": "https://vimeo.com/",
    "updated": "13 ago 2026"
  }
];


const app=document.getElementById('app');
const modal=document.getElementById('modal');
const backdrop=document.getElementById('modalBackdrop');
const modalContent=document.getElementById('modalContent');
const initials=n=>n.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();

document.getElementById('closeModalBtn').onclick=closeModal;
backdrop.onclick=closeModal;
document.getElementById('openAccountBtn').onclick=openAccount;
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});
document.querySelectorAll('[data-route]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();location.hash=a.dataset.route;}));
window.addEventListener('hashchange',router);

function router(){const route=location.hash.replace('#','')||'home'; if(route==='recursos') renderTemplate('resourcesTemplate'); else if(route==='formacion') renderTemplate('trainingTemplate'); else renderHome(); window.scrollTo({top:0,behavior:'instant'});}
function renderTemplate(id){app.innerHTML='';app.appendChild(document.getElementById(id).content.cloneNode(true));}
function renderHome(){
  app.innerHTML='';app.appendChild(document.getElementById('homeTemplate').content.cloneNode(true));
  const roleFilter=document.getElementById('roleFilter');roles.forEach(r=>roleFilter.insertAdjacentHTML('beforeend',`<option value="${r}">${r}</option>`));
  ['searchInput','roleFilter','availableFilter','studentFilter'].forEach(id=>document.getElementById(id).addEventListener('input',renderCards));
  document.getElementById('clearFiltersBtn').onclick=()=>{document.getElementById('searchInput').value='';roleFilter.value='';document.getElementById('availableFilter').checked=false;document.getElementById('studentFilter').checked=false;renderCards();};
  document.getElementById('createProfileBtn').onclick=()=>openEditor();renderCards();
}
function renderCards(){
  const q=(document.getElementById('searchInput')?.value||'').trim().toLowerCase();
  const role=document.getElementById('roleFilter')?.value||'';
  const avail=document.getElementById('availableFilter')?.checked||false;
  const students=document.getElementById('studentFilter')?.checked||false;
  const filtered=profiles.filter(p=>{const hay=[p.name,p.primary,...p.secondary,...p.skills,p.bio].join(' ').toLowerCase();return(!q||hay.includes(q))&&(!role||p.primary===role||p.secondary.includes(role))&&(!avail||p.available)&&(!students||p.students);});
  document.getElementById('resultsCount').textContent=filtered.length;
  const c=document.getElementById('cardsContainer'),empty=document.getElementById('emptyState');
  c.innerHTML=filtered.map(p=>`<article class="card" data-id="${p.id}" tabindex="0"><div><div class="card-index">RR / ${String(p.id).padStart(3,'0')}</div><div class="role">${p.primary}</div><div class="person">${p.name}</div><div class="secondary">${p.secondary.join(' · ')||p.skills.slice(0,2).join(' · ')}</div><div class="status-row">${p.available?'<span class="pill on">● Disponible</span>':'<span class="pill">No disponible</span>'}${p.students?'<span class="pill">Estudiantiles ✓</span>':''}</div></div><div class="avatar">${initials(p.name)}</div></article>`).join('');
  empty.classList.toggle('hidden',filtered.length>0);c.querySelectorAll('.card').forEach(el=>{const open=()=>openProfile(Number(el.dataset.id));el.onclick=open;el.onkeydown=e=>{if(e.key==='Enter')open();};});
}
function openProfile(id){
  const p=profiles.find(x=>x.id===id);if(!p)return;
  modalContent.innerHTML=`<div class="profile-top"><div class="profile-avatar">${initials(p.name)}</div><div><div class="profile-role">${p.primary}</div><div class="profile-name">${p.name}</div><div class="meta">${p.secondary.join(' · ')||'Perfil profesional'}</div></div></div>
  <section class="profile-section"><h4>Disponibilidad</h4><div class="status-row">${p.available?'<span class="pill on">● Disponible actualmente</span>':'<span class="pill">No disponible actualmente</span>'}${p.students?'<span class="pill">Acepta proyectos estudiantiles</span>':'<span class="pill">No acepta estudiantiles</span>'}</div></section>
  <section class="profile-section"><h4>Especialidades</h4><div class="status-row">${p.skills.map(s=>`<span class="pill">${s}</span>`).join('')}</div></section>
  <section class="profile-section"><h4>Perfil</h4><p>${p.bio}</p></section>
  <section class="profile-section"><h4>Reel / Portfolio</h4><a class="video-link" href="${p.reel}" target="_blank" rel="noopener">Ver material de trabajo →</a></section>
  <section class="profile-section"><h4>Contacto</h4><div class="contact-box"><p>La consulta se envía sin publicar datos privados del realizador.</p><div class="form-grid"><label>Tu nombre<input placeholder="Nombre y apellido"></label><label>Email de contacto<input type="email" placeholder="tu@email.com"></label><label>Proyecto<textarea placeholder="Contá brevemente de qué se trata la propuesta"></textarea></label><button class="primary" onclick="alert('Demo: la consulta quedaría lista para enviar por el sistema intermediado.')">Enviar consulta</button></div></div></section>
  <section class="profile-section"><div class="meta">Perfil actualizado por última vez: ${p.updated}</div></section>`;openModal();
}
function openEditor(existing=profiles[0]){
  modalContent.innerHTML=`<div class="eyebrow">MI PERFIL</div><h2>Editar perfil profesional</h2><div class="form-grid">
  <label>Nombre<input id="fName" value="${existing.name}"></label>
  <label>Rol principal<select id="fPrimary">${roles.map(r=>`<option ${r===existing.primary?'selected':''}>${r}</option>`).join('')}</select></label>
  <label>Roles secundarios<input id="fSecondary" value="${existing.secondary.join(', ')}" placeholder="Guion, Cámara, Color"></label>
  <label>Habilidades / palabras clave<input id="fSkills" value="${existing.skills?.join(', ')||''}" placeholder="gimbal, iluminación, documental…"></label>
  <label>Descripción breve · máx. 350 caracteres<textarea id="fBio" maxlength="350">${existing.bio}</textarea></label>
  <label>Link a reel / portfolio<input id="fReel" value="${existing.reel}"></label>
  <label>Foto de perfil<input type="file" accept="image/*"><small>En la versión final se guardará en Supabase Storage.</small></label>
  <label class="check"><input id="fAvailable" type="checkbox" ${existing.available?'checked':''}><span>Disponible actualmente</span></label>
  <label class="check"><input id="fStudents" type="checkbox" ${existing.students?'checked':''}><span>Acepto proyectos estudiantiles</span></label>
  </div><div class="form-actions"><button class="outline" id="cancelEdit">Cancelar</button><button class="primary" id="saveEdit">Guardar cambios</button></div>`;
  document.getElementById('cancelEdit').onclick=closeModal;document.getElementById('saveEdit').onclick=()=>{existing.name=document.getElementById('fName').value.trim()||existing.name;existing.primary=document.getElementById('fPrimary').value;existing.secondary=document.getElementById('fSecondary').value.split(',').map(x=>x.trim()).filter(Boolean);existing.skills=document.getElementById('fSkills').value.split(',').map(x=>x.trim()).filter(Boolean);existing.bio=document.getElementById('fBio').value.trim();existing.reel=document.getElementById('fReel').value.trim();existing.available=document.getElementById('fAvailable').checked;existing.students=document.getElementById('fStudents').checked;existing.updated='18 ago 2026';closeModal();renderHome();};openModal();
}
function openAccount(){
  modalContent.innerHTML=`<div class="eyebrow">CUENTA</div><h2>Ingresar a Red de Realizadores</h2><div class="account-tabs"><button class="active" id="loginTab">Ingresar</button><button id="registerTab">Crear cuenta</button></div><div id="accountBody"></div>`;
  const body=document.getElementById('accountBody');
  const showLogin=()=>{body.innerHTML=`<div class="form-grid"><label>Email<input type="email" placeholder="tu@email.com"></label><label>Contraseña<input type="password" placeholder="••••••••"></label><button class="primary" id="fakeLogin">Ingresar</button><button class="text-btn" id="changePass">Cambiar contraseña</button></div>`;document.getElementById('fakeLogin').onclick=()=>openEditor();document.getElementById('changePass').onclick=showPassword;};
  const showRegister=()=>{body.innerHTML=`<div class="form-grid"><label>Email<input type="email"></label><label>Contraseña<input type="password"></label><label>Repetir contraseña<input type="password"></label><button class="primary" id="fakeRegister">Crear cuenta y perfil</button></div>`;document.getElementById('fakeRegister').onclick=()=>openEditor({id:99,name:'Nuevo realizador',primary:'Dirección',secondary:[],skills:[],available:true,students:true,bio:'',reel:'',updated:'18 ago 2026'});};
  const showPassword=()=>{body.innerHTML=`<div class="form-grid"><label>Contraseña actual<input type="password"></label><label>Nueva contraseña<input type="password"></label><label>Repetir nueva contraseña<input type="password"></label><button class="primary" onclick="alert('Demo: contraseña actualizada')">Actualizar contraseña</button></div>`;};
  document.getElementById('loginTab').onclick=()=>{document.getElementById('loginTab').classList.add('active');document.getElementById('registerTab').classList.remove('active');showLogin();};
  document.getElementById('registerTab').onclick=()=>{document.getElementById('registerTab').classList.add('active');document.getElementById('loginTab').classList.remove('active');showRegister();};showLogin();openModal();
}
function openModal(){modal.classList.remove('hidden');backdrop.classList.remove('hidden');document.body.style.overflow='hidden';}
function closeModal(){modal.classList.add('hidden');backdrop.classList.add('hidden');document.body.style.overflow='';}
window.closeModal=closeModal;router();
