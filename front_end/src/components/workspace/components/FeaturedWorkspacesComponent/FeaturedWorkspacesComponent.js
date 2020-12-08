import React, { Component } from 'react';
// import CourseCard from '../course/components/CourseCardComponent/CourseCardComponent';
import WorkspaceCard from '../WorkspaceCardComponent/WorkspaceCardComponent';

import { Container, Row, Col } from "reactstrap";
import './FeaturedWorkspacesComponent.css'

class FeaturedWorkspaces extends Component {


    workspaces = this.props.workspaces.map((workspace) => (
        <Col className="mx-1 my-1" xs="10" sm="8" md="5" lg="3" xl="3" key={workspace._id}>
            <div className="card2" key={workspace._id}>
                <WorkspaceCard
                    key={workspace._id}
                    workspace_id={workspace._id}
                    img={workspace.logo_image}
                    title={workspace.workspace_name}
                    price={workspace.session_price}
                    rating={workspace.rating}
                    address={workspace.address}
                />
            </div>
        </Col>
    ))
    render() {
        return (
            <div id="all2">
                <Container id="title_container">
                    <h1 id="title2">
                        Explore Work spaces
                    </h1>
                </Container>


                <Container >

                    <Row className='justify-content-center'>
                        {this.workspaces}
                    </Row>

                </Container>
            </div>

        );
    }
}

export default FeaturedWorkspaces;
