import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'

import { Link } from "react-router-dom";

import LikeButton from './LikeButton';
import CommentForm from './CommentForm';

import MyButton from '../../util/MyButton';
import Comments from './Comments';
import dayjs from 'dayjs';


//Redux Stuff
import { connect } from 'react-redux';
import { getScream, clearErrors } from '../../redux/actions/dataActions'

//MUI Stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid'
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress'

//MUI Icon
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat'

const styles = theme => ({
    ...theme.formStyle,
    profile: {
        '& .image-wrapper': {
          textAlign: 'center',
          position: 'relative',
          '& button': {
            position: 'absolute',
            top: '80%',
            left: '70%'
          }
        },
        '& .profile-image': {
          width: 200,
          height: 200,
          objectFit: 'cover',
          maxWidth: '100%',
          borderRadius: '50%'
        },
        '& .profile-details': {
          textAlign: 'center',
          '& span, svg': {
            verticalAlign: 'middle'
          },
          '& a': {
            color: theme.palette.primary.main
          }
        },
        '& hr': {
          border: 'none',
          margin: '0 0 10px 0'
        },
        '& svg.button': {
          '&:hover': {
            cursor: 'pointer'
          }
        }
      },
      buttons: {
        textAlign: 'center',
        '& a': {
          margin: '20px 10px'
        }
    },
    profileImage:{
        minWidth: 200,
        height: 200,
        borderRadius: "50%",
        objectFit: "cover"
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%', 
    }, 
    expandButton : {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
})

export class ScreamDialog extends Component {
    state = {
        open: false,
        body: '',
        errors: {},
        oldPath: '',
        newPath: ''
    }

    componentDidMount(){
        if(this.props.openDialog){
            this.handleOpen()
        }
    }

    handleOpen = () => {

        let oldPath = window.location.pathname;

        const { userHandle, screamId } = this.props;
        const newPath = `/users/${userHandle}/scream/${screamId}`;
        
        if( oldPath === newPath ) oldPath = `/users/${screamId}`

        window.history.pushState(null, null, newPath);

        this.setState({open: true, oldPath, newPath});
        this.props.getScream(this.props.screamId)
    }

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open : false, errors:{}});
        this.props.clearErrors();
    }

    

    render() {
        const { classes , 
                scream: { screamId, body, createdAt, likeCount, commentCount, userImage, userHandle, comments  },
                UI: { loading } 
            } = this.props;

        const dialogMarkup = loading ? (
                <div className={classes.spinnerDiv}>
                    <CircularProgress size={200} thickness={2} />
                </div>
            ) : (
                <Grid container spacing={5}>
                    <Grid item sm={5} >
                        <img src={userImage} alt="Profile" className={classes.profileImage} />
                    </Grid>
                    <Grid item sm={7}>
                        <Typography
                            component={Link}
                            color="primary"
                            variant="h5"
                            to={`/users/${userHandle}`}
                        >
                            @{userHandle} 
                        </Typography>
                        < hr  className={classes.invisibleSeperator} />
                        <Typography variant="body2" color="textSecondary">
                            { dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                        </Typography>
                        < hr  className={classes.invisibleSeperator} />
                        <Typography variant="body1">
                            {body}
                        </Typography>
                        <LikeButton screamId={screamId}/>
                        <span>{likeCount} Likes</span>
                        <MyButton tip="Comments">
                            <ChatIcon color="primary" />
                        </MyButton>
                        <span>{commentCount} Comments</span>
                    </Grid>
                    <hr className={classes.visibleSeperator} />
                    <CommentForm screamId={screamId} />
                    <Comments comments={comments} />
                </Grid> 
            )

        return (
            <Fragment>
                <MyButton tip="Expand scream" onClick={this.handleOpen} tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

ScreamDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getScream : PropTypes.func.isRequired,
    screamId : PropTypes.string.isRequired,
    userHandle : PropTypes.string.isRequired,
    UI: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired
}

const mapStatetoProps = state => ({
    scream: state.data.scream,
    UI : state.UI
})

const mapActionstoProp = {
    getScream,
    clearErrors
}

export default connect(mapStatetoProps, mapActionstoProp)(withStyles(styles)(ScreamDialog)) 
