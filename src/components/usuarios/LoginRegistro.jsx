import React, { useState } from 'react';
import Swal from "sweetalert2"; // Importa SweetAlert2
import '../../assets/css/LoginRegister.css';
import { FaUserAstronaut, FaEnvelope } from "react-icons/fa";
import { CgUserlane } from "react-icons/cg";
import { IoIosLock } from "react-icons/io";
import { useForm } from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { Global } from "../../helpers/Global";

export const LoginRegistro = () => {
    //Accion de movimiento entre login y registro
    const [action, setAction] = useState('');
    // Usamos el hook personalizado useForm para cargar los datos del formulario
    const { form, changed } = useForm({});
    // Estado para mostrar resultado del registro del user
    const [saved, setSaved] = useState("not sended");
    // Hook para redirigir
    const navigate = useNavigate();
    // Guardar un usuario en la BD
    const saveUser = async (e) => {
        // Prevenir que se actualice la pantalla
        e.preventDefault();

        // Obtener los datos del formulario
        let newUser = form;

    // Petición a la API del Backend para guardar usuario en la BD
    const request = await fetch(Global.url + "/meteoinfo/usuarios/register", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    // Verificar si el estado de la respuesta del backend es "created" seteamos la variable saved con "saved" y si no, le asignamos "error", esto es para mostrar por pantalla el resultado del registro del usuario
        if (request.status === 201 && data.status === "created") {
            setSaved("saved");

            // Mostrar modal de éxito
            Swal.fire({
                title: data.message,
                icon: "success",
                confirmButtonText: "Continuar",
            }).then(() => {
                // Redirigir después de cerrar el modal
                navigate("/login");
            });
        } else {
            setSaved("error");

            // Mostrar modal de error
            Swal.fire({
                title: data.message || "¡Error en el registro!",
                icon: "error",
                confirmButtonText: "Intentar nuevamente",
            });
        }
    };

    //Banderas de accion
    const registerLink = () => {
        setAction(' active');
    }

    const loginLink = () => {
        setAction('');
    }

    return (
        <div className="layout__content">
        <div className='wrapper'>
            {/* Formulario de Registro*/}
            <div className='form-box login'>
                {/* Respuestas de usuario registrado*/}
                {saved == "saved" && (
                        <strong className="alert alert-success">
                            ¡Usuario registrado correctamente!
                        </strong>
                    )}
                    {saved == "error" && (
                        <strong className="alert alert-danger">
                            ¡El usuario no se ha registrado!
                        </strong>
                    )}
                <form onSubmit={saveUser}>
                    <h1>Registro</h1>
                    <div className='input-box'>
                        <input
                        placeholder='Nombre'
                        type='text'
                        id='Nombre'
                        name='name'
                        required
                        onChange={changed}
                        value={form.name || ''}
                        autoComplete='Given-name'
                        /><FaUserAstronaut className='icon'/>
                    </div>
                    <div className='input-box'>
                        <input
                        type='text'
                        placeholder='Apellidos'
                        id='last_name'
                        name='last_name'
                        required
                        onChange={changed}
                        value={form.last_name || ''}
                        autoComplete='family-name'
                        /><IoIosLock className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                        type='text'
                        placeholder='Nick'
                        id='nick'
                        name='nick'
                        required
                        onChange={changed}
                        value={form.nick || ''}
                        autoComplete='username'
                        /><CgUserlane className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                        type='email'
                        placeholder='Email'
                        id='email'
                        name='email'
                        required
                        onChange={changed}
                        value={form.email || ''}
                        autoComplete='email'
                        /><FaEnvelope className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                        type='password'
                        placeholder='Contraseña'
                        id='password'
                        name='password'
                        required
                        onChange={changed}
                        value={form.password || ''}
                        autoComplete='newe-password'
                        /><IoIosLock className='icon' />
                    </div>
                    <div className='remember-forgot'>
                        <label><input type='checkbox' />Esta de acuerdo con los terminos y condiciones?</label>
                    </div>

                    <button type='submit'>Registrarse</button>

                    <div className='register-link'>
                        <p>Ya tienes una cuenta? <a href='#'>Inicio</a></p>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};