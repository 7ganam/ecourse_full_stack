import React, { Component } from 'react';

import Header from '../shared/components/HeaderComponent/HeaderComponent';
import Home from '../shared/pages/HomeComponent/HomeComponent';
import NewCourse from '../course/pages/NewCourseComponent/NewCourseComponent';
import NewWorkSpace from '../workspace/pages/NewWorkSpaceComponent/NewWorkSpaceComponent';
import CourseView from '../course/pages/CourseViewComponent/CourseViewComponent';
import WorkSpaceView from '../workspace/pages/WorkSpaceViewComponent/WorkSpaceViewComponent';
import Footer from '../shared/components/FooterComponent'
import Coursespage from '../course/pages/CoursesPageComponent/CoursesPageComponent';
import WorkspacesPage from '../workspace/pages/WorkspacesPageComponent/WorkspacesPageComponent';
import AuthPage from "../shared/pages/AuthPageComponent/AuthPageComponent"
import Auth from "../shared/components/AuthModalComponent/AuthModalComponent"
import LoginModal from "../shared/components/loginModalComponent/loginModalComponent"
import SignUpModal from "../shared/components/signUpModalComponent/signUpModalComponent"



import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";



// FOR TESTING -------------------------------------------------------
// import * as COURSES_DATA from '../../shared/courses_data.json';
import * as WORKSPACES_DATA from '../../shared/workspaces_data.json';

import { baseUrl } from "../../shared/baseURL"

import { AuthContext } from '../shared/context/auth-context';
import { faTextHeight } from '@fortawesome/free-solid-svg-icons';





class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            courses_are_loading: true,
            workspaces: WORKSPACES_DATA.default,
            workspaces_are_loading: true,
            isLoggedIn: false,
            show_auth_modal: false,
            show_login_modal: false,
            show_signup_modal: false,
            user: {},
            token: "",
        };

        this.fetchCourses = this.fetchCourses.bind(this);
        this.fetchWorkspaces = this.fetchWorkspaces.bind(this);

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);


        this.set_show_login_modal = this.set_show_login_modal.bind(this);
        this.unset_show_login_modal = this.unset_show_login_modal.bind(this);

        this.set_show_signup_modal = this.set_show_signup_modal.bind(this);
        this.unset_show_signup_modal = this.unset_show_signup_modal.bind(this);

        this.set_user = this.set_user.bind(this);


    }


    login(token, input_user, expirateion_date_string) {
        this.setState({ isLoggedIn: true });
        this.setState({ token: token });
        this.setState({ user: input_user })
        this.setState({ expirateion_date_string: expirateion_date_string })

        console.log({ expirateion_date_string })
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: input_user.id,
                user: input_user,
                token: token,
                expirateion_date_string: expirateion_date_string,
                //   expiration: tokenExpirationDate.toISOString()
            })
        );
    };
    logout() {
        this.setState({ isLoggedIn: false });
        this.setState({ token: null });
        this.setState({ user: false })
        localStorage.removeItem('userData');
    };

    set_show_login_modal() {
        this.setState({ show_login_modal: true });
    }
    unset_show_login_modal() {
        this.setState({ show_login_modal: false });
    }
    set_show_signup_modal() {
        this.setState({ show_signup_modal: true });
    }
    unset_show_signup_modal() {
        this.setState({ show_signup_modal: false });
    }

    set_user(input_user) {
        this.setState({ user: input_user })
    }

    componentDidMount() {
        this.fetchCourses()
        this.fetchWorkspaces()
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token) {
            this.login(storedData.token, storedData.user);
        }
    }
    fetchCourses = () => {
        return fetch(baseUrl + 'courses')
            .then(response => response.json())
            .then(recieved_courses => {
                // console.log("coursesd", coursesd)
                this.setState({ courses: recieved_courses })
                this.setState({ courses_are_loading: false })
            });
        //TODO:: error handling 
    }
    fetchWorkspaces = () => {
        return fetch(baseUrl + 'workspaces')
            .then(response => response.json())
            .then(recieved_workspaces => {
                // console.log("coursesd", coursesd)
                this.setState({ workspaces: recieved_workspaces })
                this.setState({ workspaces_are_loading: false })
            });
        //TODO:: error handling 
    }


    render() {

        const course_with_id = ({ match }) => {
            return (
                <CourseView
                    course={this.state.courses.filter((course) => course._id === match.params.course_id)[0]}
                    isLoading={this.state.courses_are_loading}  // every component that depends on data fetched should be notified if the data arrived or not so id dosen't render undefined data
                // errMess={this.props.dishes.errMess}
                />
            );
        };

        const workspace_with_id = ({ match }) => {
            return (
                <WorkSpaceView workspace={this.state.workspaces.filter((workspace) => workspace._id === match.params.workspace_id)[0]}
                    isLoading={this.state.workspaces_are_loading}
                // errMess={this.props.dishes.errMess}
                />
            );
        };

        return (
            <div id="main_component">
                <AuthContext.Provider
                    value={{

                        isLoggedIn: this.state.token ? true : false,  // if we have a token we are logged in  
                        login: this.login,
                        logout: this.logout,
                        token: this.state.token,


                        show_auth_modal: this.state.show_auth_modal,
                        set_show_auth_modal: this.set_show_auth_modal,
                        unset_show_auth_modal: this.unset_show_auth_modal,

                        show_login_modal: this.show_login_modal,
                        set_show_login_modal: this.set_show_login_modal,
                        unset_show_login_modal: this.unset_show_login_modal,

                        show_signup_modal: this.show_signup_modal,
                        set_show_signup_modal: this.set_show_signup_modal,
                        unset_show_signup_modal: this.unset_show_signup_modal,

                        user: this.state.user,
                        set_user: this.set_user,
                    }}
                >
                    <LoginModal showModal={this.state.show_login_modal} />
                    <SignUpModal showModal={this.state.show_signup_modal} />
                    <div id="content-wrap">
                        <Router >
                            <Header />
                            <Route exact path="/">
                                <Home courses={this.state.courses}
                                    coursesAreLoading={this.state.courses_are_loading}
                                    workspaces={this.state.workspaces}
                                    workspacesAreLoading={this.state.workspaces_are_loading}
                                />
                            </Route>

                            <Route exact path="/workspaces">
                                <WorkspacesPage workspaces={this.state.workspaces} workspacesAreLoading={this.state.workspaces_are_loading} />
                            </Route>

                            <Route exact path="/courses">
                                <Coursespage courses={this.state.courses} coursesAreLoading={this.state.courses_are_loading} />
                            </Route>

                            <Route path="/newcourse">
                                <NewCourse workspaces={this.state.workspaces} />
                            </Route>

                            <Route path="/newworkspace">
                                <NewWorkSpace />
                            </Route>

                            <Route path="/courseview">
                                <CourseView />
                            </Route>
                            <Route path="/workspaceview">
                                <WorkSpaceView workspace={this.state.workspaces[0]} />
                            </Route>

                            <Route path="/courses/:course_id" component={course_with_id} />

                            <Route path="/workspaces/:workspace_id" component={workspace_with_id} />

                            <Route path="/auth" component={AuthPage} />
                            {/* <MapContainer /> */}

                        </Router>
                    </div>


                </AuthContext.Provider>
                <Footer />

            </div >
        );
    }
}

export default Main;