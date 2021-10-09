import React from "react"

import {
  createStyles,
  makeStyles,
  Theme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  DialogContentText,
  ListItemIcon
} from "@material-ui/core"
import { Star } from "@material-ui/icons"

import {
  FavoriteEstatesDocument,
  useFavoriteEstatesQuery,
  useRemoveFavoriteEstateMutation
} from "../../graphql/queries/generated/graphql"
import { snackStore } from "../../lib/stores"
import EstateIcon from "../estate/EstateIcon"

type ComponentProps = {
  open: boolean
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const Component: React.FunctionComponent<ComponentProps> = ({ onClose, open }) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"))

  const { data: favoriteEstatesData, refetch: refetchFavoriteEstates } = useFavoriteEstatesQuery({
    ssr: false,
    fetchPolicy: "cache-and-network"
  })

  const [removeFavoriteEstate] = useRemoveFavoriteEstateMutation()

  React.useEffect(() => {
    if (open) {
      refetchFavoriteEstates()
    }
  }, [open])

  const removeFavorite = (estate: string) => async () => {
    try {
      await removeFavoriteEstate({
        variables: { estate_id: estate as string },
        refetchQueries: [{ query: FavoriteEstatesDocument }]
      })
    } catch (err) {
      console.log(`Failed to remove estate ${estate} from favorites`, err)
      snackStore.toggle("error", "Nemovitost se nepodařilo odstranit ze seznamu oblíbených")
    }
  }

  const onClick = (estate: string) => () => {
    window.open(`/estates/${estate}`)
  }

  return (
    <Dialog open={open} onClose={onClose} keepMounted={false} fullScreen={xs} maxWidth='sm' fullWidth>
      <DialogTitle>Oblíbené nemovitosti ({favoriteEstatesData?.favoriteEstates.length})</DialogTitle>
      <DialogContent>
        {!!favoriteEstatesData?.favoriteEstates.length ? (
          <List>
            {favoriteEstatesData.favoriteEstates.map((fav, index, array) => (
              <React.Fragment key={fav.id}>
                <ListItem dense={!xs} button onClick={onClick(fav.id)}>
                  <ListItemIcon>
                    <EstateIcon primaryType={fav.primary_type.id} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${fav.primary_type.desc_cz}, ${fav.secondary_type.desc_cz}`}
                    secondary={`${fav.street_address}, ${fav.city_address}, ${fav.postal_code}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title='Odstranit z oblíbených'>
                      <IconButton edge='end' onClick={removeFavorite(fav.id)}>
                        <Star />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index !== array.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <DialogContentText>Zatím jste neuložili žádné oblíbené nemovitosti.</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={onClose}>
          zavřít
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Component
