import React from 'react';
// import "./styles.css";
import ReactStars from "react-rating-stars-component";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import "./CourseCard.css"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import error_image from './logo1.png'

// //import { baseUrl } from "../../../../shared/baseURL"
const CourseCard = (props) => {

    const firstExample = {
        size: 20,
        value: props.rating,
        edit: false,
        activeColor: "#63C019",
        isHalf: true,

    };



    return (
        <div>
            <Card title={props.title}>
                {/* 
                <CardImg id="card_image22" top
                 src={process.env.REACT_APP_BACKEND_URL + "uploads/images/courses/" + props.img}
                    onerror="this.style.display='none'"
                /> */}
                <CardImg top
                    src={process.env.REACT_APP_BACKEND_URL + "uploads/images/courses/" + props.img}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://egycourses.herokuapp.com/logo1.png" }}
                />

                <CardBody>
                    <CardTitle ><h4 className="card_title">{props.title}</h4></CardTitle>
                    {/* <CardSubtitle>Author:</CardSubtitle> */}
                    <ReactStars {...firstExample} />
                    <CardText>
                        <div className="card_text no_overflow">
                            <span className="card_text_main"> Author:</span>
                            <span className="card_text ">{props.author} </span>
                        </div>
                        <div>
                            <span className="card_text_main"> Date: </span>
                            <span >  {props.start_date}    </span>
                        </div>
                        <div>
                            <span className="card_text_main">   workspace:   </span>
                            <span >  {props.workspace_name}  </span>
                        </div>
                    </CardText>
                    <Link to={`/COURSES/${props.course_id}`} >
                        <Button color="success" >Find more <span className="card_text_main"></span></Button>
                    </Link >
                </CardBody>
            </Card>
        </div >
    );
};

export default CourseCard;