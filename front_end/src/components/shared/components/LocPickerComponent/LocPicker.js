import React, { Component } from 'react';
import LocationPicker from 'location-picker';
import { Button } from 'reactstrap';
import { Container, Col, Form, Row, FormGroup, Label, Input } from 'reactstrap';

import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/* Default position */
import "./LocPicker.css"
const defaultPosition = {
    lat: 30.0444,
    lng: 31.2357
};



class LocPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: '',
            lng: '',
        };

        const google = !!window.google ? window.google : null; // google apis should be included in the index.html file in public folder

        this.handle_submit = this.handle_submit.bind(this);

    }


    componentDidMount() {
        this.lp = new LocationPicker('map', {
            setCurrentPosition: true, // You can omit this, defaults to true
        }, {
            zoom: 15 // You can set any google map options here, zoom defaults to 15
        });
        var location = this.lp.getMarkerPosition();
        this.setState({
            lat: location.lat,
            lng: location.lng
        });
    }

    handle_submit() {
        // Get current location and show it in HTML
        var location = this.lp.getMarkerPosition();
        this.setState({
            lat: location.lat,
            lng: location.lng
        });
        this.props.handle_submit(location.lat, location.lng);
    }




    render() {
        return (
            <div>
                {
                    <Container>
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12" xl="12" className="mb-2 px-0">
                                <div id="map"></div>
                            </Col>
                            <Col xs="12" sm="6" md="6" lg="6" xl="6" className=" pl-0">
                                <div className="">
                                    <Button id="confirmPosition" color="success" className=" my-1 my-md-0 " onClick={this.handle_submit}>
                                        <span>Confirm Position
                                        {/* <i class="fas fa-map-marked-alt"></i> */}
                                            <FontAwesomeIcon icon={faMapMarkedAlt} className=" ml-2" style={{ fontSize: 20, fontWeight: 'bolder' }} />
                                        </span>
                                    </Button>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6" lg="6" xl="6" className="">
                                <Input type="text" disabled name="workspaceName" id="new_workspace_name" placeholder="enter your workspace title here"
                                    value={`${this.state.lat} , ${this.state.lng} `} />
                            </Col>
                        </Row>
                    </Container>
                }





            </div>

        )
    }
}

export default LocPicker;