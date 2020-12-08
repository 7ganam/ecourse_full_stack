import React, { Component } from 'react';
import { Container, Col, Form, Row, FormGroup, Label, Input, Button } from 'reactstrap';
import new_workspace_image from './new_workspace_image.png'
import { FormText } from 'reactstrap';
import './NewWorkSpaceComponent.css'
import upload_image_filler from './upload_image_filler2.png'
import $ from 'jquery';
import LocationPicker from '../../../shared/components/LocPickerComponent/LocPicker';
import { AuthContext } from '../../../shared/context/auth-context';
import ReactLoading from 'react-loading';
import { Alert } from 'reactstrap';



import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap';


class Newworkspace extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workspaceName: '',
            workspaceDescription: '',
            lng: '',
            lat: '',

            session_price: "",
            number_of_seats: "",
            phone: "",
            address: "",
            utilities: ["", "", "", ""],

            logo_image: "",
            featured_images_files: [],

            //fetch api state
            fetch_error: false,
            error_message: "",
            workspace_submitted_successfuly: false,
            sending_data: false,





        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handle_location_submit = this.handle_location_submit.bind(this);
        this.handle_image_change = this.handle_image_change.bind(this);

        this.handle_increase_utilities_button = this.handle_increase_utilities_button.bind(this);

    }

    static contextType = AuthContext;

    componentDidMount() {
        // sometimes the compoenet loads without google ... refresh if this happens ... find the reasonf for this 
        if (!(!!window.google)) {
            console.log("missing google")
            window.location.reload(false)
        }
    }


    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    handleSubmit(event) {
        console.log('Current State is: ' + JSON.stringify(this.state));
        alert('Current State is: ' + JSON.stringify(this.state));
        event.preventDefault();
        console.log(this.state.startDate)
        console.log(this.state.endDate)
    }


    handle_location_submit(lat, lng) {
        this.setState({
            lat: lat,
            lng: lng,
        });

    }


    handle_image_change(event) {

        const input = event.target;
        if (input.files && input.files[0]) {
            // TODO: validate images 
            this.setState({ logo_image: input.files[0] })
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#logo_image_display').attr('src', e.target.result);
                var image = document.createElement('img');
                image.src = e.target.result
                image.addEventListener('load', function () {
                    console.log(image.width + ' × ' + image.height);
                    let image_width = image.width;
                    let image_height = image.height;
                    // let image_parent_height = $('#logo_image_display').parent().height();
                    // let image_parent_width = $('#logo_image_display').parent().width();
                    // console.log(image_parent_height, image_parent_width)

                    if (image.height / image.width <= 1) {

                        $('#logo_image_display').each(function (_, img) {
                            var $this = $(this);
                            $this.css({
                                width: '100%',
                                height: 'auto',
                            });
                        })
                    }
                    else {
                        $('#logo_image_display').each(function (_, img) {
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


    handle_featured_image_change_factory(index_input) {
        const index = index_input; // closure variable different for every instance of the returned functions
        return (

            (event) => {

                const input = event.target;
                if (input.files && input.files[0]) {
                    // TODO: validate images here first
                    this.setState({ featured_images_files: input.files[0] })


                    // 1. Make a shallow copy of the state then edit it then reset the state 
                    let images_files_copy = [...this.state.featured_images_files];
                    images_files_copy[index - 1] = input.files[0]
                    this.setState({ featured_images_files: images_files_copy })


                    // console.log(input.files[0])
                    var reader = new FileReader();
                    reader.onload = function (e) {

                        $('#featured_image_' + index).attr('src', e.target.result);
                        var image = document.createElement('img');
                        image.src = e.target.result
                        image.addEventListener('load', function () {
                            console.log(image.width + ' × ' + image.height);
                            let image_width = image.width;
                            let image_height = image.height;
                            if (image.height / image.width <= 1) {
                                $('#featured_image_' + index).each(function (_, img) {
                                    var $this = $(this);
                                    $this.css({
                                        width: '100%',
                                        height: 'auto',
                                    });
                                })
                            }
                            else {
                                $('#featured_image_' + index).each(function (_, img) {
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
        )
    }


    handle_increase_utilities_button() {

        console.log("in_concept_index")

        if (this.state.utilities.length < 20) {
            let utilities = [...this.state.utilities];
            let New_cutilities = utilities.concat("");
            this.setState({
                utilities: New_cutilities
            });
        }
        else {
            alert("you can have 20 utilities max")
        }

    }

    handle_utilities_change_factory(in_concept_index) {
        const concept__index = in_concept_index; // closure variable different for every instance of the returned functions
        return (
            (event) => {

                const target = event.target;
                const value = target.value;

                // 1. Make a shallow copy of the Sessions
                let utilities_copy = [...this.state.utilities];
                utilities_copy[concept__index] = value;

                this.setState({ utilities: utilities_copy });

            }
        )


    }




    submit_handler = async event => {
        event.preventDefault();
        try {
            this.setState({ sending_data: true })



            //post data as formdata to the back end ... form data will set the content type automatically to multipart ... use multer & body-parser in back end to deal with it
            const formData = new FormData();


            formData.append('logo_image', this.state.logo_image);
            formData.append('f_image_1', this.state.featured_images_files[0]);
            formData.append('f_image_2', this.state.featured_images_files[1]);
            formData.append('f_image_3', this.state.featured_images_files[2]);
            formData.append('f_image_4', this.state.featured_images_files[3]);
            formData.append('workspaceName', this.state.workspaceName);
            formData.append('workspaceDescription', this.state.workspaceDescription);
            formData.append('lng', this.state.lng);
            formData.append('lat', this.state.lat);

            formData.append('session_price', this.state.session_price);
            formData.append('number_of_seats', this.state.number_of_seats);
            formData.append('phone', this.state.phone);
            formData.append('address', this.state.address);
            formData.append('utilities', this.state.utilities.filter((util) => !!util)
            ); // filter out empty strings entries ""

            const response = await fetch(`http://localhost:5000/workspaces`, {
                method: 'post',
                headers: {
                    Authorization: this.context.token ? ('Bearer ' + this.context.token) : ""
                },
                body: formData,
            })

            const response_json_content = await response.json()
            // console.log(image_Data);
            if (!response.ok) {
                this.setState({ fetch_error: true })
                throw new Error(response_json_content.message || "can't fetch data ... could be a connection error or unhandled back end error"); // if it's an error the back end should attach a message attribute
            }


            this.setState({ sending_data: false })
            console.log(response_json_content)
            // if (response_json_content == "success") {
            this.setState({ workspace_submitted_successfuly: true })
            // }



        } catch (err) {
            this.setState({ sending_data: false })
            this.setState({ error_message: err.message })
            console.log(err);
        }

    };






    render() {

        let utilities_view =
            () => {

                let utilities = this.state.utilities.map(
                    (utility, index) => {
                        return (
                            <FormGroup  >
                                <div className="d-flex  flex-wrap flex-md-nowrap">
                                    <Label style={{ width: "40px", marginBottom: "0", marginTop: "10px" }} for={'utility_' + index}
                                    >
                                        <span
                                            style={{ fontSize: "17px", color: "grey" }}

                                            className="new_course_label">
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                    </Label>

                                    <Input style={{ minWidth: "200px" }} className="flex-grow-1 mt-1" type="text" name={'utility_' + index} id={'utility_' + index} placeholder="enter utility here"
                                        value={this.state.utilities[index]}
                                        onChange={this.handle_utilities_change_factory(index)}
                                    />
                                </div>

                            </FormGroup >)
                    }

                )
                return (
                    <div >
                        { utilities}
                        < div style={{ display: "flex", justifyContent: "center", fontSize: "40px", }}>
                            <button onClick={this.handle_increase_utilities_button} type="button" class="btn btn-default btn-circle ">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div >
                    </div >
                )
            }



        let form_view = () => {
            return (<Form onSubmit={this.submit_handler}>
                <FormGroup row>
                    <Label for="workspaceName" sm={3}><span className="new_workspace_label">Workspace Name:</span></Label>
                    <Col sm={9} className="ml-auto">
                        <Input className="input_slot" type="text" name="workspaceName" id="new_workspace_name" placeholder="enter your workspace title here"
                            value={this.state.workspaceName}
                            onChange={this.handleInputChange} />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="session_price" sm={3}><span className="new_workspace_label">Price per session:</span></Label>
                    <Col sm={9} className="ml-auto">
                        <Input className="input_slot" type="text" name="session_price" id="session_price" placeholder="enter the price in egp here"
                            value={this.state.session_price}
                            onChange={this.handleInputChange} />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="number_of_seats" sm={3}><span className="new_workspace_label">Number of seats:</span></Label>
                    <Col sm={9} className="ml-auto">
                        <Input className="input_slot" type="text" name="number_of_seats" id="number_of_seats" placeholder="enter maximum number of students here"
                            value={this.state.number_of_seats}
                            onChange={this.handleInputChange} />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="phone" sm={3}><span className="new_workspace_label">Phone:</span></Label>
                    <Col sm={9} className="ml-auto">
                        <Input className="input_slot" type="text" name="phone" id="phone" placeholder="input a phone number here"
                            value={this.state.phone}
                            onChange={this.handleInputChange} />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="address" sm={3}><span className="new_workspace_label">Address:</span></Label>
                    <Col sm={9} className="ml-auto">
                        <Input className="input_slot" type="text" name="address" id="new_workspace_name" placeholder="input your address here"
                            value={this.state.address}
                            onChange={this.handleInputChange} />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="exampleText" sm={3}> <span className="new_workspace_label">Workspace Description:</span></Label>
                    <Col sm={9}>
                        <Input className="input_slot" id="new_workspace_text_area" type="textarea" name="workspaceDescription" placeholder="enter your workspace description  here" value={this.state.workspaceDescription}
                            onChange={this.handleInputChange} />
                    </Col>
                </FormGroup>


                <FormGroup row>
                    <Label for="exampleText" sm={3}> <span className="new_workspace_label">Locatoin:</span></Label>
                    <Col sm={9}>
                        {!!window.google && // to check if the window has a google component .. this is a bad design change it later  TODO:
                            <LocationPicker handle_submit={this.handle_location_submit} />
                        }
                    </Col>
                </FormGroup>


                <FormGroup row>
                    <Label for="logo_image" sm={3}><span className="new_course_label">Upload your logo image:</span></Label>
                    <Col sm={9} className="ml-auto">
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '300px', }}>

                            <Input className="input_slot" type="file" name="logo_image" id="logo_image"
                                // value={this.state.new_course_title}
                                onChange={this.handle_image_change}
                            />
                        </div>
                        <FormText color="muted">
                            choose image with suitable aspect ratio.
                    </FormText>
                        <div>
                            <div style={{ overflow: 'hidden', width: "250px", height: "250px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: 'dashed', borderColor: '#cac7c7', borderWidth: 'thin' }}>
                                <img id="logo_image_display" src={upload_image_filler} alt="your image" style={{ height: "100%", width: "auto" }} />
                            </div>
                        </div>
                    </Col>
                </FormGroup>


                <FormGroup row>
                    <Label for="featured_1" sm={3}><span className="new_course_label">Upload images:</span></Label>
                    <Col sm={9} className="ml-auto">

                        <Row>


                            <Col id="f_image_1" md={6} className="mt-2">
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px', }}>

                                    <Input className="input_slot" type="file" name="featured_1" id="featured_1"
                                        // value={this.state.new_course_title}
                                        onChange={this.handle_featured_image_change_factory(1)}
                                    />
                                </div>
                                <FormText color="muted">
                                    choose image 1.
                       </FormText>
                                <div
                                    style={{ width: "100%", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: 'dashed', borderColor: '#cac7c7', borderWidth: 'thin' }}>


                                    <div style={{ overflow: 'hidden', width: "150px", height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img className="img-fluid" id="featured_image_1" src={upload_image_filler} alt="your image" style={{ height: "110%", width: "auto" }} />
                                    </div>
                                </div>
                            </Col >

                            <Col id="f_image_2" md={6} className="mt-2">
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px', }}>

                                    <Input className="input_slot" type="file" name="featured_2" id="featured_2"
                                        // value={this.state.new_course_title}
                                        onChange={this.handle_featured_image_change_factory(2)}
                                    />
                                </div>
                                <FormText color="muted">
                                    choose image 2.
                       </FormText>
                                <div
                                    style={{ width: "100%", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: 'dashed', borderColor: '#cac7c7', borderWidth: 'thin' }}>


                                    <div style={{ overflow: 'hidden', width: "150px", height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img className="img-fluid" id="featured_image_2" src={upload_image_filler} alt="your image" style={{ height: "110%", width: "auto" }} />
                                    </div>
                                </div>
                            </Col >

                            <Col id="f_image_3" md={6} className="mt-2">
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px', }}>

                                    <Input className="input_slot" type="file" name="featured_3" id="featured_3"
                                        // value={this.state.new_course_title}
                                        onChange={this.handle_featured_image_change_factory(3)}
                                    />
                                </div>
                                <FormText color="muted">
                                    choose image 3.
                       </FormText>
                                <div
                                    style={{ width: "100%", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: 'dashed', borderColor: '#cac7c7', borderWidth: 'thin' }}>


                                    <div style={{ overflow: 'hidden', width: "150px", height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img className="img-fluid" id="featured_image_3" src={upload_image_filler} alt="your image" style={{ height: "110%", width: "auto" }} />
                                    </div>
                                </div>
                            </Col >

                            <Col id="f_image_4" md={6} className="mt-2">
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px', }}>

                                    <Input className="input_slot" type="file" name="featured_4" id="featured_4"
                                        // value={this.state.new_course_title}
                                        onChange={this.handle_featured_image_change_factory(4)}
                                    />
                                </div>
                                <FormText color="muted">
                                    choose image 4.
                       </FormText>
                                <div
                                    style={{ width: "100%", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: 'dashed', borderColor: '#cac7c7', borderWidth: 'thin' }}>


                                    <div style={{ overflow: 'hidden', width: "150px", height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img className="img-fluid" id="featured_image_4" src={upload_image_filler} alt="your image" style={{ height: "110%", width: "auto" }} />
                                    </div>
                                </div>
                            </Col >





                        </Row>




                    </Col>
                </FormGroup>



                <FormGroup row>
                    <Label for="utilities" sm={3}> <span className="new_course_label">Utilities in you workspace:</span></Label>
                    <Col sm={9}>
                        <Card className="mt-1">


                            <CardBody>

                                {utilities_view()}



                            </CardBody>
                        </Card>
                    </Col>

                </FormGroup>


                <FormGroup row>
                    <Col sm={{ size: 9, offset: 3 }}>
                        <Button type="submit" color="success">
                            Submit
                     </Button>
                    </Col>
                    {this.state.sending_data &&
                        <Col sm={{ size: 1 }}>
                            <ReactLoading type={"spinningBubbles"} color={"black"} height={'40px'} width={'40px'} />
                        </Col>
                    }
                    {!!this.state.error_message &&
                        <Col className="mt-3" sm={{ size: 9, offset: 3 }}>

                            <Alert color="danger">
                                {this.state.error_message}
                            </Alert>
                        </Col>
                    }



                </FormGroup>


            </Form>)
        }
        let success_message = () => {
            return (

                <div id="">
                    <div id="success_header">
                        Workspace submitted Successfully
                    </div>

                </div>

            )

        }

        return (


            <div id="new_workspace_all" >
                <Container fluid  >
                    <Row className=''>

                        <Col className="t3 mx-1 my-1          image_image_image ml-lg-5" xs="12" sm="12" md="4" lg="4" xl="4">
                            <div id="workspace_image_wrapper">
                                <h1 id="image_header">
                                    Create A workspace
                                </h1>
                                <div id="workspace_image">
                                    <img src={new_workspace_image} id="new_workspace_image" alt="new_workspace_image" />
                                </div>
                            </div>
                        </Col>

                        <Col className="t2 pt-lg-5 form_box justify-content-center my-1" xs="12" sm="12" md="7" lg="7" xl="7" >
                            <div id="new_workspace_form">
                                <div className="justify-content-center row row-content">
                                    <div className="col-12 col-lg-11 ml-auto ">

                                        {this.state.workspace_submitted_successfuly ? success_message() : form_view()}



                                    </div>
                                </div>

                            </div>
                        </Col>


                    </Row>

                </Container>

            </div >


        );

    }

}

export default Newworkspace;