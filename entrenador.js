const showOption = (option) => {
    const options = document.querySelectorAll('.items');
    options.forEach((item, index) => {
        item.style.display = index === option - 1 ? 'block' : 'none';
    });

    // Cargar eventos si se selecciona la opción 1
    if (option === 1) {
        // Cargar eventos al mostrar la sección de eventos
    }
};


const cerrarSesion = () => {
    localStorage.removeItem('datos_auth');

    alert("Has cerrado sesión exitosamente");
    
    // Redirigir al usuario a la página de inicio o página de inicio de sesión
    window.location.href = "../html/login.html"; 
}

// Obtenemos todas las inscripciones del JSON
const ObtenerInscripcionesJson = async () => {
    const url = 'https://api.jsonbin.io/v3/b/67008e81e41b4d34e43d2460';
    try {
        const response = await fetch(url); 
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del archivo JSON');
        }

        const data = await response.json(); // Renombrado para mayor claridad
        const inscripciones = data.record; // Accedemos a la lista de inscripciones

        return inscripciones; // Devolvemos la lista de inscripciones
    } catch (error) {
        console.error('Error al cargar el archivo inscripciones.json:', error);
        return [];
    }
};

const filtrarInscripcionesActividad = async () => {
    try {
        // Primero obtenemos los datos del entrenador auth
        const userData = JSON.parse(localStorage.getItem('datos_auth'));
        if (!userData || !userData.actividad) {
            throw new Error("No se pudo obtener la actividad asignada.");
        }

        const actividadAsignada = userData.actividad;

        // Obtener inscripciones
        const inscripciones = await ObtenerInscripcionesJson();
        
        // Filtrar inscripciones usando un bucle for
        const inscripcionesFiltradas = [];
        for (let i = 0; i < inscripciones.length; i++) {
            const inscripcion = inscripciones[i];
            if (inscripcion.actividad === actividadAsignada) {
                inscripcionesFiltradas.push(inscripcion);
            }
        }

        // Llamar a la función para mostrar las inscripciones filtradas en la tabla
        mostrarInscripciones(inscripcionesFiltradas, actividadAsignada);

    } catch (error) {
        console.error("Error al filtrar inscripciones:", error);
        // Manejo adicional de errores según sea necesario
    }
};

// Nueva función para mostrar inscripciones en la tabla
const mostrarInscripciones = (inscripcionesFiltradas, actividadAsignada) => {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Limpiar el contenido anterior

    // Crear HTML para las inscripciones filtradas
    let filas = "";
    inscripcionesFiltradas.forEach(inscripcion => {
        filas += `
            <tr>
                <td>${inscripcion.nombre}</td>
                <td>${inscripcion.correo}</td>
                <td>${inscripcion.fecha}</td>
            </tr>
        `;
    });

    // Inyectar las filas en el cuerpo de la tabla
    tableBody.innerHTML = filas;

    // Actualizar el nombre de la actividad
    document.getElementById("actividadNombre").textContent = actividadAsignada;
};

const AgregarInscripcionEntrenador = () => {
    // Obtener los datos del formulario
    const actividad =  document.getElementById('NameActividad').value;
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const fecha = document.getElementById('fecha').value.trim();

    if (actividad === "" || nombre === "" || correo === "" || fecha === "") {
        alert("Todos los campos son obligatorios");
        return;
    };

    const inscripcion = {
        actividad: actividad,
        nombre: nombre,
        email: correo,
        fecha: fecha
    }

    // Obtener las inscripciones del localStorage
    let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    inscripciones.push(inscripcion); // Agregar la nueva inscripción
    localStorage.setItem('inscripciones', JSON.stringify(inscripciones)); // Guardar la lista actualizada en localStorage

    alert("Usuario inscrito correctamente");
    // Limpiar el formulario
    document.getElementById('inscripcionForm').reset();

     // Mostrar inscripciones actualizadas
    verInscripciones();
}  

