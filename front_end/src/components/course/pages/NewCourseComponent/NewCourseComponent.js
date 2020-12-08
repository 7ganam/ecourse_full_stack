import React, { Component } from 'react';
import { Container, Col, Form, Row, FormGroup, Label, Input, Button } from 'reactstrap';
import { Collapse, Navbar, Nav, NavItem, NavLink, NavbarToggler, NavbarBrand } from 'reactstrap';
import { FormText } from 'reactstrap';
import new_course_image from './new_course_image.png'
import upload_image_filler from './upload_image_filler2.png'
import DatePicker from "react-datepicker";
import { Card, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import { AuthContext } from '../../../shared/context/auth-context';
import ReactLoading from 'react-loading';
import { Alert } from 'reactstrap';

import $ from 'jquery';

import './NewCourseComponent.css'
import "react-datepicker/dist/react-datepicker.css";



import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




class NewCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // controlled form states
            new_course_img: "python1.jpg",
            new_course_title: '',
            new_course_author: "", // this is set in the backend as the same as the user accoount name
            new_course_startDate: new Date(),
            new_course_endDate: new Date(),
            new_course_workspace_name: 'No Selection',
            new_course_workspace_id: "",
            new_course_price: 0,
            new_course_description: '',
            new_course_slogan: '',
            number_of_sessions: 1,
            Sessions: [{
                Session_title: '',
                Session_Description: '',
                Session_startDate: '',
                isOpen: false,
            }], // this sessions object follows the sessions model used in the backend
            Sessions_images: { session_1_img: "" }, // images files of the sessions  stored in object--> will be stored in filesystem in backend ---> image file names will be stored in session objects then

            what_will_learn: ["", "", "", ""],
            new_course_img_file: "",


            //fetch api states
            sending_course_data: false,
            form_json_error: false, // if the first fetch which sends forms json data fails this sets to true
            image_error: false,     // if the second fetch which sends image file fails this sets to true
            error_message: "",
            course_submitted_successfuly: false,

        };


        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEndChange = this.session_date_change_handler_function_factory.bind(this);
        this.handle_session_InputChange_factory = this.handle_session_InputChange_factory.bind(this);
        this.handle_number_of_sessions_Change = this.handle_number_of_sessions_Change.bind(this);
        this.handle_image_change = this.handle_image_change.bind(this);
        this.handle_increase_concepts_button = this.handle_increase_concepts_button.bind(this);




    }

    static contextType = AuthContext;


    handleInputChange(event) { // this one handles nonsession form inputs -- whenever a field change it sets corresponding state field -- note the input name field must match the state field name
        const target = event.target;


        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handle_number_of_sessions_Change(event) {
        //change the number
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

        // if the number increase add empty session objects to the State.Sessions
        // if the number decreased slice the State.Sessions to the new number of state 


        let new_number_of_sessions = target.type === 'checkbox' ? target.checked : target.value;
        let old_number_of_sessions = this.state.number_of_sessions;


        if (new_number_of_sessions > old_number_of_sessions) {
            let difference_in_session_numbers = new_number_of_sessions - old_number_of_sessions;
            let new_empty_Sessions = [];
            let i;
            for (i = 0; i < difference_in_session_numbers; i++) {
                new_empty_Sessions.push(
                    {
                        Session_title: '',
                        Session_Description: '',
                        Session_startDate: '',
                        isOpen: false,
                    }
                )
            }
            // 1. Make a shallow copy of the Sessions
            let Sessions = [...this.state.Sessions];
            let New_Sessions = Sessions.concat(new_empty_Sessions);
            this.setState({
                Sessions: New_Sessions
            });
        }
        else if (new_number_of_sessions < old_number_of_sessions) {
            let Sessions = [...this.state.Sessions];
            let New_Sessions = Sessions.slice(0, new_number_of_sessions);
            this.setState({
                Sessions: New_Sessions
            });
        }




    }

    session_date_change_handler_function_factory(in_session_index) {
        const session__index = in_session_index; // closure variable different for every instance of the returned functions
        return (
            (date) => {
                // 1. Make a shallow copy of the Sessions
                let Sessions = [...this.state.Sessions];
                // 2. Make a shallow copy of the Session you want to mutate
                let Session = { ...Sessions[session__index] };
                // 3. Replace the property you're intested in
                Session.Session_startDate = date;
                // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
                Sessions[session__index] = Session;
                // 5. Set the state to our new copy
                this.setState({ Sessions });

            }
        )
    }

    handle_session_InputChange_factory(in_session_index) {
        const session__index = in_session_index; // closure variable different for every instance of the returned functions
        return (
            (event) => {

                const target = event.target;
                const value = target.type === 'checkbox' ? target.checked : target.value;
                const name = target.name;

                // this.setState({
                //     [name]: value
                // });

                // 1. Make a shallow copy of the Sessions
                let Sessions = [...this.state.Sessions];
                // 2. Make a shallow copy of the Session you want to mutate
                let Session = { ...Sessions[session__index] };
                // 3. Replace the property you're intested in
                Session[name] = value;
                // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
                Sessions[session__index] = Session;
                // 5. Set the state to our new copy
                this.setState({ Sessions });

            }
        )


    }

    handle_session_card_toggle_factory(in_session_index) {
        const session__index = in_session_index; // closure variable different for every instance of the returned functions
        return (
            () => {

                // 1. Make a shallow copy of the Sessions
                let Sessions = [...this.state.Sessions];
                // 2. Make a shallow copy of the Session you want to mutate
                let Session = { ...Sessions[session__index] };
                // 3. Replace the property you're intested in
                Session.isOpen = !Session.isOpen;
                // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
                Sessions[session__index] = Session;
                // 5. Set the state to our new copy
                this.setState({ Sessions });

            }
        )


    }

    handle_session_image_change_factory(in_session_index) {
        const session__index = in_session_index; // closure variable different for every instance of the returned functions
        return (
            (event) => {
                const input = event.target;
                if (input.files && input.files[0]) {
                    // TODO: validate images 

                    //copy image files state object 
                    let Sessions_images_copy = { ...this.state.Sessions_images }
                    // add (or change the image file in the copyed object)
                    Sessions_images_copy[`session_${session__index + 1}_img`] = input.files[0];
                    // reset the state.
                    this.setState({ Sessions_images: Sessions_images_copy })
                    // console.log(input.files[0])
                    var reader = new FileReader();
                    reader.onload = function (e) {

                        $('#session_image_display_' + session__index).attr('src', e.target.result);
                        var image = document.createElement('img');
                        image.src = e.target.result
                        image.addEventListener('load', function () {
                            console.log(image.width + ' × ' + image.height);
                            let image_width = image.width;
                            let image_height = image.height;
                            // let image_parent_height = $('#course_image_display').parent().height();
                            // let image_parent_width = $('#course_image_display').parent().width();
                            // console.log(image_parent_height, image_parent_width)

                            if (image.height / image.width <= 1) {

                                $('#session_image_display_' + session__index).each(function (_, img) {
                                    var $this = $(this);
                                    $this.css({
                                        width: '100%',
                                        height: 'auto',
                                    });
                                })
                            }
                            else {
                                $('#session_image_display_' + session__index).each(function (_, img) {
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

    handle_image_change(event) {

        const input = event.target;
        if (input.files && input.files[0]) {
            // TODO: validate images 
            this.setState({ new_course_img_file: input.files[0] })
            // console.log(input.files[0])
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#course_image_display').attr('src', e.target.result);
                var image = document.createElement('img');
                image.src = e.target.result
                image.addEventListener('load', function () {
                    console.log(image.width + ' × ' + image.height);
                    let image_width = image.width;
                    let image_height = image.height;
                    // let image_parent_height = $('#course_image_display').parent().height();
                    // let image_parent_width = $('#course_image_display').parent().width();
                    // console.log(image_parent_height, image_parent_width)

                    if (image.height / image.width <= 1) {

                        $('#course_image_display').each(function (_, img) {
                            var $this = $(this);
                            $this.css({
                                width: '100%',
                                height: 'auto',
                            });
                        })
                    }
                    else {
                        $('#course_image_display').each(function (_, img) {
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


    handle_increase_concepts_button() {


        if (this.state.what_will_learn.length < 20) {
            let concets = [...this.state.what_will_learn];
            let New_concets = concets.concat("");
            this.setState({
                what_will_learn: New_concets
            });
        }
        else {
            alert("you can have 20 concepts max")
        }

    }

    handle_concepts_change_factory(in_concept_index) {

        const concept__index = in_concept_index; // closure variable different for every instance of the returned functions
        return (
            (event) => {

                const target = event.target;
                const value = target.value;

                // 1. Make a shallow copy of the Sessions
                let concepts_copy = [...this.state.what_will_learn];
                concepts_copy[concept__index] = value;

                this.setState({ what_will_learn: concepts_copy });

            }
        )


    }



    new_course_submit_handler = async event => {

        event.preventDefault();

        try {
            this.setState({ sending_course_data: true })


            // ----- first sending the json data (this is sent separatly because the json data is nestd )-----

            const response = await fetch('http://localhost:5000/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.context.token ? ('Bearer ' + this.context.token) : ""

                },
                body: JSON.stringify({

                    img: this.state.new_course_img,
                    title: this.state.new_course_title,
                    author: this.state.new_course_author,
                    startDate: this.state.new_course_startDate,
                    endDate: this.state.new_course_endDate,
                    workspace_name: this.state.new_course_workspace_name,
                    rating: 0,
                    // workspace_id: this.state.new_course_workspace_id,
                    price: this.state.new_course_price,
                    description: this.state.new_course_description,
                    slogan: this.state.new_course_slogan,
                    Sessions: this.state.Sessions,
                    what_will_learn: this.state.what_will_learn.filter(concept => !!concept), // filter out any empty entry in the array  

                })
            });


            const responseData = await response.json();
            console.log(response.body);

            if (!response.ok) {
                this.setState({ form_json_error: true })
                throw new Error(responseData.message);

            }

            // ---------- second send the images ---------------------------

            //post image to the back end
            const formData = new FormData();
            formData.append('image', this.state.new_course_img_file);
            for (const [key, value] of Object.entries(this.state.Sessions_images)) {
                console.log(`${key}: ${value}`);
                formData.append(key, value);
            }

            const image_response = await fetch(`http://localhost:5000/courses/image/${responseData}`, {
                method: 'post',
                body: formData,
            })

            const response_message = await image_response.json()
            // console.log(image_Data);
            if (!image_response.ok) {
                this.setState({ image_error: true })
                console.log("response_message");
                throw new Error(response_message.message);
            }


            this.setState({ sending_course_data: false })
            if (response_message == "success") {
                this.setState({ course_submitted_successfuly: true })
            }

        } catch (err) {
            this.setState({ sending_course_data: false })
            this.setState({ error_message: err.message })
        }

    };


    render() {

        let Sessions_views = this.state.Sessions.map((session, index) => (


            <Card className="mt-1">
                <CardHeader style={this.card_head_style} className="session_card_head">
                    <Container fluid>
                        <Row className="session_header_row">
                            <Col xs="12" sm="12" md="3" lg="3" xl="3" className="px-0 session_title">
                                <div>Session {index + 1} </div>

                            </Col>
                            <Col xs="10" sm="10" md="7" lg="7" xl="7" className="pl-0 pr-2  ">
                                <Input type="text" name={"Session_title"} id={"Session_" + index + "_title"} placeholder="enter session title here"
                                    value={this.state.Sessions[index].Session_title}
                                    onChange={this.handle_session_InputChange_factory(index)} />
                            </Col>
                            <Col xs="1" sm="1" md="1" lg="1" xl="1" className="ml-lg-3 px-0  ">
                                <Button className="ml-2  " color="success" onClick={this.handle_session_card_toggle_factory(index)} >
                                    <FontAwesomeIcon icon={faChevronCircleDown} />
                                </Button>
                            </Col>
                        </Row>
                    </Container>




                </CardHeader>

                <Collapse isOpen={this.state.Sessions[index].isOpen}>
                    <CardBody>


                        <FormGroup row>
                            <Label for="Session_Description" sm={3}> <span className="Session_label">Session Description:</span></Label>
                            <Col sm={9}>
                                <Input id="Session_Description_text_area" type="textarea" name="Session_Description" placeholder="enter session description  here"
                                    value={this.state.Sessions[index].Session_Description}
                                    onChange={this.handle_session_InputChange_factory(index)} />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="session_date" sm={3}> <span className="Session_label">Session start time:</span></Label>
                            <Col sm={9}>
                                <DatePicker
                                    selected={this.state.Sessions[index].Session_startDate}
                                    onChange={this.session_date_change_handler_function_factory(index)}
                                    // showTimeSelect
                                    // timeFormat="HH:mm"
                                    // timeIntervals={15}
                                    // timeCaption="time"
                                    dateFormat="MMMM d, yyyy "
                                    shouldCloseOnSelect={false}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="session_image" sm={3}><span className="Session_label">Upload session image:</span></Label>
                            <Col sm={9} className="ml-auto">
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '250px', }}>
                                    <Input type="file" name="session_image" id="session_image"

                                        onChange={this.handle_session_image_change_factory(index)}
                                    />
                                </div>


                                <div>
                                    <FormText color="muted">
                                        choose image that represents this session
                                    </FormText>
                                    <div style={{ overflow: 'hidden', width: "250px", height: "250px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: 'dashed', borderColor: '#cac7c7', borderWidth: 'thin' }}>
                                        <img id={"session_image_display_" + index} src={upload_image_filler} alt="your image" style={{ height: "100%", width: "auto" }} />
                                    </div>
                                </div>

                            </Col>

                        </FormGroup>


                    </CardBody>
                </Collapse>
            </Card>

        ))

        let what_will_learn_view =
            () => {

                let concepts = this.state.what_will_learn.map(
                    (concept, index) => {
                        return (
                            <FormGroup  >
                                <div className="d-flex  flex-wrap flex-md-nowrap">
                                    <Label style={{ width: "140px", marginBottom: "0", marginTop: "10px" }} for={'concept_' + index} s
                                    >
                                        <span
                                            style={{ fontSize: "17px" }}

                                            className="new_course_label">
                                            {`concept ${index + 1}`} :
                                         </span>
                                    </Label>



                                    <Input style={{ minWidth: "200px" }} className="flex-grow-1 mt-1" type="text" name={'concept_' + index} id={'concept_' + index} placeholder="enter concept here"
                                        value={this.state.what_will_learn[index]}
                                        onChange={this.handle_concepts_change_factory(index)}
                                    />
                                </div>

                            </FormGroup >)
                    }

                )
                return (
                    <div >
                        { concepts}
                        < div style={{ display: "flex", justifyContent: "center", fontSize: "40px", }}>
                            <button onClick={this.handle_increase_concepts_button} type="button" class="btn btn-default btn-circle ">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div >
                    </div >
                )
            }

        let form_view = () => {
            return (
                <Form onSubmit={this.new_course_submit_handler}>
                    <FormGroup row>
                        <Label for="new_course_title" sm={3}><span className="new_course_label">Course Title:</span></Label>
                        <Col sm={9} className="ml-auto">
                            <Input type="text" name="new_course_title" id="new_course_title" placeholder="enter your course title here"
                                value={this.state.new_course_title}
                                onChange={this.handleInputChange} />
                        </Col>



                    </FormGroup>

                    <FormGroup row>
                        <Label for="course_image" sm={3}><span className="new_course_label">Upload course image:</span></Label>
                        <Col sm={9} className="ml-auto">
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '300px', }}>

                                <Input type="file" name="course_image" id="course_image"
                                    // value={this.state.new_course_title}
                                    onChange={this.handle_image_change}
                                />
                            </div>
                            <FormText color="muted">
                                This image will be used the thumb nail of your course .. choose attractive image.
                            </FormText>
                            <div>
                                <div style={{ overflow: 'hidden', width: "250px", height: "250px", display: "flex", alignItems: "center", justifyContent: "center", borderStyle: 'dashed', borderColor: '#cac7c7', borderWidth: 'thin' }}>
                                    <img id="course_image_display" src={upload_image_filler} alt="your image" style={{ height: "100%", width: "auto" }} />
                                </div>
                            </div>

                        </Col>

                    </FormGroup>

                    <FormGroup row>
                        <Label for="new_course_workspace_name" sm={3}><span className="new_course_label">Workspace:</span></Label>
                        <Col sm={9} className="ml-auto">
                            <Input type="select" name="new_course_workspace_name" id="Workspace"
                                value={this.state.new_course_workspace_name}
                                onChange={this.handleInputChange}
                            >
                                <option>No Selection</option>
                                {this.props.workspaces.map((workspace, index) => (
                                    <option style={{ fontWeight: "bold" }}>
                                        {workspace.workspace_name}
                                    </option>
                                ))}
                                {/* <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option> */}
                            </Input>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="new_course_description" sm={3}> <span className="new_course_label">Course Description:</span></Label>
                        <Col sm={9}>
                            <Input id="new_course_description" type="textarea" name="new_course_description" placeholder="enter your course description  here" value={this.state.new_course_description}
                                onChange={this.handleInputChange} />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="new_course_slogan" sm={3}> <span className="new_course_label">Course Slogan:</span></Label>
                        <Col sm={9}>
                            <Input id="new_course_slogan" type="textarea" name="new_course_slogan" placeholder="Ex: learn python from zero to hero"
                                value={this.state.new_course_slogan}
                                onChange={this.handleInputChange} />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="number_of_sessions" sm={3}> <span className="new_course_label">number of sessions:</span></Label>
                        <Col sm={9}>
                            <Input id="number_of_sessions" type="number" min="1" max="30" name="number_of_sessions" value={this.state.number_of_sessions}
                                onChange={this.handle_number_of_sessions_Change} />
                        </Col>
                    </FormGroup>

                    <FormGroup row>

                        <Label for="exampleText" sm={3}> <span className="new_course_label">Sessions:</span></Label>

                        <Col sm={9}>
                            <FormText color="muted">
                                fill in the data of the sessions ...
             </FormText>
                            {Sessions_views}
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="new_course_price" sm={3}> <span className="new_course_label">Course price :</span></Label>
                        <Col sm={5}>
                            <Input id="new_course_price" type="number" min="0" name="new_course_price" value={this.state.new_course_price}
                                onChange={this.handleInputChange} />
                        </Col>
                        <Col sm={3} style={{ fontSize: 35, color: '#82C80B', fontWeight: 'bolder', margin: "auto" }} >
                            <FontAwesomeIcon icon={faLeaf} className="mr-1" />
                            <span style={{ fontSize: 30, color: 'grey', fontWeight: 'bold' }}>
                                {' EGP'}
                            </span>
                        </Col>
                    </FormGroup>



                    <FormGroup row>
                        <Label for="new_course_what_will_learn" sm={3}> <span className="new_course_label">What concepts will students learn:</span></Label>
                        <Col sm={9}>
                            <Card className="mt-1">


                                <CardBody>

                                    {what_will_learn_view()}



                                </CardBody>
                            </Card>
                        </Col>

                    </FormGroup>

                    <FormGroup row>
                        <Col className="px-sm-5" sm={{ size: 9, offset: 3 }}>
                            <Button type="submit" color="success" style={{ width: "100%", height: " 100px", fontSize: "30px", marginTop: "50px", fontFamily: 'Nova Round' }}>
                                Submit Course <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </Col>
                        {
                            this.state.sending_course_data &&
                            <Col className="mt-3" sm={{ size: 9, offset: 3 }}>
                                <ReactLoading style={{ margin: "auto", width: '40px', height: '40px' }} type={"spinningBubbles"} color={"black"} height={'40px'} width={'40px'} />
                            </Col>
                        }
                        {!!this.state.error_message && !this.state.sending_course_data &&
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
                        course submitted Successfully
                    </div>
                    <div id="success_sub_header">
                        it will be reviewed and we will contact you withing 32 hours
                     </div>
                </div>

            )

        }

        return (
            <div id="new_course_all" >
                <Container fluid  >
                    <Row className=''>
                        <Col className="t3 mx-1 my-1   push-xl-1       image_image_image ml-lg-5" sm="12" md="12" lg={{ size: 12 }} xl={{ size: 4, order: 12 }}>
                            <div id="course_image_wrapper">
                                <h1 id="image_header">
                                    Create A Course
                                </h1>
                                <div id="course_image">
                                    <img src={new_course_image} id="new_course_image" alt="new_course_image" />
                                </div>
                            </div>
                        </Col>
                        <Col className="t2 pt-lg-5          form_box justify-content-center my-1" sm="12" md="12" lg="10" xl="7" >
                            <div id="new_course_form">
                                <div className="justify-content-center row row-content">
                                    <div className="col-12 col-lg-11 ml-auto ">

                                        {this.state.course_submitted_successfuly ? success_message() : form_view()}
                                        {/* {form_view()} */}


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

export default NewCourse;