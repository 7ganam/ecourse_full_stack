import React, { Component } from 'react';
import { Container, Col, Form, Row, FormGroup, Label, Input, Button } from 'reactstrap';
import { Collapse, Navbar, Nav, NavItem, NavLink, NavbarToggler, NavbarBrand } from 'reactstrap';
import { CardImg, CardSubtitle, } from 'reactstrap';
// import { Card, Button, CardHeader, CardFooter, CardBody,  CardTitle, CardText } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
import { Card, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import { Jumbotron } from 'reactstrap';

import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { baseUrl } from "../../../../shared/baseURL"
import './CourseViewComponent.css'


import connected_dots from './bg.jpg'
function What_will_you_learn_view(props) {
    let concepts_array = props.what_will_learn;
    let first_half_concepts = concepts_array.slice(0, Math.ceil(concepts_array.length / 2));
    let second_half_concepts = concepts_array.slice(Math.ceil(concepts_array.length / 2), concepts_array.length);
    let first_half_views = first_half_concepts.map((concept_text, index) => (
        <p>
            <FontAwesomeIcon icon={faCheckCircle} className=" mr-2" style={{ fontSize: 15, color: '#82C80B', fontWeight: 'bolder' }} />
            {concept_text}
        </p>
    ))
    let second_half_views = second_half_concepts.map((concept_text, index) => (
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


class CourseView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Sessions: [],// this.props.course.Sessions, // i need to keep the sessions in state because the closed opened of the cards is stored in it ... this is a bad design TODO: fix this issue later
            isLoading: this.props.isLoading,
            course: [],
        };
        this.course_view = this.course_view.bind(this);

    }


    static getDerivedStateFromProps(props, state) { //this is used to set the state to the new props value .. it should used with care as it might cause infinit rendering loop
        if (!!props.course && (props.course.length !== state.course.length)) { // this condition needs to be revisted ... it just worked so i will let it as is now
            return {
                isLoading: props.isLoading,
                course: props.course,
                Sessions: props.course.Sessions,
            };
        }
        return null;
    }


    rating_stars_confs() {
        let x = {
            size: 30,
            value: this.state.course.rating,
            edit: false,
            activeColor: "#63C019",
            isHalf: true,
        }
        return (x)
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

    loading_component = () => { return (<div style={{ marginTop: "200px" }}>loading .... </div>) }

    course_view = () => {

        let parse_date = (Session_startDate) => {
            let ymd = Session_startDate.split("T")[0]
            let ymdarr = ymd.split("-")
            let year = ymdarr[0]
            let month = ymdarr[1]
            let day = ymdarr[2]
            console.log(year)
            return (year + '/' + month + '/' + day)
        }

        let Sessions_views = this.state.Sessions.map((session, index) => (
            <Card className="mt-2 mx-2">
                <CardHeader style={{ fontSize: "15px" }} className="session_card_head">
                    <div className=" d-flex    flex-row  align-content-center align-items-center" id="header_content_alijfe">
                        <div className="d-inline-block " style={{ minWidth: "80px" }}>
                            <span className="session_title_start" >Session {index + 1} :</span>
                        </div>
                        <div className="d-inline-block flex-grow-1 ml-4 flex-fill ">

                            <div title={this.state.Sessions[index].Session_title} id="session_card_title" >
                                {this.state.Sessions[index].Session_title}
                            </div>

                        </div>
                        <div className="d-inline-block ">

                            <Button color="success" onClick={this.handle_session_card_toggle_factory(index)} >
                                <FontAwesomeIcon icon={faChevronCircleDown} />
                            </Button>

                        </div>
                    </div>


                </CardHeader>

                <Collapse isOpen={this.state.Sessions[index].isOpen}>
                    <CardBody id="session_card_body" className="pt-0"  >
                        <Row>
                            <Col md={5}>
                                <div id="session_img_continer">
                                    <img id="session_view_img" top

                                        src={
                                            !!this.state.Sessions[index].Session_image ?
                                                `${baseUrl}/uploads/images/courses/${this.state.Sessions[index].Session_image}` :
                                                baseUrl + "grey.jpeg"

                                        }

                                        alt=" image cap" />
                                </div>
                            </Col>
                            <Col md={7}>
                                <div id="session_conten_container">
                                    <span style={{ fontSize: "25px", fontFamily: "Nova Round", color: "#00b33c" }}>{"Date: "}</span>
                                    <span>
                                        {!!this.state.Sessions[index].Session_startDate &&
                                            parse_date(this.state.Sessions[index].
                                                Session_startDate)
                                        }
                                    </span>
                                    <div>
                                        <span style={{ fontSize: "25px", fontFamily: "Nova Round", color: "#00b33c" }}>{"Description: "}</span>

                                        <span>
                                            {this.state.Sessions[index].Session_Description}
                                        </span>

                                    </div>

                                </div>
                            </Col>


                        </Row>





                    </CardBody>
                </Collapse>
            </Card>
        ))
        return (
            <div id="CourseViewComponent_all" className="mx-1">
                <Jumbotron id="course_jumb" className="jumb"
                    //  styles={{ backgroundImage: `url(${connected_dots})` }}
                    style={{ backgroundImage: `url(${connected_dots})`, backgroundSize: 'cover' }}
                >
                    <Container className="course_jumb_container">
                        <Row id="row_1">
                            {/* <Col sm="12" md={{ size: 6, offset: 6 }} className="mr-auto">.col-sm-12 .col-md-6 .offset-md-3</Col> */}
                            <Col sm={{ size: 6, order: 1, offset: 0 }}>
                                <h1 className="hyphens" style={{ color: "white", fontSize: "45px", fontWeight: "bolder" }} >
                                    {this.props.course.title}
                                </h1>
                                <h4>
                                    {this.props.course.course_slogan}
                                </h4>
                                <div id="rating_container">
                                    <span id="rating_number">{this.props.course.rating}</span>
                                    <span>
                                        <ReactStars {...this.rating_stars_confs()} />
                                    </span>
                                </div>
                            </Col>

                        </Row>
                        <Row>
                            <div id="course_snippit_info" className="mt-3">
                                <div className="mr-4" >
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" style={{ color: "white" }} />
                                    <span style={{ color: "white" }} className="mr-1"> instructor:</span>
                                    <span style={{ color: "white" }} className="mr-1"> {this.props.course.author}</span>
                                </div >

                                {/* <div >
                                    <FontAwesomeIcon icon={faClock} className="mr-1" style={{ color: "white" }} />

                                    <span style={{ color: "white" }}> Start date:</span>

                                    <span style={{ color: "white" }}> {this.props.course.start_date}</span>
                                </div> */}

                                <div>

                                </div>

                            </div>
                        </Row>
                    </Container>
                </Jumbotron>
                <Container id='floatin_container' className="">
                    <Row id="floatin_row" className=" ">
                        <Col lg={{ size: 4, order: 1, offset: 0 }} className=" ml-auto p-0">
                            <div >

                                <Card>
                                    <CardImg top src={`${baseUrl}/uploads/images/courses/${this.props.course.img}`} alt="Card image cap" style={{ height: '15rem', objectFit: 'cover' }} />
                                    <CardBody>
                                        <CardTitle>

                                            <span style={{ fontSize: 35, color: '#82C80B', fontWeight: 'bolder' }}>
                                                {this.props.course.price}
                                            </span >
                                            {/* <i class="fas fa-leaf" style={{ fontSize: 35, color: '#82C80B', fontWeight: 'bolder' }}></i> */}
                                            <FontAwesomeIcon icon={faLeaf} className="mr-1" style={{ fontSize: 35, color: '#82C80B', fontWeight: 'bolder' }} />
                                            <span style={{ fontSize: 20, color: 'grey', fontWeight: 'bold' }}>
                                                {' EGP'}
                                            </span>
                                        </CardTitle>
                                        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                        <Button className="bg-success" style={{ fontWeight: 'bold', }}>REGISTER NOW</Button>
                                    </CardBody>
                                    <CardFooter>Footer</CardFooter>
                                </Card>

                            </div>

                        </Col>

                    </Row>
                </Container>

                <Container id="main_content_container" >
                    <Row id="row_1">
                        {/* <Col sm="12" md={{ size: 6, offset: 6 }} className="mr-auto">.col-sm-12 .col-md-6 .offset-md-3</Col> */}
                        <Col lg={{ size: 8, order: 1, offset: 0 }}>
                            <Card>

                                <CardBody>
                                    <CardTitle className="card_title122">What will you learn </CardTitle>
                                    <div id="whatwilllearncontent">

                                        <What_will_you_learn_view what_will_learn={this.props.course.what_will_learn} />


                                    </div>

                                </CardBody>
                            </Card>




                        </Col>
                    </Row>

                    <Row id="row_2" className="mt-5 ">
                        <Col className="" lg={{ size: 8, order: 1, offset: 0 }}>
                            <h2 className="px-3 text-center  ">
                                Course description
                                        </h2>
                            <p className="px-3">
                                {this.props.course.description}
                            </p>
                        </Col>
                    </Row>

                </Container>



                <Container >
                    <Row>
                        <Col className="" lg={{ size: 8, order: 1, offset: 0 }}>
                            {Sessions_views}
                        </Col>
                    </Row>
                </Container>

            </div >)
    }

    render() {

        return (
            this.state.isLoading ? this.loading_component() : this.course_view()
        );
    }
}

export default CourseView;