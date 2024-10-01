import Swal from "sweetalert2"; // Importa SweetAlert2
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { Global } from "../../helpers/Global";

export const Registro = () => {
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

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Registro</h1>
            </header>

            {/* Formulario de Registro*/}
            <div className="content__posts">
                <div className="form-style">
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

                    <form className="register-form" onSubmit={saveUser}>
                        <div className="form-group">
                            <label htmlFor="name">Nombres</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                onChange={changed}
                                value={form.name || ""}
                                autoComplete="given-name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Apellidos</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                required
                                onChange={changed}
                                value={form.last_name || ''}
                                autoComplete="family-name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nick">Nick</label>
                            <input
                                type="text"
                                id="nick"
                                name="nick"
                                required
                                onChange={changed}
                                value={form.nick || ''}
                                autoComplete="username"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                onChange={changed}
                                value={form.email || ''}
                                autoComplete="email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                onChange={changed}
                                value={form.password || ''}
                                autoComplete="new-password"
                            />
                        </div>

                        <input
                            type="submit"
                            value="Regístrate"
                            className="btn btn-success"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};