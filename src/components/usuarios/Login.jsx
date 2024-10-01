import { useState } from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";
import useAuth from '../../hooks/useAuth'
import { FaUserAstronaut, FaEnvelope } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";

export const Login = () => {
    //Accion de movimiento entre login y registro
    const [action, setAction] = useState('');
  // Estado para obtener los datos desde el formulario
  const { form, changed, resetForm } = useForm({ email: "", password: "" });

  // Estado para validar si el usuario se identificó correctamente
  const [logged, setLogged] = useState("not logged");

  // Estado para setear los valores del token y usuario en el contexto de la aplicación
  const { setAuth } = useAuth();

  const loginUser = async (e) => {
    // prevenir que se actualice el navegador
    e.preventDefault();

    //Banderas de accion
    const registerLink = () => {
        setAction(' active');
    }

    // Obtener los datos del formulario
    let userToLogin = form;

    // Petición al backend
    const request = await fetch(Global.url + "/meteoinfo/usuarios/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    if (data.status == "success") {
      // Guardar los datos del token y usuario en el localstorage del navegador
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Seteamos la variable de estado logged si se autenticó correctamente el usarios
      setLogged("logged");

      // Seteamos los datos del usuario en el Auth
      setAuth(data.user);

      // Limpiar el formulario
      resetForm();

      // Redirección
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      // Seteamos la variable de estado logged si no se autenticó el usuario
      setLogged("error");
    }
  };
    return(
        <div className="layout__content">
        <div className={`wrapper${action ? ' register-bg' : ''} ${action}`}>
            <div className='form-box login'>
                {/* Formulario de Login*/}
                {/* Mensajes para el usuario */}
                {logged == "logged" ?
                    (<strong className="alert alert-success">!Usuario autenticado correctamente¡</strong>) :
                    ("")}
                {logged == "error" ?
                    (<strong className="alert alert-danger">!El usuario no se ha autenticado¡</strong>) :
                    ("")}
                <form action='' onSubmit={loginUser}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input
                        type='email'
                        placeholder='Correo'
                        id='email'
                        name="email"
                        required
                        value={form.email}
                        onChange={changed}
                        autoComplete="email"
                        /><FaUserAstronaut className='icon'/>
                    </div>

                    <div className='input-box'>
                        <input
                        type='password'
                        placeholder='Contraseña'
                        id="password"
                        name="password"
                        required
                        value={form.password}
                        onChange={changed}
                        autoComplete="current-password"
                        /><IoIosLock className='icon' />
                    </div>

                    <div className='remember-forgot'>
                        <label><input type='checkbox' />Recordarme</label>
                        <a href='#'>Olvido su contraseña?</a>
                    </div>

                    <button type='submit'>Entrar</button>

                    <div className='register-link'>
                        <p>No tienes cuenta? <a href='#' >Registro</a></p>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};