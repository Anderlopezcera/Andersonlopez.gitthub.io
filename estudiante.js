const cerrarSesion = () => {
    localStorage.removeItem('datos_auth');

    alert("Has cerrado sesión exitosamente");
    
    // Redirigir al usuario a la página de inicio o página de inicio de sesión
    window.location.href = "../html/login.html"; 
}

const showOption = (option) => {
    const options = document.querySelectorAll('.items');
    options.forEach((item, index) => {
        item.style.display = index === option - 1 ? 'block' : 'none';
    });

};

const InscripcionEstudiante = ()=> {

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const fecha  = document.getElementById("fecha").value.trim();;
    const actividad = document.getElementById("actividad").value.trim();

    if (nombre === "" || correo === "" || fecha === "" || actividad === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    const inscripcion = {
        nombre: nombre,
        email: correo,
        fecha: fecha,
        actividad: actividad
    };

     // Obtener las inscripciones del localStorage
    let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    inscripciones.push(inscripcion); // Agregar la nueva inscripción
    localStorage.setItem('inscripciones', JSON.stringify(inscripciones)); // Guardar la lista actualizada en localStorage

    alert("Inscripción guardada exitosamente");
    document.getElementById("nombre").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("actividad").value = "";

    document.getElementById("inscripcionForm").reset();
    
};

let inscripcionEstudiante = null;

const verInscripciones = () => {
    const correoUsuario = document.getElementById("correo").value.trim();;
    const listaInscripciones = document.getElementById('listaInscripciones'); // Cuerpo de la tabla
    listaInscripciones.innerHTML = ""; // Limpiar la tabla antes de llenarla

    // Obtener las inscripciones del localStorage
    let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];

    // Filtrar las inscripciones para mostrar solo las que pertenecen al correo del usuario actual
    const inscripcionesUsuario = inscripciones.filter(inscripcion => inscripcion.email === correoUsuario);

    if (inscripcionesUsuario.length === 0) {
        listaInscripciones.innerHTML = "<tr><td colspan='5'>No hay inscripciones registradas para este usuario.</td></tr>";
    } else {
        inscripcionesUsuario.forEach(inscripcion => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${inscripcion.nombre}</td>
                <td>${inscripcion.email}</td>
                <td>${inscripcion.fecha}</td>
                <td>${inscripcion.actividad}</td>
                <td><button onclick="eliminarInscripcion('${inscripcion.email}')">Eliminar</button></td>
            `;

            listaInscripciones.appendChild(fila);
             // Aquí obtenemos la actividad inscrita y llamamos a verEventosActividad
            verEventosActividad(inscripcion.actividad); // Llamar a la función para ver eventos filtrados por la actividad
            inscripcionEstudiante = inscripcion.actividad;
        });
    }
};

// Función para obtener y mostrar los eventos desde un archivo JSON
const verEventosActividad = async (actividadUsuario) => {
    const listaEventos = document.getElementById('listaEventos');
    listaEventos.innerHTML = ''; // Limpiar la tabla antes de mostrar

    const url = 'https://api.jsonbin.io/v3/b/67008e69e41b4d34e43d2457'; // URL del archivo JSON

    try {
        // Usar fetch para obtener los eventos desde el archivo JSON
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error en la respuesta del archivo JSON');
        }

        const data = await response.json(); // Parsear la respuesta JSON
        const eventos = data.record; // Acceder a la lista de eventos

        // Filtrar los eventos por la actividad del usuario
        const eventosFiltrados = eventos.filter(evento => evento.actividad.toLowerCase() === actividadUsuario.toLowerCase());

        // Mostrar los eventos filtrados en la tabla
        if (eventosFiltrados.length === 0) {
            listaEventos.innerHTML = "<tr><td colspan='4'>No hay eventos para esta actividad.</td></tr>";
        } else {
            eventosFiltrados.forEach(evento => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${evento.nombre}</td>
                    <td>${evento.fecha}</td>
                    <td>${evento.hora}</td>
                    <td>${evento.ubicacion}</td>
                `;
                listaEventos.appendChild(fila);
            });
        }
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
        listaEventos.innerHTML = "<tr><td colspan='4'>Error al cargar los eventos.</td></tr>";
    }
};

const eliminarInscripcion = (correo) => {
    let inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    
    // Eliminar solo la inscripción del usuario actual (según el correo)
    inscripciones = inscripciones.filter(inscripcion => inscripcion.email !== correo);

    // Guardar el nuevo arreglo de inscripciones en localStorage
    localStorage.setItem('inscripciones', JSON.stringify(inscripciones));

    // Actualizar la tabla
    verInscripciones();
};

let novedadesAbiertas = false;

const VerNovedades = () => {
    const actividadAsignada = inscripcionEstudiante; // Obtener la actividad asignada
    const listaNovedades = document.getElementById('listaNovedades'); // Asegúrate de usar el ID correcto
    const botonNovedades = document.getElementById('btnToggleNovedades'); // Obtener el botón
    const contenedor = document.getElementById('novedadesEstudianter'); // Contenedor de novedades

    // Limpiar la lista anterior
    listaNovedades.innerHTML = "";

    // Obtener los eventos del localStorage
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    // Filtrar eventos por actividad asignada
    const eventosFiltrados = eventos.filter(evento => evento.actividad === actividadAsignada);

    // Verificar si hay eventos filtrados
    if (eventosFiltrados.length === 0) {
        listaNovedades.innerHTML += "<li>No hay eventos nuevos para esta actividad.</li>";
    } else {
        // Tomar los últimos 3 eventos
        const ultimosEventos = eventosFiltrados.slice(-3);
        
        // Agregar los eventos a la lista con contenido
        ultimosEventos.forEach(evento => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>Nuevo evento:</strong> ${evento.nombre} - Fecha: ${evento.fecha}`; // Cambia 'nombre' y 'fecha' según tus propiedades
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

window.onload = () => {
    const userData = JSON.parse(localStorage.getItem('datos_auth'));

    // Redirigir si no hay sesión o si el rol del usuario no es administrador
    if (!userData || userData.role !== "estudiante") {
        alert('Acceso denegado. Debes iniciar sesión como administrador para acceder a esta página.');
        window.location.href = "../html/login.html"; 
    } else {
        // Mostrar bienvenida al usuario si es administrador
        document.getElementById("welcome").innerHTML = "Bienvenido, " + userData.nombre;
        document.getElementById("correo").value = userData.email;
        document.getElementById("nombre").value = userData.nombre;
        verInscripciones();
    
    }
};