
//a modal component that appears and disappeares based on a context 
//any page can call this modal and it will appear automatically any where ... it just has to set the context variable 
//this componenet is rendered in the main component above the router

import React, { Component } from 'react';

import { baseUrl } from "../../../../shared/baseURL"
import './signUpModalComponent.css'

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AuthContext } from '../../context/auth-context';
import { Container, Col, Form, Row, FormGroup, Label, Input, Button } from 'reactstrap';
import { FormText } from 'reactstrap';
import upload_image_filler from './upload_image_filler2.png'
import $ from 'jquery';

import ReactLoading from 'react-loading';
import { Alert } from 'reactstrap';

class SingUpModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,

            sending_data: false,
            user_submitted_successfuly: false,
            error_message: "",

            name: "",
            lastname: "",
            email: "",
            password: "",
            image: "",

        };
        this.render_modal = this.render_modal.bind(this);
        this.login = this.login.bind(this);
        this.hide_modal = this.hide_modal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handle_image_change = this.handle_image_change.bind(this);
        this.login = this.login.bind(this);
        this.hide_modal = this.hide_modal.bind(this);



    }

    login(user, token, expirateion_date_string) {
        // this.context.set_user(user)
        this.context.login(token, user, expirateion_date_string);
        // console.log({ user })
        this.hide_modal()
    }

    hide_modal() { // set the show_login_modal to false .. the modal is drawn in the main component above the router
        this.context.unset_show_login_modal();
    }

    componentDidMount() {
        $("#replacer").on("click", function (e) {
            e.preventDefault()
            $("#replaced").trigger('click');
        });

    }

    static contextType = AuthContext;

    hide_modal() { // set the show_login_modal to false .. the modal is drawn in the main component above the router
        this.context.unset_show_signup_modal();
        console.log(this.context.show_signup_modal)
    }

    handleInputChange(event) {
        console.log(event.target)
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    submit_handler = async event => {
        event.preventDefault();
        try {
            this.setState({ sending_data: true })
            //post data as formdata to the back end ... form data will set the content type automatically to multipart ... use multer & body-parser in back end to deal with it
            const formData = new FormData();
            // formData.append('logo_image', this.state.logo_image);
            formData.append('name', this.state.name);
            formData.append('email', this.state.email);
            formData.append('password', this.state.password);
            formData.append('image', this.state.image);

            const response = await fetch(`http://localhost:5000/users/signup`, {
                method: 'post',
                body: formData,
            })

            const response_json_content = await response.json()
            if (!response.ok) {
                this.setState({ fetch_error: true })
                throw new Error(response_json_content.message || "can't fetch data ... could be a connection error or unhandled back end error");
            }

            this.setState({ sending_data: false })
            console.log({ response_json_content })

            if (response_json_content.message == "Logged in!") {

                console.log("expiration from login", response_json_content.expirateion_date_string)
                this.login(response_json_content.user, response_json_content.token, response_json_content.expirateion_date_string)
            }

        } catch (err) {
            this.setState({ sending_data: false })
            this.setState({ error_message: err.message })
            console.log(err);
        }

    };

    upload_image(e) { // map the clicked button to the upload file hidden button ... i did this to be able to style the button
        e.preventDefault()
        $("#replaced").trigger('click');
    }


    handle_image_change(event) {
        const input = event.target;
        if (input.files && input.files[0]) {
            // TODO: validate images 
            this.setState({ image: input.files[0] })
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#image_display').attr('src', e.target.result);
                console.log(e.target.result);
                var image = document.createElement('img');
                image.src = e.target.result
                image.addEventListener('load', function () {
                    console.log(image.width + ' × ' + image.height);
                    let image_width = image.width;
                    let image_height = image.height;

                    if (image.height / image.width <= 1) {
                        $('#image_display').each(function (_, img) {
                            var $this = $(this);
                            $this.css({
                                width: '100%',
                                height: 'auto',
                            });
                        })
                    }
                    else {
                        $('#image_display').each(function (_, img) {
                            var $this = $(this);
                            $this.css({
                                height: '100%',
                                width: 'auto'
                            });
                        })

                    }
                });

            }

            reader.readAsDataURL(input.files[0]);
        }
    }


    render_modal(showModal) {
        let should_open = showModal
        return (
            <div>
                <Modal isOpen={showModal} id="singup_Modal" style={{ maxWidth: "350px" }} class="modal fade modal-dialog modal-login">
                    <div class="modal-dialog modal-login">
                        <div class="modal-content">
                            <ModalHeader class="modal-header">
                                <div class="avatar">
                                    <img src={baseUrl + 'logo1.png'} alt="Avatar" />
                                </div>
                                <h4 class="modal-title">Sign Up</h4>
                                <button type="button" onClick={this.hide_modal} class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            </ModalHeader>
                            <ModalBody>
                                <form >
                                    <div class="form-group">
                                        <input type="text" class="form-control" name="name" placeholder="name" required="required"
                                            value={this.state.name}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>

                                    <div class="form-group">
                                        <input type="text" class="form-control" name="email" placeholder="email" required="required"
                                            value={this.state.email}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div class="form-group">
                                        <input type="password" class="form-control" name="password" placeholder="password" required="required"
                                            value={this.state.password}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>

                                    <div style={{ display: "flex", marginBottom: "40px" }} >

                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '300px', }}>
                                            <Button color="secondary" onClick={e => this.upload_image(e)} style={{ flexGrow: "2", width: "95%" }} > Upload image</Button>
                                            <Input id="replaced" type="file" name="logo_image"
                                                style={{ display: "none" }}
                                                onChange={this.handle_image_change}

                                            />

                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px", marginTop: "0px" }}>
                                            <div style={{ overflow: 'hidden', width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: 'dashed', borderColor: '#cac7c7', borderWidth: 'thin', marginTop: "0px" }}>
                                                <img id="image_display" src={upload_image_filler} alt="your image" style={{ height: "100%", width: "auto" }} />
                                            </div>
                                        </div>
                                    </div>


                                    <div class="form-group">
                                        <Button color="success" type="submit" onClick={this.submit_handler} class="btn btn-primary btn-lg btn-block login-btn" style={{ width: "100%" }}>Sign Up</Button>
                                    </div>
                                    {this.state.sending_data &&
                                        <Col sm={{ size: 1 }}>
                                            <ReactLoading type={"spinningBubbles"} color={"black"} height={'40px'} width={'40px'} />
                                        </Col>
                                    }
                                    {!!this.state.error_message &&
                                        <Col className="mt-3" sm={{ size: 12, }}>

                                            <Alert color="danger">
                                                {this.state.error_message}
                                            </Alert>
                                        </Col>
                                    }
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

export default SingUpModal;