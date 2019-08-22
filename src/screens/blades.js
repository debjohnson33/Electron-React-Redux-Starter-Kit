import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import CKEditor from 'react-ckeditor-wrapper';
import { withRouter } from 'react-router';
import { confirmAlert } from 'react-confirm-alert';
import classNames from 'classnames';
import toastr from 'toastr';

import { saveBlade, addBlade, fetchBlades, deleteBlade } from '../actions/index';

const initialState = {
    newBlade: '',
    _id: '',
    title: '',
    content: '',
    initial_content: '',
    unsaved_changes: false,
    newItemAdded: false
}

class Blade extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
    }

    componentDidMount() {
        this.props.fetchBlades();

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

    }

    componentWillReceiveProps(nextProps) {

        if (this.state.newItemAdded === true && nextProps.latestBlade._id !== undefined) {

            const { _id, title, content } = nextProps.latestBlade

            this.setState({
                _id: _id,
                title: title,
                content: content,
                initial_content: content,
                unsaved_changes: false,
                newItemAdded: false
            });
        }

    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleEditorChange(content) {
        this.setState({
            content
        });
        this.changes_made();
    }

    changes_made() {
        const { content, initial_content } = this.state;
        this.state;
        this.setState({
            unsaved_changes: content !== initial_content
        });
    }

    validate_newBlade() {
        const { newBlade } = this.state
        this.state;
        const isInvalid = !newBlade;
        return isInvalid;
    }

    submit_newBlade(event) {
        event.preventDefault();
        var tempObj = {
            title: this.state.newBlade,
            content: ''
        };
        if (this.state.unsaved_changes) {
            confirmAlert({
                title: `Warning`,
                message: `You have unsaved changes`,
                buttons: [
                    {
                        label: `Proceed, without saving`,
                        onClick: () => {
                            this.props.addBlade(tempObj);
                            this.setState({
                                newItemAdded: true,
                                newBlade: ''
                            });
                        }
                    },
                    {
                        label: 'Cancel'
                    }
                ]
            })
        } else {
            this.props.addBlade(tempObj);
            this.setState({
                newItemAdded: true,
                newBlade: ''
            });
        }

    }

    openBlade(blade) {

        const { _id, title, content } = blade;

        if (this.state.unsaved_changes) {
            confirmAlert({
                title: `Warning!`,
                message: `You have unsaved changes`,
                buttons: [
                    {
                        label: `Proceed, without saving`,
                        onClick: () => {
                            this.setState({
                                _id: _id,
                                title: title,
                                content: content,
                                initial_content: content
                            });
                        }
                    },
                    {
                        label: 'Cancel'
                    }
                ]
            })

        } else {
            this.setState({
                _id: _id,
                title: title,
                content: content,
                initial_content: content
            });
        }

    }

    closeBlade() {
        if (this.state.unsaved_changes) {
            confirmAlert({
                title: `Warning!`,
                message: `You have unsaved changes`,
                buttons: [
                    {
                        label: `Proceed, without saving`,
                        onClick: () => {
                            this.setState({
                                _id: '',
                                title: '',
                                content: '',
                                initial_content: '',
                                unsaved_changes: false
                            });
                        }
                    },
                    {
                        label: 'Cancel'
                    }
                ]
            })

        } else {
            this.setState({
                _id: '',
                title: '',
                content: '',
                initial_content: '',
                unsaved_changes: false
            });
        }
    }


    handleSaveBlade() {
        const tempObj = {
            _id: this.state._id,
            content: this.state.content
        }
        this.props.saveBlade(tempObj);
        this.setState({
            initial_content: this.state.content,
            unsaved_changes: false
        });

        toastr.success('Your changes have been saved.', 'Hoorah')
    }

    deleteBlade() {
        this.props.deleteBlade(this.state._id);
        this.setState({
            _id: '',
            title: '',
            content: '',
            initial_content: '',
            unsaved_changes: false
        });
    }

    render() {

        const deleteBlade_alertOptions = {
            title: `Warning`,
            message: `You are about to permanently delete '${this.state.title}'`,
            buttons: [
                {
                    label: 'Yes, please delete.',
                    onClick: () => this.deleteBlade()
                },
                {
                    label: 'No, I want to keep my blade!'
                }
            ]
        }

        const { title, content, newBlade } = this.state;
        this.state;

        return (
            <section className="blades_wrap">

                <aside className="blades_sidebar">

                    <div className="wrap">

                        <div className="newBlade">
                            <form onSubmit={event => this.submit_newBlade(event)}>
                                <div className="form_wrap">
                                    <div className="form_row">
                                        <div className="form_item">
                                            <div className="form_input">
                                                <input type="text" name="newBlade" placeholder="New blade..." value={newBlade} onChange={this.handleChange.bind(this)} />
                                                <span className="bottom_border"></span>
                                                <button type="submit" disabled={this.validate_newBlade()}>
                                                    <i className="fas fa-plus-circle"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <nav>
                            <ul>
                                {this.props.blades.map((blade, index) => (
                                    <li key={index}>
                                        <span className={classNames({ 'item_wrap': true, 'active': blade._id === this.state._id })} onClick={() => this.openBlade(blade)}>
                                            <span className="hash">#</span> <span className="title">{blade.title}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                    </div>

                </aside>

                {this.state.title === '' &&
                    <div className="empty">
                        <p>
                            Bladhing selected.
                                </p>
                    </div>
                }

                <div className="grid">
                    <div className="column column_12_12">

                        {this.state.title !== '' &&
                            <div className="editor_wrap">

                                <div className="toolbar">

                                    <h1>{title}</h1>

                                    <div className="actions">
                                        <span className="save">
                                            <button onClick={() => this.handleSaveBlade()} className={classNames({ 'alert': this.state.unsaved_changes, 'saveButton': true })}>
                                                <i className="far fa-save"></i>
                                            </button>
                                        </span>
                                        <span className="delete">
                                            <button onClick={() => confirmAlert(deleteBlade_alertOptions)}>
                                                <i className="far fa-trash-alt"></i>
                                            </button>
                                        </span>
                                        <span className="close">
                                            <button onClick={() => this.closeBlade()}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </span>
                                    </div>

                                </div>

                                <CKEditor
                                    name="blade_editor"
                                    value={content}
                                    onChange={this.handleEditorChange.bind(this)}
                                    config={{ extraAllowedContent: 'div(*); p(*); strong(*);', height: 573 }}
                                />

                            </div>
                        }


                    </div>
                </div>

            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        blades: state.blades.arr,
        latestBlade: state.blades.latestBlade
    }
}

export default withRouter(connect(mapStateToProps, { addBlade, saveBlade, fetchBlades, deleteBlade })(Blade));