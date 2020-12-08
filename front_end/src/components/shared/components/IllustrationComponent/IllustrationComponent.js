import React, { Component } from "react";
import { render } from "react-dom";
import { Container, Row, Col } from "reactstrap";


import "bootstrap/dist/css/bootstrap.css";
import './Illustration.css'
import student from './student_groupe.png'
import instructor from './instructor_groupe.png'
import workspace from './workspace_groupe.png'



const Box = props => <div className="box">{props.children} </div>;

class Illustration extends Component {
    render() {
        return (
            <div>
                <Container fluid={true} id="illustration_container">

                    <Row className='justify-content-center'>
                        <Col xs="10" md="4" xl="3">
                            <img className="i" id="image1" src={instructor} alt="Kiwi standing on oval" />
                        </Col>
                        <Col xs="10" md="4" xl="3">
                            <img className="i" id="image2" src={student} alt="Kiwi standing on oval" />
                        </Col>
                        <Col xs="10" md="4" xl="3">
                            <img className="i" id="image3" src={workspace} alt="Kiwi standing on oval" />
                        </Col>
                    </Row>


                </Container>
            </div>
        );
    }
}

export default Illustration;


