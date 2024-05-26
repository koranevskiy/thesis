import { AuthLayout } from 'src/pages/auth/auth-layout.tsx'
import { Button, Link, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useFetch } from 'src/shared/hooks/use-fetch.ts'
import AuthModel from 'src/shared/models/auth.model.ts'
import { useNavigate } from 'react-router-dom'
import { AppRoutesEnum } from 'src/shared/router/app-routes.enum.ts'


const initialValues = {
  email: '',
  password: '',
}

export const LoginPage = () => {

  const {execute: login, isLoading, error} = useFetch({
    requestCb: AuthModel.login
  })

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues,
    onSubmit: async (formValues) => {
      if (!formValues.password) {
        formik.setFieldError('password', 'Введите пароль')
      }
      if (!formValues.email) {
        formik.setFieldError('email', 'Введите email')
      }
      if (!formValues.email || !formValues.password) {
        return
      }
      const {error} = await login(formValues)
      if(!error) {
        navigate(AppRoutesEnum.Dashboard)
      }
    },
  })

  return (
    <AuthLayout>
      <Stack justifyContent='center' p={10} height='100%' component='form' onSubmit={formik.handleSubmit}>
        <Stack gap={4}>
          <Stack gap={2.5}>
            <TextField label='Email' placeholder='Email' {...formik.getFieldProps('email')}
                       error={!!formik.errors.email} helperText={formik.errors.email} />
            <TextField label='Пароль' placeholder='Пароль' type='password' {...formik.getFieldProps('password')}
                       error={!!formik.errors.password} helperText={formik.errors.password} />
          </Stack>
          <Stack direction='row' gap={2} justifyContent='space-between'>
            <Button variant='contained' color='primary' sx={{
              flex: '1 1 auto',
            }} type='submit' disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Войти'}
            </Button>
            <Button sx={{
              flex: '1 1 auto',
            }} variant='outlined'>
              Зарегистрироваться
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </AuthLayout>
  )
}