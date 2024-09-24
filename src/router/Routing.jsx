import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layouts/public/PublicLayout';
import { PrivateLayout } from '../components/layouts/private/PrivateLayout';
import { Error404 } from '../components/layouts/Error404.jsx';

export const Routing = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicLayout />}> </Route>
                <Route path="/rsocial" element={<PrivateLayout />}></Route>
                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    )
}