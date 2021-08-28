import React from "react"

import {
  Button,
  Theme,
  makeStyles,
  createStyles,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  useTheme,
  useMediaQuery,
  ImageList,
  ImageListItem,
  IconButton,
  Tooltip
} from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import LoopIcon from "@material-ui/icons/Loop"

import { EstateDocument, useDeleteImageMutation, Image } from "src/graphql/queries/generated/graphql"
import snackStore from "src/store/snack.store"
import authFetch from "../../lib/auth/authFetch"
import LoadingDialogue from "../utils/LoadingDialogue"

export type ImageLibraryProps = {
  estateId: string
  images: Image[]
  open: boolean
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@keyframes rotating": {
      from: {
        transform: "rotate(0deg)"
      },
      to: {
        transform: "rotate(-360deg)"
      }
    },
    imageWrapper: {
      borderRadius: theme.shape.borderRadius,
      position: "relative"
    },
    imageButton: {
      position: "absolute",
      top: 0,
      right: 0,
      margin: theme.spacing(0.5),
      zIndex: theme.zIndex.snackbar,
      backgroundColor: theme.palette.grey[300],
      opacity: 0.8,
      "&:hover": {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.error.dark
      },
      "&.Mui-disabled": {
        opacity: 0.6,
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.primary.main,
        animation: "$rotating 2s linear infinite"
      }
    },
    input: {
      display: "none"
    }
  })
)

const EstateModal: React.FunctionComponent<ImageLibraryProps> = ({ images, estateId, open, onClose }) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"))

  const [deleteImage, { client }] = useDeleteImageMutation()

  const [deleting, setDeleting] = React.useState<string[]>([])
  const [uploading, setUploading] = React.useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null)

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    uploadFiles()
  }, [selectedFiles])

  const onSelectFiles: React.ChangeEventHandler<HTMLInputElement> = event => {
    setSelectedFiles(event.target.files)
  }

  const uploadFiles = async () => {
    if (selectedFiles?.length) {
      setUploading(true)
      const formData = new FormData()
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("images", selectedFiles[i])
      }
      try {
        await authFetch(`/api/media/images/estates/${estateId}`, {
          method: "POST",
          body: formData
        })
        await client.refetchQueries({ include: [EstateDocument] })
        snackStore.toggle("success", `Fotografie úspěšně nahrány (${selectedFiles.length})`)
      } catch (err) {
        console.log(err)
        snackStore.toggle("error", `Fotografie se nepodařilo nahrát`)
      } finally {
        setUploading(false)
        if (inputRef.current) {
          inputRef.current.value = ""
        }
      }
    }
  }

  const onUploadButton = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const onDelete = (imageId: string) => async () => {
    setDeleting([...deleting, imageId])
    try {
      await deleteImage({
        variables: { estateId, imageId },
        refetchQueries: [{ query: EstateDocument, variables: { id: estateId } }],
        awaitRefetchQueries: true
      })
      snackStore.toggle("success", "Fotografie úspěšně odstraněna")
    } catch (err) {
      console.log(err)
      snackStore.toggle("error", "Fotografii se nepodařilo odstranit")
    } finally {
      setDeleting(deleting.filter(id => id !== imageId))
    }
  }

  return (
    <React.Fragment>
      <LoadingDialogue open={uploading} title='Nahrávám fotografie' />
      <Dialog scroll='paper' open={open} onClose={onClose} fullScreen={xs} maxWidth='sm' fullWidth>
        <DialogTitle>Fotogalerie</DialogTitle>
        <DialogContent>
          {!images.length && (
            <DialogContentText>K této nemovitosti zatím nebyly nahrány žádné fotografie.</DialogContentText>
          )}
          <ImageList rowHeight={160} cols={xs ? 2 : 3} gap={6}>
            {images.map(({ _id, small }) => (
              <ImageListItem key={_id} classes={{ item: classes.imageWrapper }}>
                <Tooltip title='Odstranit'>
                  <IconButton
                    disabled={deleting.includes(_id)}
                    size='small'
                    onClick={onDelete(_id)}
                    classes={{ root: classes.imageButton }}
                  >
                    {deleting.includes(_id) ? <LoopIcon /> : <DeleteIcon />}
                  </IconButton>
                </Tooltip>
                <img src={small} alt={_id} />
              </ImageListItem>
            ))}
          </ImageList>
          <input
            ref={inputRef}
            onChange={onSelectFiles}
            className={classes.input}
            multiple
            type='file'
            id='avatar'
            capture='environment'
            accept='image/png, image/jpeg'
          />
        </DialogContent>
        <DialogActions>
          <Button color='default' onClick={onUploadButton}>
            nahrát fotografie
          </Button>
          <Button color='primary' onClick={onClose}>
            hotovo
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default EstateModal
