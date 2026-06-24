/* 

  Este archivo contiene la lógica principal del proyecto:
  - Renderizado dinámico del menú
  - Filtros por categoría
  - Validación del formulario
  - Registro de reservas en tabla
  - Actualización del resumen dinámico
*/

// Array obligatorio del menú.
// Según las instrucciones del caso, estos datos no deben modificarse.
const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',   precio: 4500,  categoria: 'Entrada'       },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'       },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',      precio: 15500, categoria: 'Plato Fuerte'  },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte'  },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte'  },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',         precio: 5200,  categoria: 'Postre'        },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'        },
];

/*
  Objeto utilizado para asociar una imagen a cada platillo.

  Se declara por separado para respetar la indicación de no modificar
  los datos originales del array menu.
*/
const imagenesMenu = {
  'Bruschetta Clásica': 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=80',
  'Tabla de Quesos': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80',
  'Lomo al Vino Tinto': 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80',
  'Pasta Carbonara': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=900&q=80',
  'Salmón a la Plancha': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80',
  'Tiramisú': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80',
  'Cheesecake de Maracuyá': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80',
};

// Array auxiliar donde se almacenan las reservas agregadas por el usuario.
const reservas = [];
// Límite máximo de personas permitidas por cada fecha y hora.
const LIMITE_PERSONAS_POR_HORARIO = 10;

/*
  Función de apoyo: obtenerPersonasReservadas(fecha, hora)

  Calcula cuántas personas ya están registradas en una fecha y hora específicas.
  Esto permite controlar que no se sobrepase el límite permitido.
*/
function obtenerPersonasReservadas(fecha, hora) {
  return reservas
    .filter((reserva) => reserva.fecha === fecha && reserva.hora === hora)
    .reduce((total, reserva) => total + reserva.personas, 0);
}

/*
  Función de apoyo: obtenerCuposDisponibles(fecha, hora)

  Retorna cuántos espacios quedan disponibles para una fecha y hora específicas.
*/
function obtenerCuposDisponibles(fecha, hora) {
  const personasYaReservadas = obtenerPersonasReservadas(fecha, hora);
  return LIMITE_PERSONAS_POR_HORARIO - personasYaReservadas;
}
// Variable que controla la categoría actualmente seleccionada en el menú.
let categoriaActiva = 'Todos';

/*
  Función formatearPrecio(precio)

  Recibe un número y lo convierte al formato de moneda costarricense.
  Esto permite mostrar los precios de una forma más clara para el usuario.
*/
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(precio);
}

/*
  Función crearElemento(etiqueta, clase, texto)

  Crea elementos HTML de forma más ordenada.
  Se usa para evitar repetir varias veces document.createElement.
*/
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);

  if (clase) {
    elemento.className = clase;
  }

  if (texto) {
    elemento.textContent = texto;
  }

  return elemento;
}

/*
  Función obligatoria: renderMenu()

  Esta función muestra los platillos en pantalla.
  Las cards se generan completamente desde JavaScript utilizando createElement,
  por lo que no existen cards escritas manualmente en el HTML.
*/
function renderMenu() {
  const contenedorMenu = document.getElementById('contenedor-menu');

  // Limpia el contenido anterior antes de volver a pintar el menú.
  contenedorMenu.textContent = '';

  // Si la categoría activa es "Todos", se muestra todo el menú.
  // En caso contrario, se filtra según la categoría seleccionada.
  const platosFiltrados = categoriaActiva === 'Todos'
    ? menu
    : menu.filter((plato) => plato.categoria === categoriaActiva);

  platosFiltrados.forEach((plato) => {
    const columna = crearElemento('div', 'col-md-6 col-lg-4');
    const card = crearElemento('article', 'card-plato');

    const imagen = document.createElement('img');
    imagen.src = imagenesMenu[plato.nombre];
    imagen.alt = `Imagen de ${plato.nombre}`;
    imagen.className = 'imagen-plato';
    imagen.loading = 'lazy';

    const categoria = crearElemento('span', 'categoria-plato', plato.categoria);
    const nombre = crearElemento('h3', '', plato.nombre);
    const descripcion = crearElemento('p', '', plato.descripcion);
    const precio = crearElemento('p', 'precio-plato', formatearPrecio(plato.precio));

    card.appendChild(imagen);
    card.appendChild(categoria);
    card.appendChild(nombre);
    card.appendChild(descripcion);
    card.appendChild(precio);

    columna.appendChild(card);
    contenedorMenu.appendChild(columna);
  });
}

/*
  Función obligatoria: filtrarCategoria(categoria)

  Cambia la categoría activa y vuelve a renderizar el menú.
  También actualiza la apariencia del botón seleccionado.
*/
function filtrarCategoria(categoria) {
  categoriaActiva = categoria;

  const botones = document.querySelectorAll('.btn-filtro');

  botones.forEach((boton) => {
    boton.classList.toggle('activo', boton.dataset.categoria === categoria);
  });

  renderMenu();
}

