// Función para mostrar las diferentes opciones del menú
const showOption = (option) => {
    const options = ['option1', 'option2', 'option3', 'option4', 'option5','option6'];
    options.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    const selectedOption = document.getElementById(`option${option}`);
    if (selectedOption) selectedOption.style.display = 'block';

    // Inicializa el calendario solo si estamos en la opción 1 (Eventos)
    if (option === 1 && !window.calendarInitialized) {
        window.calendarInitialized = true;
    }
};

// Función para agregar evento
const AgregarEvento = () => {
    const fecha = document.getElementById('event-date').value;
    const hora = document.getElementById('event-time').value;
    const nombre = document.getElementById('event-name').value.trim();
    const ubicacion = document.getElementById('event-ubicacion').value.trim();
    const actividad = document.getElementById('event-activity').value;

    // Verificación de campos
    if (fecha === "" || hora === "" || nombre === "" || actividad === "" || ubicacion === "") {
        alert("Todos los campos son obligatorios");
        return; // Detener la función si falta algún campo
    }

    const evento = {
        fecha: fecha,
        hora: hora,
        nombre: nombre,
        ubicacion: ubicacion,
        actividad: actividad
    };

    // Guardar en localStorage
    let eventos = JSON.parse(localStorage.getItem('eventos')) || []; // Obtener la lista de eventos guardados
    eventos.push(evento); // Agregar el nuevo evento
    localStorage.setItem('eventos', JSON.stringify(eventos)); // Guardar la lista actualizada en localStorage

    alert('Evento guardado exitosamente');
    MostrarUltimosEventos();

}

const MostrarUltimosEventos = () => {
    const contenedor = document.getElementById('MostrarUltimosEventos');
    const boton = document.getElementById('Mostrar');
    
    // Si el contenedor ya tiene contenido (eventos mostrados), ocultamos los eventos
    if (contenedor.innerHTML !== "") {
        contenedor.innerHTML = ""; 
        boton.textContent = "Mostrar Últimos Eventos"; // Cambiar el texto del botón
        return; // Salir de la función
    }
    
    // Obtenemos los últimos eventos cargados del localStorage
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const CantidadEventosMinimo = 3;

    // Determinamos cuántos eventos mostrar (máximo 3)
    const cantidadEventos = eventos.length < CantidadEventosMinimo ? eventos.length : CantidadEventosMinimo;

    // Usamos un bucle para iterar sobre los últimos 'cantidadEventos' eventos
    for (let i = eventos.length - cantidadEventos; i < eventos.length; i++) {
        const evento = eventos[i];

        // Crear y mostrar los eventos en HTML
        const eventoHTML = `
            <div>
                <h1> Información </h1>
                <p><strong>Fecha:</strong> ${evento.fecha}</p>
                <p><strong>Hora:</strong> ${evento.hora}</p>
                <p><strong>Nombre:</strong> ${evento.nombre}</p>
                <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>
                <p><strong>Actividad:</strong> ${evento.actividad}</p>
                <button class="btnEliminar" onclick="eliminarEvento(${i})">Eliminar</button>
                <hr>
            </div>
        `;

        // Insertar el HTML en el contenedor
        contenedor.innerHTML += eventoHTML;
    }
    
    // Cambiar el texto del botón
    boton.textContent = "Cerrar Eventos";
};

// Función para eliminar un evento
const eliminarEvento = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos.splice(index, 1);
        localStorage.setItem('eventos', JSON.stringify(eventos));
        MostrarUltimosEventos();
    }
};

let eventosGlobales = [];

// Cargar eventos desde el archivo JSON
const ObtenerEventosJson = async () => {
    const url_json = 'https://api.jsonbin.io/v3/b/67008e69e41b4d34e43d2457';
    try {
        const response = await fetch(url_json);
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.status);
        }

        const eventos = await response.json();

        const eventosLista = eventos.record; // Accedemos a la lista de eventos

        eventosGlobales = eventosLista; // Almacenar eventos globales
        LlenarTabla(eventosGlobales); // Llamar a la función para llenar la tabla
        return eventosLista; // Regresamos la lista de eventos
    } catch (error) {
        console.error('Error al cargar el archivo eventos.json:', error);
        return [];
    }
};

// Función para llenar la tabla con eventos
const LlenarTabla = (eventos) => {
    const tbody = document.querySelector('#event-table tbody'); // Seleccionar el cuerpo de la tabla
    tbody.innerHTML = ''; // Limpiar el contenido existente

    // Iterar sobre los eventos y crear filas
    eventos.forEach(evento => {
        const row = document.createElement('tr'); // Crear una nueva fila
        row.innerHTML = `
            <td>${evento.fecha}</td>
            <td>${evento.hora}</td>
            <td>${evento.nombre}</td>
            <td>${evento.ubicacion}</td>
            <td>${evento.actividad}</td>
        `;
        tbody.appendChild(row); // Agregar la fila al cuerpo de la tabla
    });
};

let inscripcionesGlobales = []; // Variable para almacenar inscripciones

// Función para cargar inscripciones desde el archivo JSON
const ObtenerInscripcionesJson = async () => {
    const url_json = 'https://api.jsonbin.io/v3/b/67008e81e41b4d34e43d2460';
    try {
        const response = await fetch(url_json);
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del archivo JSON'); 
        }

        const inscripciones = await response.json();

        const inscripcionesLista = inscripciones.record; // Accedemos a la lista de inscripciones

        inscripcionesGlobales = inscripcionesLista; // Almacenar inscripciones globales
        LlenarTablaInscripciones(inscripcionesGlobales); // Llamar a la función para llenar la tabla
    } catch (error) {
        console.error('Error al cargar el archivo inscripciones.json:', error);
    }
};

