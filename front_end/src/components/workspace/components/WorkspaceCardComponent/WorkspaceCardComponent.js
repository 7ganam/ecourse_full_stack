import React from 'react';
// import "./styles.css";
import ReactStars from "react-rating-stars-component";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import "./WorkspaceCard.css"

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
//import { baseUrl } from "../../../../shared/baseURL"

const WorkspaceCard = (props) => {

    const rating_data = {
        size: 20,
        // number: props.rating,
        number: props.rating,
        value: props.rating,
        edit: false,
        activeColor: "#63C019",
        isHalf: true,

    };
    return (
        <div>
            <Card>
                <CardImg top
                    src={process.env.REACT_APP_BACKEND_URL + "uploads/images/workspaces/" + props.img} alt={process.env.REACT_APP_BACKEND_URL + "uploads/images/workspaces/" + props.img}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://egycourses.herokuapp.com/logo1.png" }}
                />
                <CardBody>
                    <CardTitle ><h4 className="workspace_card_title">{props.title}</h4></CardTitle>
                    {/* <CardSubtitle>Author:</CardSubtitle> */}
                    <ReactStars {...rating_data} />
                    <CardText>

                        <div>
                            <span className="workspace_card_text_main"> address: </span>
                            <span >  {props.address}    </span>
                        </div>

                    </CardText>
                    <Link to={`/WORKSPACES/${props.workspace_id}`} >
                        <Button style={{ width: "100%" }} color="success" >Explore workspace </Button>
                    </Link >
                </CardBody>
            </Card>
        </div >
    );
};

export default WorkspaceCard;