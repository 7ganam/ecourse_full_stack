
//a modal component that appears and disappeares based on a context 
//any page can call this modal and it will appear automatically any where ... it just has to set the context variable 
//this componenet is rendered in the main component above the router

import React, { Component } from 'react';

import { baseUrl } from "../../../../shared/baseURL"
import './loginModalComponent.css'

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AuthContext } from '../../context/auth-context';



class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,

            email: "",
            password: "",
            token: "",
            expirateion_date_string: "",

            recieved_user: {},

            sending_datasending_data: false,
            loggedin_successfuly: false,
        };
        this.render_modal = this.render_modal.bind(this);
        this.login = this.login.bind(this);
        this.hide_modal = this.hide_modal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }


    handleInputChange(event) {
        // console.log(event.target)
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;



        this.setState({
            [name]: value
        });
    }


    static contextType = AuthContext;
    login(user, token, expirateion_date_string) {
        // this.context.set_user(user)
        this.context.login(token, user, expirateion_date_string);
        // console.log({ user })
        this.hide_modal()
    }
    hide_modal() { // set the show_login_modal to false .. the modal is drawn in the main component above the router
        this.context.unset_show_login_modal();
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
                                        <input type="text" class="form-control" name="email" placeholder="Email" required="required"
                                            value={this.state.email}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" class="form-control" name="password" placeholder="Password" required="required"
                                            value={this.state.password}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" onClick={e => this.submit_handler(e)} class="btn btn-primary btn-lg btn-block login-btn">Log in</button>
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

    submit_handler = async event => {
        event.preventDefault();
        try {
            this.setState({ sending_data: true })
            const response = await fetch(
                `http://localhost:5000/users/login`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                })
            })


            const response_json_content = await response.json()
            // console.log(image_Data);
            if (!response.ok) {
                this.setState({ fetch_error: true })
                throw new Error(response_json_content.message || "can't fetch data ... could be a connection error or unhandled back end error"); // if it's an error the back end should attach a message attribute
            }

            this.setState({ sending_course_data: false })
            if (response_json_content.message == "Logged in!") {
                this.setState({ loggedin_successfuly: true })
                this.setState({ recieved_user: response_json_content.user })
                this.setState({ token: response_json_content.token })
                this.setState({ expirateion_date_string: response_json_content.expirateion_date_string })

                console.log("expiration from login", response_json_content.expirateion_date_string)
                this.login(response_json_content.user, response_json_content.token, response_json_content.expirateion_date_string)
            }

        } catch (err) {
            this.setState({ sending_data: false })
            this.setState({ error_message: err.message })
            console.log(err);
        }

    };




    render() {
        return (
            <div style={{ marginTop: "" }}>
                { this.render_modal(this.props.showModal)}
            </div>

        )
    }
}

export default LoginModal;