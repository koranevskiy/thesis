import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from 'src/pages/auth/login/login-page'
import { AppRoutesEnum } from 'src/shared/router/app-routes.enum.ts'
import { NotFoundPage } from 'src/pages/not-found/not-found-page.tsx'
import { HomePage } from 'src/pages/dashboard/home/home-page.tsx'


export const AppRouter = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFoundPage/>}/>
        <Route path={AppRoutesEnum.Login} element={<LoginPage/>}/>
        <Route path={AppRoutesEnum.Dashboard} element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}