import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider}  from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Login } from './components/login.tsx'

const router = createBrowserRouter([
  {
    path: '/canvas',
    element: <App></App>
  },
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '*',
    element: <Login></Login>
  }
])

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  // </StrictMode>
)
