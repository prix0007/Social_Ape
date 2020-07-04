import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'
import dayjs from 'dayjs';

import { Link } from "react-router-dom";

//MUI Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'


const styles = (theme) => ({
    ...theme.formStyle,
    commentImage: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    commentData: {
        marginLeft: 20
    },
    commentContainer: {
        justifyContent: 'center',
        padding: 16
    }
})

export class Comments extends Component {
    render() {
        const { comments, classes }= this.props;
        return (
            <Grid container className={classes.commentContainer} >
                {
                   comments && comments.map((comment, index) => {
                        const { body, createdAt, userImage, userHandle}  = comment;
                        return (
                            <Fragment key={createdAt}>
                                <Grid item sm={12}>
                                    <Grid container>
                                        <Grid item sm={2}>
                                            <img src={userImage} alt="Comment" className={classes.commentImage} />
                                        </Grid>
                                        <Grid item sm={9}>
                                            <div className={classes.commentData}>
                                                <Typography
                                                    variant="h5"
                                                    color="primary"
                                                    component={Link}
                                                    to={`/users/${userHandle}`}>
                                                    @{userHandle}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                                </Typography>
                                                <hr className={classes.invisibleSeperator} />
                                                <Typography variant="body1">
                                                    {body}
                                                </Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {
                                    index !== comments.length - 1 &&(
                                        <hr className={classes.visibleSeperator} />
                                    )
                                }
                                
                            </Fragment>
                        )
                    })
                }
            </Grid>
        )
    }
}

Comments.propTypes = {
    comments: PropTypes.array.isRequired,
}

export default withStyles(styles)(Comments)
