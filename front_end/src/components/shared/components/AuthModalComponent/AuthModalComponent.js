
//a modal component that appears and disappeares based on a context 
//any page can call this modal and it will appear automatically any where ... it just has to set the context variable 
//this componenet is rendered in the main component above the router

import React, { Component } from 'react';

import { baseUrl } from "../../../../shared/baseURL"
import './AuthModalComponent.css'

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AuthContext } from '../../context/auth-context';



class AuthModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };
        this.render_modal = this.render_modal.bind(this);
        this.login = this.login.bind(this);
        this.hide_modal = this.hide_modal.bind(this);

    }

    static contextType = AuthContext;
    login(e) {
        e.preventDefault()
        this.context.login();
        this.hide_modal()
    }
    hide_modal() { // set the show_auth_modal to false .. the modal is drawn in the main component above the router
        this.context.unset_show_auth_modal();
        console.log(this.context.show_auth_modal)
    }
    render_modal(showModal) {
        let should_open = showModal
        return (
            <div>
                <Modal isOpen={showModal} id="loginModal" style={{ maxWidth: "350px" }} class="modal fade modal-dialog modal-login">
                    <div class="modal-dialog modal-login">
                        <div class="modal-content">
                            <ModalHeader class="modal-header">
                                <div class="avatar">
                                    <img src={baseUrl + 'logo1.png'} alt="Avatar" />
                                </div>
                                <h4 class="modal-title">Member Login</h4>
                                <button type="button" onClick={this.hide_modal} class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            </ModalHeader>
                            <ModalBody>
                                <form >
                                    <div class="form-group">
                                        <input type="text" class="form-control" name="username" placeholder="Username" required="required" />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" class="form-control" name="password" placeholder="Password" required="required" />
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" onClick={e => this.login(e)} class="btn btn-primary btn-lg btn-block login-btn">Log in</button>
                                    </div>
                                </form>
                            </ModalBody>
                            <div class="modal-footer">
                                <a href="#">Forgot Password?</a>

                            </div>
                        </div>
                    </div>
                </Modal>
            </div>

        );
    }

    render() {
        return (
            <div style={{ marginTop: "" }}>
                { this.render_modal(this.props.showModal)}
            </div>

        )
    }
}

export default AuthModal;