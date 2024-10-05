 // Cargar usuarios desde el archivo JSON
const ObtenerUsuarios = async () => {
    const urlJson = 'https://api.jsonbin.io/v3/b/67008dcbad19ca34f8b2e36f';
    try {
        const response = await fetch(urlJson); 
        const users = await response.json();
    console.log(users);
        return users;
    } catch (error) {
        console.error('Error al cargar el archivo login.json:', error);
        return [];
    }
};
 
 const IniciarSesion = async () => { 
    // Obtenemos los datos del formulario 
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validamos los datos
    if (email === "" || password === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    // Cargamos los usuarios
    const data = await ObtenerUsuarios(); // Aquí obtienes la respuesta completa
    const users = data.record; // Accedemos al array de usuarios

    if (!users || users.length === 0) {
        alert("No se pudieron cargar los usuarios. Intenta nuevamente más tarde.");
        return; // Termina si no hay usuarios
    }

    let userFound = null;

    // Buscar el usuario
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            userFound = users[i];
            break;
        }
    }

    if (userFound) {
        localStorage.setItem('datos_auth', JSON.stringify(userFound)); // Guardar el usuario autenticado
        switch (userFound.role) {
            case 'administrador':
                window.location.href = '../HTML/admin.html';
                break;
            case 'estudiante':
                window.location.href = '../HTML/estudiante.html';
                break;
            case 'entrenador':
                window.location.href = '../HTML/entrenador.html';
                break;
            default:
                alert('Rol no reconocido');
        }
    } else {
        alert('Usuario o contraseña incorrectos');
        LimpiarUsuarios();
    }
};
  
const LimpiarUsuarios = async () => {
     const email = document.getElementById("email").value = "";
    const password = document.getElementById("password").value = "";

};