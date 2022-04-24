import { Tooltip as MUITooltip, withStyles, Theme } from '@material-ui/core'
import { secondary } from '../../mp-theme'

const Tooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: secondary[800],
    color: theme.palette.common.white,
    maxWidth: 220,
    fontSize: 14,
    border: '1px solid #dadde9',
  },
  popper: {
    marginTop: 15,
  },
}))(MUITooltip)
export default Tooltip
