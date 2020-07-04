import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'
 
import MyButton from '../../util/MyButton';

//Redux Stuff
import { connect } from 'react-redux';
import {editUserDetails} from '../../redux/actions/userActions';

//MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

//MUI Icons
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

const styles = (theme) => ({
    ...theme.formStyle,
    button: {
        float: 'right'
    }
})

export class EditDetails extends Component {
    state = {
        bio: "",
        location: "",
        website: "",
        open: false
    };

    handleOpen = () => {
        this.setState({open: true});
        this.mapUserDetailsToState(this.props.credentials);
    }

    handleClose = () => {
        this.setState({ open : false});
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            location: this.state.location,
            website: this.state.website,
        }
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }

    componentDidMount(){
        const { credentials } = this.props;
        this.mapUserDetailsToState(credentials);
        
    }
 
    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            location: credentials.location ? credentials.location : '',
            website: credentials.website ? credentials.website : '',
        })
    }


    render() {
        const { classes }= this.props;
        return (
            <Fragment>
                {/* <Tooltip title="Edit Profile" placement="top">
                    <IconButton onClick={this.handleOpen} className={classes.button}>
                        <PermIdentityIcon color="primary"/>
                    </IconButton>
                </Tooltip> */}
                <MyButton tip="Edit Profile" onClick={this.handleOpen} btnClassName={classes.button}>
                    <PermIdentityIcon color="primary"/> 
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm">
                        <DialogTitle>Edit your Details</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField
                                    name="bio"
                                    type="text"
                                    label="Bio"
                                    multiline
                                    rows="3"
                                    placeholder="A short bio about yourself"
                                    className="classes.textField"
                                    value={this.state.bio}
                                    onChange={this.handleChange}
                                    fullWidth
                                />
                                <TextField
                                    name="location"
                                    type="text"
                                    label="Location"
                                    placeholder="Your homie Place"
                                    className="classes.textField"
                                    value={this.state.location}
                                    onChange={this.handleChange}
                                    fullWidth
                                />
                                <TextField
                                    name="website"
                                    type="text"
                                    label="Website"
                                    placeholder="your website"
                                    className="classes.textField"
                                    value={this.state.website}
                                    onChange={this.handleChange}
                                    fullWidth
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleSubmit} color="primary">
                                Update
                            </Button>
                        </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStatetoProps = (state) => ({
    credentials: state.user.credentials
})

export default connect(mapStatetoProps, { editUserDetails })(withStyles(styles)(EditDetails))
