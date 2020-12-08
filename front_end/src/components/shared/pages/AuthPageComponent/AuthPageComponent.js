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

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


import Auth from "../../components/AuthModalComponent/AuthModalComponent"
import { AuthContext } from '../../context/auth-context';

class Authpage extends Component {
    constructor(props) {
        super(props);
        this.show_modal = this.show_modal.bind(this);

    }

    static contextType = AuthContext;
    show_modal() {
        this.context.set_show_auth_modal();
        console.log(this.context)
    }


    render() {
        return (
            <div style={{ marginTop: "222px" }} >
                <Button onClick={this.show_modal} id="" className="my-1 mr-md-2 " outline ><span className="fa fa-sign-in fa-lg "></span> show</Button>
                {/* <Auth showModal={this.context.show_auth_modal} /> */}
            </div>

        )

    }
}

export default Authpage;