import { User } from 'src/shared/models/types/user.types.ts'
import { FC, MouseEvent } from 'react'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'


export const Avatar: FC<AvatarProps> = ({ user, onClick, width = 45, height = 45 }) => {

  const avatarName = `${user.last_name} ${user.first_name}`
  const avatarLetters = avatarName.match(/(^|\s)([а-яА-Яa-zA-Z0-9])/g)?.map(letter => letter.toUpperCase().trim()).join('')

  return (
    <Stack width={width} height={height} borderRadius={1} alignItems='center' justifyContent='center' borderColor="secondary" border={1} overflow="hidden">
      <Button variant="text" color="inherit" onClick={onClick}>
        {avatarLetters!}
      </Button>
    </Stack>
  )
}


interface AvatarProps {
  user: User
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  width?: number
  height?: number
}