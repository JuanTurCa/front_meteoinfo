import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from '../../assets/img/default.png';
import { SerializeForm } from "../../helpers/SerializeForm";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import '../../assets/css/LoginRegister.css'; // Asegúrate de importar los mismos estilos

export const Config = () => {

  const { auth, setAuth } = useAuth();
  const [saved, setSaved] = useState("not_saved");
  const navigate = useNavigate();

  const updateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let newDataUser = SerializeForm(e.target);
    delete newDataUser.file0;

    try {
      const userUpdateResponse = await fetch(`${Global.url}/meteoinfo/usuarios/update`, {
        method: "PUT",
        body: JSON.stringify(newDataUser),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      const userData = await userUpdateResponse.json();

      if (userData?.status === "success" && userData.user) {
        delete userData.user.password;
        setAuth(userData.user);
        setSaved("saved");

        const fileInput = document.querySelector("#file-avatar");
        if (fileInput.files[0]) {
          await uploadAvatar(fileInput.files[0], token);
        }

        Swal.fire({
          title: userData?.message || '¡Usuario actualizado correctamente!',
          icon: 'success',
          confirmButtonText: 'Continuar',
        }).then(() => navigate('/login'));

      } else {
        setSaved("error");
        Swal.fire({
          title: userData?.message || '¡El usuario no se ha actualizado!',
          icon: 'error',
          confirmButtonText: 'Intentar nuevamente',
        });
      }
    } catch (error) {
      setSaved("error");
      Swal.fire({
        title: error.response?.data?.message || '¡Error al actualizar el usuario!',
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
      });
    }
  }

  const uploadAvatar = async (file, token) => {
    try {
      const formData = new FormData();
      formData.append('file0', file);

      const uploadResponse = await fetch(`${Global.url}/meteoinfo/usuarios/upload-avatar`, {
        method: "POST",
        body: formData,
        headers: { "Authorization": token }
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.status === "success" && uploadData.user) {
        delete uploadData.user.password;
        setAuth(uploadData.user);
        setSaved("saved");
      } else {
        setSaved("error");
      }
    } catch (error) {
      setSaved("error");
      Swal.fire({
        title: error.response?.data?.message || '¡Error al subir el avatar!',
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
      });
    }
  }

  return (
<div className="layout__content">
  <div className='wrapper config-wrapper'> {/* Clase adicional para el wrapper del config */}
    <div className='form-box login'>
      {saved === "saved" && (
        <strong className="alert alert-success">
          ¡Usuario actualizado correctamente!
        </strong>
      )}
      {saved === "error" && (
        <strong className="alert alert-danger">
          ¡El usuario no se ha actualizado!
        </strong>
      )}

      <form className="config-form" onSubmit={updateUser}>
        <h1>Editar Usuario</h1>
        <div className='input-box'>
          <input
            type="text"
            placeholder='Nombres'
            id="name"
            name="name"
            required
            defaultValue={auth.name}
          />
        </div>

        <div className='input-box'>
          <input
            type="text"
            placeholder='Apellidos'
            id="last_name"
            name="last_name"
            required
            defaultValue={auth.last_name}
          />
        </div>

        <div className='input-box'>
          <input
            type="text"
            placeholder='Nick'
            id="nick"
            name="nick"
            required
            defaultValue={auth.nick}
          />
        </div>

        <div className='input-box'>
          <input
            type="email"
            placeholder='Correo Electrónico'
            id="email"
            name="email"
            required
            defaultValue={auth.email}
          />
        </div>

        <div className='input-box'>
          <input
            type="password"
            placeholder='Contraseña'
            id="password"
            name="password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Avatar</label>
          <div className="avatar">
            <div className="general-info__container-avatar">
              <img src={auth.image !== "default.png" ? auth.image : avatar} className="container-avatar__img" alt="Foto de perfil" />
            </div>
          </div>
          <input type="file" name="file0" id="file-avatar" />
        </div>

        <button type='submit'>Editar</button>
      </form>
    </div>
  </div>
</div>
  )
}