/// Función para ver las inscripciones
const verInscripciones = () => {
    const actividadAsignada = document.getElementById("NameActividad").value; // Obtener la actividad asignada
    const listaInscripciones = document.getElementById('listaInscripciones'); // Lista de inscripciones
    const numeroInscripciones = document.getElementById('numeroInscripciones').value; // Obtener el número de inscripciones seleccionadas 

    // Limpiar la lista anterior
    listaInscripciones.innerHTML = "";

    // Obtener las inscripciones del localStorage
    let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    
    // Filtrar inscripciones por actividad asignada
    const inscripcionesFiltradas = inscripciones.filter(inscripcion => 
        inscripcion.actividad === actividadAsignada
    );

    // Tomar las últimas inscripciones según la selección
    const ultimasInscripciones = inscripcionesFiltradas.slice(-numeroInscripciones);

    // Mostrar inscripciones
    if (ultimasInscripciones.length === 0) {
        listaInscripciones.innerHTML = "<li>No hay inscripciones para esta actividad.</li>";
    } else {
        ultimasInscripciones.forEach(inscripcion => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `${inscripcion.nombre} - ${inscripcion.email} 
                <button onclick="eliminarInscripcion('${inscripcion.email}')">Eliminar</button>`;
            listaInscripciones.appendChild(listItem);
        });
    }
};
// Función para eliminar una inscripción
const eliminarInscripcion = (email) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta inscripción?");
    if (!confirmacion) return; // Si el usuario cancela, salir de la función

    let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    // Filtrar las inscripciones para eliminar la seleccionada
    inscripciones = inscripciones.filter(inscripcion => inscripcion.email !== email);

    localStorage.setItem('inscripciones', JSON.stringify(inscripciones));

    verInscripciones(); // Actualizar la lista de inscripciones
};

let novedadesAbiertas = false; // Variable para controlar el estado de las novedades

// Función para ver/cerrar novedades
const VerNovedades = () => {
    const actividadAsignada = document.getElementById("NameActividad").value; // Obtener la actividad asignada
    const listaNovedades = document.getElementById('listaNovedades'); // Asegúrate de usar el ID correcto
    const botonNovedades = document.getElementById('btnVerNovedades'); // Obtener el botón
    const contenedor = document.getElementById('novedadesEntrenador'); // Contenedor de novedades

    // Limpiar la lista anterior
    listaNovedades.innerHTML = "";

    // Obtener las inscripciones del localStorage
    let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    
    // Filtrar inscripciones por actividad asignada
    const inscripcionesFiltradas = inscripciones.filter(inscripcion => 
        inscripcion.actividad === actividadAsignada
    );

    // Mostrar las novedades de inscripciones
    if (inscripcionesFiltradas.length === 0) {
        listaNovedades.innerHTML += "<li>No hay inscripciones nuevas para esta actividad.</li>";
    } else {
        // Tomar las últimas 2 inscripciones
        const ultimasInscripciones = inscripcionesFiltradas.slice(-2);
        
        // Agregar las inscripciones a la lista con contenido
        ultimasInscripciones.forEach(inscripcion => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>Nuevo usuario inscrito:</strong> ${inscripcion.nombre} - ${inscripcion.email}`;
            listaNovedades.appendChild(listItem);
        });
    }

    // Mostrar novedades de eventos
    const eventos = JSON.parse(localStorage.getItem('eventos')) || []; // Obtener eventos desde localStorage
    const eventosFiltrados = eventos.filter(evento => 
        evento.actividad === actividadAsignada
    );

    // Mostrar las novedades de eventos
    if (eventosFiltrados.length === 0) {
        listaNovedades.innerHTML += "<li>No hay eventos nuevos para esta actividad.</li>";
    } else {
        // Tomar los últimos 2 eventos
        const ultimosEventos = eventosFiltrados.slice(-2);
        
        // Agregar los eventos a la lista con contenido
        ultimosEventos.forEach(evento => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>Nuevo evento agregado:</strong> ${evento.nombre} - ${evento.fecha}`;
            listaNovedades.appendChild(listItem);
        });
    }

    // Alternar la visibilidad de las novedades
    if (novedadesAbiertas) {
        contenedor.style.display = 'none'; // Ocultar novedades
        botonNovedades.textContent = 'Ver Novedades'; // Cambiar el texto del botón
    } else {
        contenedor.style.display = 'block'; // Mostrar novedades
        botonNovedades.textContent = 'Cerrar Novedades'; // Cambiar el texto del botón
    }

    novedadesAbiertas = !novedadesAbiertas; // Cambiar el estado
};


// Obtenemos todos los eventos del JSON
const ObtenerEventosJson = async () => {
    const url = 'https://api.jsonbin.io/v3/b/67008e69e41b4d34e43d2457';
    try {
        const response = await fetch(url); 
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del archivo JSON');
        }

        const data = await response.json(); // Renombrado para mayor claridad
        const eventos = data.record; // Accedemos a la lista de eventos

        console.log(eventos); // Opcional: para depuración
        return eventos; // Devolvemos la lista de eventos
    } catch (error) {
        console.error('Error al cargar el archivo eventos.json:', error);
        return [];
    }
};

