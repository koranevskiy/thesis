import { observer } from 'mobx-react-lite'
import { FC, PropsWithChildren } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import ErrorModel from 'src/shared/models/error.model.ts'


export const ErrorDialog: FC<PropsWithChildren> = observer(({children}) => {

  if (ErrorModel.message === 'Не авторизован') {
    return null
  }

  const onClose = () => ErrorModel.closeModal()

  return (
    <>
      {children}
      <Dialog
        open={ErrorModel.isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            width: '460px',
          },
        }}
      >
        <Box
          sx={{
            padding: '32px 24px 24px 16px',
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            variant="subtitle1"
            sx={{
              padding: '0 0 8px 8px',
              fontWeight: 600,
            }}
          >
            Что-то пошло не так...
          </DialogTitle>
          <DialogContent
            sx={{
              padding: '8px 0 24px 8px',
            }}
          >
            <DialogContentText id="alert-dialog-description" variant="body2">
              Возникла ошибка: {ErrorModel.responseErrorMessage ? ErrorModel.responseErrorMessage : ErrorModel.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button fullWidth onClick={onClose}>
              Закрыть
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
})