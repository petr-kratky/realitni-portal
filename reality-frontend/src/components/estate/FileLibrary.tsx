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
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import LoopIcon from "@material-ui/icons/Loop"
import DownloadIcon from "@material-ui/icons/GetApp"

import { saveAs } from "file-saver"

import { EstateDocument, useDeleteFileMutation, File } from "src/graphql/queries/generated/graphql"
import snackStore from "src/store/snack.store"
import authFetch from "../../lib/auth/authFetch"
import LoadingDialogue from "../utils/LoadingDialogue"

export type ImageEditModalProps = {
  estateId: string
  files: File[]
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
    deleteButton: {
      "&.Mui-disabled": {
        color: theme.palette.grey[600],
        animation: "$rotating 2s linear infinite"
      }
    },
    input: {
      display: "none"
    }
  })
)

const FileLibrary: React.FunctionComponent<ImageEditModalProps> = ({ files, estateId, open, onClose }) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"))

  const [deleteFile, { client }] = useDeleteFileMutation()

  const [deleting, setDeleting] = React.useState<string[]>([])
  const [uploading, setUploading] = React.useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null)

  const sortedFiles = React.useMemo(() => {
    const sortedFiles = [...files]
    return sortedFiles.sort((a, b) => (a._id.toLocaleLowerCase() < b._id.toLocaleLowerCase() ? -1 : 1))
  }, [files])

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
        formData.append("files", selectedFiles[i])
      }
      try {
        await authFetch(`/api/media/files/estates/${estateId}`, {
          method: "POST",
          body: formData
        })
        await client.refetchQueries({ include: [EstateDocument] })
        snackStore.toggle("success", `Přílohy úspěšně nahrány (${selectedFiles.length})`)
      } catch (err) {
        console.log(err)
        snackStore.toggle("error", `Přílohy se nepodařilo nahrát`)
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

  const onDownload = (fileName: string, url: string) => async () => {
    try {
      saveAs(url, fileName)
    } catch (err) {
      snackStore.toggle("error", "Soubor se nepodařilo stáhnout")
    }
  }

  const onDelete = (fileName: string) => async () => {
    setDeleting([...deleting, fileName])
    try {
      await deleteFile({
        variables: { estateId, fileName },
        refetchQueries: [{ query: EstateDocument, variables: { id: estateId } }],
        awaitRefetchQueries: true
      })
      snackStore.toggle("success", "Soubor úspěšně odstraněn")
    } catch (err) {
      snackStore.toggle("error", "Soubor se nepodařilo odstranit")
    } finally {
      setDeleting(deleting.filter(id => id !== fileName))
    }
  }

  return (
    <React.Fragment>
      <LoadingDialogue open={uploading} title='Nahrávám přílohy' />
      <Dialog scroll='paper' open={open} onClose={onClose} fullScreen={xs} maxWidth='sm' fullWidth>
        <DialogTitle>Přílohy ({files.length})</DialogTitle>
        <DialogContent>
          {!files.length && (
            <DialogContentText>K této nemovitosti zatím nebyly nahrány žádné přílohy.</DialogContentText>
          )}
          <List>
            {sortedFiles.map(({ _id, size, url }, index) => {
              const disabled = deleting.includes(_id)
              const filesize = size >= 1e6 ? `${(size / 1e6).toFixed(2)} MB` : `${(size / 1e3).toFixed(0)} kB`
              const fileExtension = _id.split(".").pop()?.toUpperCase() ?? ""
              return (
                <React.Fragment key={_id}>
                  <ListItem dense>
                    <ListItemIcon>
                      <Tooltip title={`Stáhnout (${filesize})`}>
                        <IconButton edge='start' onClick={onDownload(_id, url)}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={_id} secondary={`${fileExtension + ", "}${filesize}`} />
                    <ListItemSecondaryAction>
                      <Tooltip title='Odstranit'>
                        <IconButton
                          classes={{ root: classes.deleteButton }}
                          edge='end'
                          onClick={onDelete(_id)}
                          disabled={disabled}
                        >
                          {disabled ? <LoopIcon /> : <DeleteIcon />}
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index !== files.length - 1 && <Divider />}
                </React.Fragment>
              )
            })}
          </List>
          <input ref={inputRef} onChange={onSelectFiles} className={classes.input} multiple type='file' accept='*' />
        </DialogContent>
        <DialogActions>
          <Button color='default' onClick={onUploadButton}>
            nahrát přílohy
          </Button>
          <Button color='primary' onClick={onClose}>
            hotovo
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default FileLibrary
