import React, { Component } from 'react';
import CourseCard from '../../components/CourseCardComponent/CourseCardComponent';
import { Container, Row, Col } from "reactstrap";
import './CoursesPageComponent.css'

class CoursesPage extends Component {

    render_courses() {

        let courses = this.props.courses.map((course) => (
            <Col className="mx-1 my-1" xs="10" sm="8" md="5" lg="3" xl="3">
                <div className="CoursesPage_card2">
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
        return (courses)
    }

    render() {
        return (
            <div id="CoursesPage_all2">
                <Container id="CoursesPage_title_container">
                    <h1 id="CoursesPage_title2">
                        Explore boot camps.. Find your best oportuinty to learn
                    </h1>
                </Container>


                <Container >

                    <Row className='justify-content-center'>
                        {!this.props.coursesAreLoading && this.render_courses()}

                    </Row>

                </Container>
            </div>

        );
    }
}

export default CoursesPage;