/*
  Función formatearPrecio(precio)

  Formatea el precio para mostrarlo en el formato deseado.
*/
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(precio);
}

/*
  Función crearElemento(etiqueta, clase, texto)

  Crea un elemento HTML con la etiqueta, clase y texto especificados.
*/
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;

  if (texto) {
    elemento.textContent = texto;
  }

  return elemento;
}

/*
  Función obligatoria: renderMenu()

  Esta función muestra los platillos en pantalla.
  Las cards se generan completamente desde JavaScript utilizando createElement,
  por lo que no existen cards escritas manualmente en el HTML.
*/
function renderMenu() {
  const contenedorMenu = document.getElementById('contenedor-menu');

  // Limpia el contenido anterior antes de volver a pintar el menú.
  contenedorMenu.textContent = '';

  // Si la categoría activa es "Todos", se muestra todo el menú.
  // En caso contrario, se filtra según la categoría seleccionada.
  const platosFiltrados = categoriaActiva === 'Todos'
    ? menu
    : menu.filter((plato) => plato.categoria === categoriaActiva);

  platosFiltrados.forEach((plato) => {
    const columna = crearElemento('div', 'col-md-6 col-lg-4');
    const card = crearElemento('article', 'card-plato');

    const imagen = document.createElement('img');
    imagen.src = imagenesMenu[plato.nombre];
    imagen.alt = `Imagen de ${plato.nombre}`;
    imagen.className = 'imagen-plato';
    imagen.loading = 'lazy';

    const categoria = crearElemento('span', 'categoria-plato', plato.categoria);
    const nombre = crearElemento('h3', '', plato.nombre);
    const descripcion = crearElemento('p', '', plato.descripcion);
    const precio = crearElemento('p', 'precio-plato', formatearPrecio(plato.precio));

    card.appendChild(imagen);
    card.appendChild(categoria);
    card.appendChild(nombre);
    card.appendChild(descripcion);
    card.appendChild(precio);

    columna.appendChild(card);
    contenedorMenu.appendChild(columna);
  });
}

/*
  Función obligatoria: filtrarCategoria(categoria)

  Cambia la categoría activa y vuelve a renderizar el menú.
  También actualiza la apariencia del botón seleccionado.
*/
function filtrarCategoria(categoria) {
  categoriaActiva = categoria;

  const botones = document.querySelectorAll('.btn-filtro');

  botones.forEach((boton) => {
    boton.classList.toggle('activo', boton.dataset.categoria === categoria);
  });

  renderMenu();
}

/*
  Función de apoyo: mostrarError(idCampo, mensaje)

  Muestra el mensaje de error correspondiente debajo de cada input.
  Además, agrega una clase visual al campo inválido.
*/
function mostrarError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  const error = document.getElementById(`error-${idCampo}`);

  error.textContent = mensaje;
  campo.classList.toggle('campo-invalido', mensaje !== '');
}

/*
  Función obligatoria: validarFormulario()

  Valida todos los campos obligatorios del formulario.
  El botón de envío se habilita únicamente cuando todos los datos son válidos.
*/
function validarFormulario() {
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const personas = Number(document.getElementById('personas').value);
  const botonReservar = document.getElementById('btn-reservar');

  let formularioValido = true;

  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nombre === '') {
    mostrarError('nombre', 'El nombre completo es obligatorio.');
    formularioValido = false;
  } else if (nombre.length < 5) {
    mostrarError('nombre', 'El nombre debe tener mínimo 5 caracteres.');
    formularioValido = false;
  } else if (!regexNombre.test(nombre)) {
    mostrarError('nombre', 'El nombre solo puede contener letras y espacios.');
    formularioValido = false;
  } else {
    mostrarError('nombre', '');
  }

  if (correo === '') {
    mostrarError('correo', 'El correo electrónico es obligatorio.');
    formularioValido = false;
  } else if (!regexCorreo.test(correo)) {
    mostrarError('correo', 'Ingrese un correo electrónico válido.');
    formularioValido = false;
  } else {
    mostrarError('correo', '');
  }

  if (fecha === '') {
    mostrarError('fecha', 'La fecha de reserva es obligatoria.');
    formularioValido = false;
  } else {
    const fechaSeleccionada = new Date(`${fecha}T00:00:00`);
    const fechaActual = new Date();

    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
      mostrarError('fecha', 'La fecha no puede ser pasada.');
      formularioValido = false;
    } else {
      mostrarError('fecha', '');
    }
  }

  if (hora === '') {
    mostrarError('hora', 'Seleccione una hora para la reserva.');
    formularioValido = false;
  } else {
    mostrarError('hora', '');
  }

  if (!personas) {
    mostrarError('personas', 'El número de personas es obligatorio.');
    formularioValido = false;
  } else if (personas < 1) {
    mostrarError('personas', 'La reserva debe ser mínimo para 1 persona.');
    formularioValido = false;
  } else if (personas > LIMITE_PERSONAS_POR_HORARIO) {
    mostrarError(
      'personas',
      `No se puede registrar una reserva de más de ${LIMITE_PERSONAS_POR_HORARIO} personas.`
    );
    formularioValido = false;
  } else if (fecha !== '' && hora !== '') {
    const cuposDisponibles = obtenerCuposDisponibles(fecha, hora);

    if (personas > cuposDisponibles) {
      mostrarError(
        'personas',
        `Para el ${fecha} a las ${hora} solo quedan ${cuposDisponibles} cupos disponibles. El límite es de ${LIMITE_PERSONAS_POR_HORARIO} personas por horario.`
      );
      formularioValido = false;
    } else {
      mostrarError(
        'personas',
        `Cupos disponibles para ese horario: ${cuposDisponibles}.`
      );
    }
  } else {
    mostrarError('personas', '');
  }

  botonReservar.disabled = !formularioValido;

  return formularioValido;
}

