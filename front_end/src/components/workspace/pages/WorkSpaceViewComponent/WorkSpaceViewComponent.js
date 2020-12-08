import React, { Component } from 'react';
import { Container, Col, Form, Row, FormGroup, Label, Input, Button } from 'reactstrap';
import { CardImg } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
import { Card, CardBody, } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import MapContainer from "../../components/WsViewMapContainer/WsViewMapContainer"
import { ListGroup, ListGroupItem } from 'reactstrap';
import { baseUrl } from "../../../../shared/baseURL"

import { faAddressBook, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



import $ from "jquery";
import './WorkSpaceViewComponent.css'


function Utilities_view(props) {
    let utilities_array = props.utilities;
    let first_half_utilities = utilities_array.slice(0, Math.ceil(utilities_array.length / 2));
    let second_half_utilities = utilities_array.slice(Math.ceil(utilities_array.length / 2), utilities_array.length);
    let first_half_views = first_half_utilities.map((concept_text, index) => (
        <p>
            <FontAwesomeIcon icon={faCheckCircle} className=" mr-2" style={{ fontSize: 15, color: '#82C80B', fontWeight: 'bolder' }} />
            {concept_text}
        </p>
    ))
    let second_half_views = second_half_utilities.map((concept_text, index) => (
        <p>
            <FontAwesomeIcon icon={faCheckCircle} className=" mr-2" style={{ fontSize: 15, color: '#82C80B', fontWeight: 'bolder' }} />
            {concept_text}
        </p>
    ))
    // return <h1>Hello</h1>;
    return (
        <Container className="" >
            <Row>
                <Col className="border-right">
                    {first_half_views}
                </Col>
                <Col className=" border-success ">
                    {second_half_views}
                </Col>

            </Row>
        </Container>
    );
}







class WorkspaceView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: this.props.isLoading,
            session_price: "",             //this.props.workspace.session_price,
            workspace_name: "",             //this.props.workspace.workspace_name,
            location: "",             // this.props.workspace.location,
            number_of_seats: "",             //this.props.workspace.number_of_seats,
            rating: "",             // this.props.workspace.rating,
            address: "",             //this.props.workspace.address,
            number_of_seats: "",             // this.props.workspace.number_of_seats,
            phone: "",             // this.props.workspace.phone,
            logo_image: "",             // this.props.workspace.logo_image,
            images: "",             // this.props.workspace.images,
            utilities: "",             //this.props.workspace.utilities,

        };

        // session_price: this.props.workspace.session_price,
        // workspace_name: this.props.workspace.workspace_name,
        // location: this.props.workspace.location,
        // number_of_seats: this.props.workspace.number_of_seats,
        // rating: this.props.workspace.rating,
        // address: this.props.workspace.address,
        // number_of_seats: this.props.workspace.number_of_seats,
        // phone: this.props.workspace.phone,
        // logo_image: this.props.workspace.logo_image,
        // images: this.props.workspace.images,
        // utilities: this.props.workspace.utilities,

    }


    static getDerivedStateFromProps(props, state) { //this is used to set the state to the new props value .. it should used with care as it might cause infinit rendering loop
        console.log(state.isLoading, props.isLoading)
        if (!props.isLoading) {
            return {
                isLoading: props.isLoading,
                session_price: props.workspace.session_price,
                workspace_name: props.workspace.workspace_name,
                location: props.workspace.location,
                number_of_seats: props.workspace.number_of_seats,
                rating: props.workspace.rating,
                address: props.workspace.address,
                number_of_seats: props.workspace.number_of_seats,
                phone: props.workspace.phone,
                logo_image: props.workspace.logo_image,
                images: props.workspace.images,
                utilities: props.workspace.utilities,
            };
        }
        return null;
    }

    componentDidMount() {



        $(document).ready(function () {
            /* Every time the window is scrolled ... */
            $(window).scroll(function () {
                /* Check the location of each desired element */
                $('#floatin_container2').each(function (i) {
                    var bottom_of_object = $(this).offset().top + $(this).outerHeight(); //didn't use those but they are usefull for future refactoring
                    var bottom_of_window = $(window).scrollTop() + $(window).height();
                    /* If the object is completely visible in the window, fade it it */
                    if ($(window).scrollTop() > $(window).height() / 4) {
                        $('#floatin_container2').show();
                    }
                    if ($(window).scrollTop() < $(window).height() / 4) {
                        $('#floatin_container2').hide();
                    }
                });

            });

        });
    }

    // rating_confs_object = {
    //     size: 30,
    //     value: this.props.workspace.rating,
    //     edit: false,
    //     activeColor: "#63C019",
    //     isHalf: true,

    // };

    rating_confs_object() {
        let x = {
            size: 30,
            value: this.state.rating,
            edit: false,
            activeColor: "#63C019",
            isHalf: true,
        }
        return (x)
    }


    loading_component = () => { return (<div style={{ marginTop: "200px" }}>loading .... </div>) }
    workspace_view = () => {

        return (

            <div id="CourseViewComponent_all" className="mx-1">

                <Jumbotron className="jumb p-2 " style={{ marginTop: "20px" }}>
                    <Container fluid className="jumb_container" >
                        <Row id="row_1" style={{ height: '500px' }} >
                            <Col id="main_image" style={{ height: '500px', minWidth: '200px' }} height="100%" className="p-0 " sm={12} lg={6} >
                                <img
                                    className="ws_image m-0"
                                    // src={require('./ws1.webp')}

                                    src={baseUrl + "/uploads/images/workspaces/" + this.state.images[0]}
                                />
                            </Col>

                            <Col id="secondary_images_col" className="" sm={12} lg={6} >
                                <Row>
                                    <Col className="p-0 secenodary_image " sm={12} lg={6} >
                                        <img
                                            className="ws_image m-0"
                                            src={baseUrl + "/uploads/images/workspaces/" + this.state.images[0]}
                                        />

                                    </Col>

                                    <Col className="p-0 secenodary_image " sm={12} lg={6} >
                                        <img
                                            className="ws_image m-0"
                                            src={baseUrl + "/uploads/images/workspaces/" + this.state.images[1]}
                                        />
                                    </Col>

                                    <Col className="p-0 secenodary_image " sm={12} lg={6} >
                                        <img
                                            className="ws_image m-0"
                                            // src={`http://localhost:3000/workspaces_images/ws3.webp`}
                                            src={baseUrl + "/uploads/images/workspaces/" + this.state.images[2]}
                                        />
                                    </Col>

                                    <Col className="p-0 secenodary_image" sm={12} lg={6} >
                                        <img
                                            className="ws_image m-0"
                                            // src={`http://localhost:3000/workspaces_images/ws4.webp`}
                                            src={baseUrl + "/uploads/images/workspaces/" + this.state.images[3]}
                                        />

                                    </Col>
                                </Row>
                            </Col>




                        </Row>

                    </Container>
                </Jumbotron>
                <Container id='floatin_container2' className="">
                    <Row id="floatin_row2" className=" ">
                        <Col md={{ size: 4, order: 1, offset: 0 }} className=" ml-auto p-0">
                            <div >

                                <Card>

                                    <CardImg top
                                        src={baseUrl + "/uploads/images/workspaces/" + this.state.logo_image} alt="Card image cap" style={{ height: '15rem', objectFit: 'cover' }} />
                                    <CardBody className="p-0">
                                        <ListGroup>
                                            <ListGroupItem>
                                                <span style={{ fontSize: 25, color: 'grey', fontWeight: 'bolder' }}>
                                                    {'Session Price: '}
                                                </span >
                                                <span style={{ fontSize: 30, color: '#82C80B', fontWeight: 'bolder' }}>
                                                    {this.state.session_price}
                                                </span >
                                                <i class="fas fa-leaf" style={{ fontSize: 30, color: '#82C80B', fontWeight: 'bolder' }}></i>
                                                <span style={{ fontSize: 20, color: 'grey', fontWeight: 'bold' }}>
                                                    {' EGP'}
                                                </span>

                                            </ListGroupItem>
                                            <ListGroupItem>

                                                <Form>
                                                    <FormGroup>
                                                        <Label for="exampleEmail">Email</Label>
                                                        <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                                                    </FormGroup>

                                                    <FormGroup >
                                                        <Label for="message" > <span className="message">message:</span></Label>

                                                        <Input id="message_text_area" type="textarea" name="message" placeholder="enter your message here"
                                                            value={this.state.form_message}
                                                            onChange={this.handleInputChange}
                                                        />
                                                    </FormGroup>

                                                    <Button className="bg-success" style={{ fontWeight: 'bold', }}>Send us a message</Button>
                                                </Form>

                                            </ListGroupItem>

                                        </ListGroup>

                                    </CardBody>

                                </Card>


                            </div>

                        </Col>

                    </Row>
                </Container>

                <Container id="main_content_container" >

                    <Row className="mb-0">
                        <Col className=" pl-0 d-flex justify-content-center justify-content-md-start text-center" md={{ size: 8, order: 1, offset: 0 }}>
                            <h1 style={{ fontSize: "70px" }}>
                                {this.state.workspace_name}
                            </h1>
                        </Col>

                    </Row>
                    <Row className="d-flex justify-content-center justify-content-md-start">


                        <div id="rating_container" className="d-flex justify-content-center justify-content-md-start">
                            <span id="rating_number" className="d-flex justify-content-center justify-content-md-start">
                                {this.rating_confs_object().value}
                            </span>
                            <span className="d-flex justify-content-center justify-content-md-start">
                                <ReactStars {...this.rating_confs_object()} />
                            </span>
                        </div>


                    </Row>
                    <Row className="d-flex justify-content-center justify-content-md-start">

                        <div id="snippit_info " className="">
                            <div style={{ maxWidth: "200px" }} >
                                <FontAwesomeIcon icon={faPhone} style={{ color: "grey", marginRight: '3px' }} />
                                <span style={{ fontFamily: "Nova Round", color: "grey" }} className="mr-1">Phone:</span>
                                <span className="mr-4">{this.state.phone}</span>
                            </div >

                            <div style={{ maxWidth: "90vw", marginTop: "10px" }}>
                                <FontAwesomeIcon icon={faAddressBook} style={{ color: "grey", marginRight: '2px' }} />
                                <span style={{ fontFamily: "Nova Round", color: "grey" }}>  Address:</span>
                                <span className="hyphens "> {this.state.address}</span>
                            </div>

                            <div>

                            </div>

                        </div>
                    </Row>
                    <Row id="row_1">
                        {/* <Col sm="12" md={{ size: 6, offset: 6 }} className="mr-auto">.col-sm-12 .col-md-6 .offset-md-3</Col> */}
                        <Col md={{ size: 8, order: 1, offset: 0 }}>
                            <Card>

                                <CardBody style={{ height: "400px" }}>

                                    {<MapContainer name={this.state.workspace_name} location={this.state.location} />}

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>



                    <Row className="mt-4">
                        {/* <Col sm="12" md={{ size: 6, offset: 6 }} className="mr-auto">.col-sm-12 .col-md-6 .offset-md-3</Col> */}
                        <Col md={{ size: 8, order: 1, offset: 0 }}>
                            <h1>
                                Our Utilities
                    </h1>
                            <Card>

                                <CardBody>
                                    {/* <CardTitle className="card_title122"> We grant you </CardTitle> */}
                                    <div id="whatWeHave">
                                        <Utilities_view utilities={this.state.utilities} />

                                    </div>

                                </CardBody>
                            </Card>




                        </Col>

                    </Row>




                </Container>

            </div>

        )
    }

    render() {

        return (
            this.state.isLoading ? this.loading_component() : this.workspace_view()

        );
    }
}

export default WorkspaceView;