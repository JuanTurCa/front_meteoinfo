import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layouts/public/PublicLayout';
import { PrivateLayout } from '../components/layouts/private/PrivateLayout';
import { Error404 } from '../components/layouts/Error404.jsx';
import { PagePrincipal } from '../components/layouts/public/PagePrincipal.jsx'
import { LoginRegistro } from '../components/usuarios/LoginRegistro.jsx';
import { Login } from '../components/usuarios/Login.jsx';
import { AuthProvider } from '../context/AuthProvider';

export const Routing = () => {
    return(
        <BrowserRouter>
        <AuthProvider>
            <Routes>
                {/* Componentes de la ruta pública en rutas anidadas */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<PagePrincipal />} /> {/* Página principal */}
                    <Route path='home' element={<PagePrincipal />} />
                    <Route path='login' element={<Login/>} />
                    <Route path='registro' element={<LoginRegistro/>} />
                </Route>

                {/* Componentes de la ruta privada en rutas anidadas */}
                <Route path="/rsocial" element={<PrivateLayout />}></Route>

                {/* Ruta para el error 404 */}
                <Route path="*" element={<Error404 />} />
            </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}