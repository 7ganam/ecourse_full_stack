import React, { Component } from 'react';
import CourseCard from '../CourseCardComponent/CourseCardComponent';
import { Container, Row, Col } from "reactstrap";
import './FeateuredCourses_Component.css'

class FeaturedCourses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: this.props.courses,
        };

    }

    componentDidMount() {
        // this.fetchDishes()
    }

    render() {
        let courses_view = this.state.courses.map((course) => (
            <Col className="mx-1 my-1" xs="10" md="5" lg="3" xl="3" key={course._id}>
                <div className="card2">
                    <CourseCard
                        course_id={course._id}
                        img={course.img}
                        title={course.title}
                        author={course.author}
                        start_date={course.start_date}
                        workspace_name={course.workspace_name}
                        price={course.price}
                        rating={course.rating}
                    />
                </div>
            </Col>
        ))
        // console.log("props.courses", this.state.courses)
        return (
            <div id="all2">
                <Container id="title_container">
                    <h1 id="course_title2">
                        Explore Courses.. Find your best opportunity to learn
                    </h1>
                </Container>


                <Container >

                    <Row className='justify-content-center'>
                        {courses_view}
                    </Row>

                </Container>
            </div>

        );
    }
}

export default FeaturedCourses;
