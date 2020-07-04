import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'

import MyButton from '../../util/MyButton';


//Redux Stuff
import { connect } from 'react-redux';
import { postScream, clearErrors } from '../../redux/actions/dataActions';

//MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

//MUI Icon
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
    ...theme.formStyle,
    submitButton:{
        position: 'relative',
        float: 'right',
        marginTop: 10,
        marginBotton: 10
    }, 
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '5%'
    }
})

class PostScream extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({
                body:"",
                open : false, 
                errors:{}
            })
        }
    }

    handleOpen = () => {
        this.setState({open: true});
    }

    handleClose = () => {
        this.props.clearErrors();
        this.setState({ open : false, errors:{}});
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postScream({ body: this.state.body })
       
    }

    render() {
        const { errors } = this.state
        const { classes, UI: { loading }} = this.props;
        return (
            <Fragment>
                <MyButton tip="Add a Scream !" onClick={this.handleOpen} >
                    <AddIcon color="secondary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogTitle>
                        Post a new Scream!!!
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="body"
                                type="text"
                                label="Scream"
                                multiline
                                rows="3"
                                placeholder="Scream at your social Ape"
                                error={errors.error ? true : false}
                                helperText={errors.error}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            /> 
                            <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                                Submit
                                {
                                    loading && (
                                        <CircularProgress size={25} className={classes.progressSpinner} />
                                    )
                                }
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>

        )
    }
}

PostScream.propTypes = {
    postScream: PropTypes.func.isRequired,
    clearErrors : PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStatetoProps = state => ({
    UI: state.UI
})

export default connect(mapStatetoProps, { postScream, clearErrors } )(withStyles(styles)(PostScream))