/*
  Función obligatoria: agregarReserva()

  Agrega una nueva fila a la tabla si el formulario es válido.
  También guarda la información en el array reservas.
*/
function agregarReserva() {
  if (!validarFormulario()) {
    document.getElementById('mensaje-confirmacion').textContent =
      'No se pudo registrar la reserva. Revise los mensajes del formulario.';
    return;
  }

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const personas = Number(document.getElementById('personas').value);

  const cuposDisponibles = obtenerCuposDisponibles(fecha, hora);

  if (personas > cuposDisponibles) {
    document.getElementById('mensaje-confirmacion').textContent =
      `No se pudo registrar la reserva. Para el ${fecha} a las ${hora} solo quedan ${cuposDisponibles} cupos disponibles.`;

    return;
  }

  const nuevaReserva = {
    nombre,
    correo,
    fecha,
    hora,
    personas,
  };

  reservas.push(nuevaReserva);

  const cuerpoTabla = document.getElementById('tabla-reservas-body');
  const fila = crearElemento('tr', 'fila-reserva');

  if (personas >= 6) {
    fila.classList.add('reserva-grupo-grande');
  }

  const datosFila = [nombre, correo, fecha, hora, personas.toString()];

  datosFila.forEach((dato) => {
    const celda = crearElemento('td', '', dato);
    fila.appendChild(celda);
  });

  cuerpoTabla.appendChild(fila);

  actualizarResumen();

  const cuposRestantes = obtenerCuposDisponibles(fecha, hora);

  document.getElementById('form-reserva').reset();
  document.getElementById('btn-reservar').disabled = true;

  document.getElementById('mensaje-confirmacion').textContent =
    `Reserva registrada correctamente. Para el ${fecha} a las ${hora} quedan ${cuposRestantes} cupos disponibles.`;
}

/*
  Función obligatoria: actualizarResumen()

  Calcula y muestra información general sobre las reservas registradas.
*/
function actualizarResumen() {
  const contenedorResumen = document.getElementById('resumen-reservas');

  contenedorResumen.textContent = '';

  const totalReservas = reservas.length;

  const totalPersonas = reservas.reduce((total, reserva) => {
    return total + reserva.personas;
  }, 0);

  const reservaMayor = reservas.reduce((mayor, reserva) => {
    if (!mayor || reserva.personas > mayor.personas) {
      return reserva;
    }

    return mayor;
  }, null);

  const textoTotalReservas = crearElemento(
    'p',
    '',
    `Total de reservas registradas: ${totalReservas}`
  );

  const textoTotalPersonas = crearElemento(
    'p',
    '',
    `Total de personas esperadas: ${totalPersonas}`
  );

  const textoReservaMayor = crearElemento(
    'p',
    '',
    reservaMayor
      ? `Reserva con mayor número de personas: ${reservaMayor.nombre} (${reservaMayor.personas} personas)`
      : 'Reserva con mayor número de personas: todavía no hay reservas'
  );

  contenedorResumen.appendChild(textoTotalReservas);
  contenedorResumen.appendChild(textoTotalPersonas);
  contenedorResumen.appendChild(textoReservaMayor);
}

/*

  Cuando el DOM está completamente cargado realiza las siguientes acciones:
  - Se renderiza el menú.
  - Se inicializa el resumen.
  - Se activan los eventos de los botones de filtro.
  - Se activan las validaciones del formulario.
*/
document.addEventListener('DOMContentLoaded', function () {
  renderMenu();
  actualizarResumen();

  const botonesFiltro = document.querySelectorAll('.btn-filtro');

  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', function () {
      filtrarCategoria(boton.dataset.categoria);
    });
  });

  const formulario = document.getElementById('form-reserva');

  const camposValidables = [
    'nombre',
    'correo',
    'fecha',
    'hora',
    'personas',
  ];

  camposValidables.forEach((idCampo) => {
    document.getElementById(idCampo).addEventListener('input', function () {
      document.getElementById('mensaje-confirmacion').textContent = '';
      validarFormulario();
    });

    document.getElementById(idCampo).addEventListener('change', function () {
      document.getElementById('mensaje-confirmacion').textContent = '';
      validarFormulario();
    });
  });

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    agregarReserva();
  });
});