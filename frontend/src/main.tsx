import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import {Provider} from "react-redux";
import {Toaster} from "sonner";


import {router} from "@/app/routes/router.tsx";
import {store} from "@/app/store.ts";

import './index.css'

import 'leaflet/dist/leaflet.css'
import '@/shared/lib/leaflet-icon';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router}/>
        <Toaster position={'top-right'} richColors />
    </Provider>
  </StrictMode>,
)
