import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider}  from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const router = createBrowserRouter([
  {
    path: '/canvas',
    element: <App></App>
  }
])

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  // </StrictMode>
)