// Función para llenar la tabla con inscripciones
const LlenarTablaInscripciones = (inscripciones) => {
    const tbody = document.querySelector('#inscripciones-table tbody'); // Seleccionar el cuerpo de la tabla
    tbody.innerHTML = ''; // Limpiar contenido existente

    // Iterar sobre las inscripciones y crear filas
    inscripciones.forEach(inscripcion => {
        const row = document.createElement('tr'); // Crear nueva fila
        row.innerHTML = `
            <td>${inscripcion.actividad}</td>
            <td>${inscripcion.nombre}</td>
            <td>${inscripcion.correo}</td>
            <td>${inscripcion.fecha}</td>
        `;
        tbody.appendChild(row); // Agregar fila al cuerpo de la tabla
    });
};

// Función para filtrar inscripciones según la actividad seleccionada
const FiltrarInscripciones = () => {
    const actividadSeleccionada = document.getElementById('actividad-select').value; // Obtener valor del select
    const tbody = document.querySelector('#inscripciones-table tbody'); // Seleccionar el cuerpo de la tabla
    tbody.innerHTML = ''; // Limpiar contenido existente

    // Iterar sobre las inscripciones y filtrar según la actividad seleccionada
    inscripcionesGlobales.forEach(inscripcion => {
        if (actividadSeleccionada === 'todos' || inscripcion.actividad === actividadSeleccionada) {
            const row = document.createElement('tr'); // Crear nueva fila
            row.innerHTML = `
                <td>${inscripcion.actividad}</td>
                <td>${inscripcion.nombre}</td>
                <td>${inscripcion.correo}</td>
                <td>${inscripcion.fecha}</td>
            `;
            tbody.appendChild(row); // Agregar fila al cuerpo de la tabla
        }
    });
};

// Función para agregar inscripciones
const AgregarInscripciones = () => {
    // Obtenemos los datos 
    const nombre = document.getElementById('name-agg').value.trim();
    const email = document.getElementById('email-agg').value.trim();
    const actividad = document.getElementById('actividad-agg').value.trim();

    if (nombre === "" || email === "" || actividad === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    const inscripcion = {
        nombre: nombre,
        email: email,
        actividad: actividad
    };

    // Guardar en localStorage
    let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || []; // Obtener la lista de eventos guardados
    inscripciones.push(inscripcion); // Agregar el nuevo evento
    localStorage.setItem('inscripciones', JSON.stringify(inscripciones)); // Guardar la lista actualizada en localStorage

    alert("INSCRIPCIÓN GUARDADA EXITOSAMENTE");

}; 



const MostrarUltimasInscripciones = () => {
    const contenedor = document.getElementById('MostrarUltimasInscripciones');
    const inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];

     const boton = document.getElementById('Mostrar1');

    // Si el contenedor ya tiene contenido (eventos mostrados), ocultamos los eventos
    if (contenedor.innerHTML !== "") {
        contenedor.innerHTML = ""; 
        boton.textContent = "Mostrar Últimos Eventos"; // Cambiar el texto del botón
        return; // Salir de la función
    }


    // Limpiar el contenedor antes de mostrar las inscripciones
    contenedor.innerHTML = "";

    // Determinar cuántas inscripciones mostrar (máximo 3)
    const CantidadInscripcionesMinima = 3;
    const cantidadInscripciones = inscripciones.length < CantidadInscripcionesMinima ? inscripciones.length : CantidadInscripcionesMinima;

    // Usar un bucle para iterar sobre las últimas 'cantidadInscripciones' inscripciones
    for (let i = inscripciones.length - cantidadInscripciones; i < inscripciones.length; i++) {
        const inscripcion = inscripciones[i];

        // Crear y mostrar las inscripciones en HTML
        const inscripcionHTML = `
            <div id="inscripcion-${i}">
                <h5>Inscripción:</h5>
                <p><strong>Nombre:</strong> ${inscripcion.nombre}</p>
                <p><strong>Correo Electrónico:</strong> ${inscripcion.email}</p>
                <p><strong>Actividad:</strong> ${inscripcion.actividad}</p>
                <button class="btnEliminar" onclick="EliminarInscripcion(${i})">Eliminar</button>
                <hr>
            </div>
        `;

        // Insertar el HTML en el contenedor
        contenedor.innerHTML += inscripcionHTML;
    }
    // Cambiar el texto del botón
    boton.textContent = "Cerrar Inscripcion";
};

const EliminarInscripcion = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
       let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
       inscripciones.splice(index, 1);
       localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
       alert("INSCRIPCIÓN ELIMINADA EXITOSAMENTE");
   
       // Volver a mostrar las inscripciones actualizadas
       MostrarUltimasInscripciones();
};

}



window.onload = () => {
    const userData = JSON.parse(localStorage.getItem('datos_auth'));

    // Redirigir si no hay sesión o si el rol del usuario no es administrador
    if (!userData || userData.role !== "administrador") {
        alert('Acceso denegado. Debes iniciar sesión como administrador para acceder a esta página.');
        window.location.href = "../html/login.html"; 
    } else {
        // Mostrar bienvenida al usuario si es administrador
        document.getElementById("welcome").innerHTML = "Bienvenido, " + userData.nombre;
        ObtenerEventosJson();
        ObtenerInscripcionesJson();
    }
};


const cerrarSesion = () => {
    localStorage.removeItem('datos_auth');

    alert("Has cerrado sesión exitosamente");
    
    // Redirigir al usuario a la página de inicio o página de inicio de sesión
    window.location.href = "../html/login.html"; 
}