const filtrarEventosActividad = async () => {
    try {
        // Primero obtenemos los datos del entrenador auth
        const userData = JSON.parse(localStorage.getItem('datos_auth'));
        if (!userData || !userData.actividad) {
            throw new Error("No se pudo obtener la actividad asignada.");
        }

        const actividadAsignada = userData.actividad;

        // Obtener eventos
        const eventos = await ObtenerEventosJson();
        // Filtrar eventos usando un bucle for
        const eventosFiltrados = []; // Cambié el nombre a eventosFiltrados para evitar conflictos
        for (let i = 0; i < eventos.length; i++) {
            const evento = eventos[i]; // Renombré la variable a evento
            if (evento.actividad === actividadAsignada) {
                eventosFiltrados.push(evento);
            }
        }

        // Llamar a la función para mostrar los eventos filtrados en la tabla
        mostrarEventos(eventosFiltrados, actividadAsignada);

    } catch (error) {
        console.error("Error al filtrar eventos:", error);
        // Manejo adicional de errores según sea necesario
    }
};

const mostrarEventos = (eventosFiltrados, actividadAsignada) => {
    const tableBody = document.getElementById("tableBodyEvent");
    tableBody.innerHTML = ""; // Limpiar el contenido anterior

    // Crear HTML para los eventos filtrados
    let filas = "";
    eventosFiltrados.forEach(evento => { // Cambié a evento
        filas += `
            <tr>
                <td>${evento.nombre}</td>
                <td>${evento.ubicacion}</td>
                <td>${evento.fecha}</td>
                <td>${evento.hora}</td>
            </tr>
        `;
    });

    // Inyectar las filas en el cuerpo de la tabla
    tableBody.innerHTML = filas;

    // Actualizar el nombre de la actividad
    document.getElementById("actividadNombre").textContent = actividadAsignada;
};

const agregarEvento = ()=> {
    const actividad = document.getElementById("NameActividad").value;
    const eventName = document.getElementById('event-name').value.trim();
    const eventDate = document.getElementById('event-date').value.trim();
    const eventTime = document.getElementById('event-time').value.trim();
    const eventLocation = document.getElementById('event-location').value.trim();

    if (!eventName ||!eventDate ||!eventTime ||!eventLocation) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    const evento = {
        nombre: eventName,
        fecha: eventDate,
        hora: eventTime,
        ubicacion: eventLocation,
        actividad: actividad
    }

    // Obtener eventos desde localStorage
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    eventos.push(evento);
    localStorage.setItem('eventos', JSON.stringify(eventos));

    alert("Evento correctamente creado")

    limpiar();

    
};

const limpiar = ()=> {
     document.getElementById('event-name').value = "";
    document.getElementById('event-date').value = "";
   document.getElementById('event-time').value = "";
   document.getElementById('event-location') = "";
};

// Función para ver los eventos
const verEventos = () => {
    const actividadAsignada = document.getElementById("NameActividad").value; // Obtener la actividad asignada
    const listaEventos = document.getElementById('listaEventos'); // Lista de eventos
    const numeroEventos = parseInt(document.getElementById('numeroEventos').value); // Obtener el número de eventos seleccionados 

    // Limpiar la lista anterior
    listaEventos.innerHTML = "";

    // Obtener los eventos del localStorage
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    
    // Filtrar eventos por actividad asignada
    const eventosFiltrados = eventos.filter(evento => evento.actividad === actividadAsignada);

    // Tomar los últimos eventos según la selección
    const ultimosEventos = eventosFiltrados.slice(-numeroEventos);

    // Mostrar eventos
    if (ultimosEventos.length === 0) {
        listaEventos.innerHTML = "<li>No hay eventos registrados para esta actividad.</li>";
    } else {
        ultimosEventos.forEach(evento => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `${evento.nombre} - ${evento.fecha} - ${evento.hora} - ${evento.ubicacion}
                <button onclick="eliminarEvento('${evento.nombre}')">Eliminar</button>`;
            listaEventos.appendChild(listItem);
        });
    }
};
// Función para eliminar un evento (puedes implementar esta función)
const eliminarEvento = (nombreEvento) => {
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    eventos = eventos.filter(evento => evento.nombre !== nombreEvento);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    verEventos(); // Volver a mostrar la lista actualizada
};



window.onload = function() {
    const userData = JSON.parse(localStorage.getItem('datos_auth'));

    // Redirigir si no hay sesión o si el rol del usuario no es administrador
    if (!userData || userData.role !== "entrenador") {
        alert('Acceso denegado. Debes iniciar sesión como administrador para acceder a esta página.');
        window.location.href = "../html/login.html"; 
    } else {
        // Mostrar bienvenida al usuario si es administrador
        document.getElementById("welcome").innerHTML = "Bienvenido, " + userData.nombre;
        document.getElementById("actividad").innerHTML = "Docente de " + userData.actividad;
        document.getElementById("NameActividad").value = userData.actividad; 
       filtrarInscripcionesActividad();
       VerNovedades();
       filtrarEventosActividad();
    }
};