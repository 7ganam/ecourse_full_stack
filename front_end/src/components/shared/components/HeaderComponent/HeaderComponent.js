import {
    Navbar, NavbarBrand, Nav, NavbarToggler, Collapse,
    NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label, Container, Row
} from 'reactstrap';
// import { div } from 'react-router-dom';
import React, { Component } from 'react';
import "./Header.css"
import { baseUrl } from '../../../../shared/baseURL';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { AuthContext } from '../../context/auth-context';

import $ from 'jquery';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false,
            nav_class_name: ""
        };
        this.toggleNav = this.toggleNav.bind(this);
        this.closeNav = this.closeNav.bind(this);

        this.login = this.login.bind(this);
        this.show_login_modal = this.show_login_modal.bind(this);
        this.show_singup_modal = this.show_singup_modal.bind(this);




    }

    componentDidMount() {
        let closure_closeNav = this.closeNav; // since this is't defined inside jqury i will pass it as closure
        $('body').click(function (event) {
            // check if the clicked element is a descendent of navigation 
            if ($(event.target).closest('.navbar').length) {
                return; //do nothing if event target is within the navigation
            } else {
                // do something if the event target is outside the navigation
                // code for collapsing menu here...
                closure_closeNav()
            }
        });
    }

    static contextType = AuthContext;
    show_login_modal() {
        this.context.set_show_login_modal();
        // console.log(this.context)
    }

    show_singup_modal() {
        this.context.set_show_signup_modal();
        // console.log(this.context)
    }

    componentDidUpdate(nextProps) {
        // console.log("next", nextProps)
        const logs = this.context
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
        if (!this.state.isNavOpen) {
            this.setState({
                nav_class_name: "navbar-collapsed"
            });
        }
        else if (this.state.isNavOpen) {
            this.setState({
                nav_class_name: ""
            });
        }

    }

    closeNav() {
        this.setState({
            isNavOpen: false
        });
        if (!this.state.isNavOpen) {
            this.setState({
                nav_class_name: "navbar-collapsed"
            });
        }


    }

    login() {
        this.context.login();

    }


    render() {
        return (
            <div className={this.state.nav_class_name}>
                <Navbar light className="light py-1  border-bottom fixed-top" expand="xl">
                    <div style={{
                        position: "relative",
                        top: "-5px"
                    }} >
                        <NavbarBrand className="mr-auto" href="/">
                            <img src={process.env.REACT_APP_BACKEND_URL + 'small_logo.png'} height="40" width="40" alt='' />
                            <span className="brand_title">ecourse</span>
                        </NavbarBrand>
                    </div>
                    <NavbarToggler onClick={this.toggleNav} className="mr-2" />

                    <Collapse className="" isOpen={this.state.isNavOpen} navbar>

                        <Nav className="ml-xl-3">
                            <NavItem className=''>
                                <form className="form-inline " style={{ flexFlow: "row" }}>
                                    <div className="md-form my-0">
                                        <input className="form-control" type="text" placeholder="Search" aria-label="Search" />
                                    </div>
                                    <Button
                                        color="success" href="#!" className="btn btn-outline-white btn-md my-0 ml-sm-2" type="submit">Search</Button>
                                </form>
                            </NavItem>
                        </Nav>


                        <Nav style={{}} className="ml-4 ml-xl-auto" navbar>

                            <NavItem onClick={this.closeNav}>

                                <Link to="/">
                                    <div className="nav-link" to='/home'><span className="fa fa-home fa-lg"></span> Home</div>
                                </Link>

                            </NavItem>
                            <NavItem onClick={this.closeNav} className=''>
                                <Link to="/newcourse">
                                    <div className="nav-link" to='/aboutus'><span className="fa fa-info fa-lg"></span> Add new course</div>
                                </Link>

                            </NavItem>
                            <NavItem onClick={this.closeNav} className=''>
                                <Link to="/newworkspace">
                                    <div className="nav-link" to='/menu'><span className="fa fa-list fa-lg"></span> Add your workspace</div>
                                </Link>

                            </NavItem>
                            <NavItem onClick={this.closeNav} className=''>
                                <Link to="/COURSES">
                                    <div className="nav-link" to='/COURSES'><span className="fa fa-address-card fa-lg"></span>  Courses</div>
                                </Link>
                            </NavItem>
                            <NavItem onClick={this.closeNav} className=''>
                                <Link to="/WORKSPACESVIEW">
                                    <div className="nav-link" to='/WORKSPACESVIEW'><span className="fa fa-address-card fa-lg"></span>  Workspaces</div>
                                </Link>
                            </NavItem>
                            {!this.context.isLoggedIn &&
                                <Button onClick={this.show_login_modal} id="" className="my-1 mr-md-2 " outline ><span className="fa fa-sign-in fa-lg "></span> Login</Button>
                            }
                            {!this.context.isLoggedIn &&
                                <Button onClick={this.show_singup_modal} color="success" id="" className=" my-1 mr-md-2 "  ><span className="fa fa-sign-in fa-lg"></span> Sign Up</Button>
                            }

                            {this.context.isLoggedIn &&
                                <NavItem onClick={this.closeNav} className=''>
                                    <Button onClick={this.context.logout} color="success" id="" className=" my-1 mr-md-2 "  ><span className="fa fa-sign-in fa-lg"></span> Sign out</Button>
                                    <img src={`${process.env.REACT_APP_BACKEND_URL}uploads/images/users/${this.context.user.image}`} alt="Avatar" class="avatar" ></img>

                                </NavItem>
                            }

                        </Nav>

                    </Collapse>

                </Navbar>
            </div >
        );
    }
}

export default Header;