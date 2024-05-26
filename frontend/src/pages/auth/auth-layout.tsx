import { FC, PropsWithChildren } from 'react'
import { Box, Stack } from '@mui/material'
import { LazyImage } from 'src/shared/components/image/lazy-image.tsx'
import AuthBg from 'src/shared/assets/images/auth-bg.jpeg'


export const AuthLayout: FC<PropsWithChildren> = ({children}) => {
  return (
    <Stack height="100%" width="100%" direction="row" alignItems="stretch">
      <Stack flex="0 0 50%" height="100%">
        {children}
      </Stack>
      <Stack flex="0 0 50%" overflow="hidden" height="100%">
        <Box sx={[{
          '& img': {
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }
        }]} height="100%">
          <LazyImage src={AuthBg}/>
        </Box>
      </Stack>
    </Stack>
  )
}