import React, { Component } from 'react';
//import logo from './logo.svg';
//import ReactDOM from 'react-dom';
import { Button, Icon, Input, Layout, Menu, message, Select, Card, Popover, Modal, Steps, Col, Row } from 'antd';
import { BrowserRouter, Route, Link } from 'react-router-dom';
// import {createHashHistory} from 'history';
// import Head from '@/pages/Head';
import Welcome from '@/pages/Welcome';
import B_O_Add from '@/pages/booking/BookingOfAdd';
import B_O_HY from '@/pages/booking/BookingOfHY';
import B_O_Time from '@/pages/booking/BookingOfTime';
import Meeting_Book from '@/pages/meeting/BookMeeting';
import Meeting_Mine from '@/pages/meeting/SearchMeeting';
import Meeting_Manage from '@/pages/manage/MeetingManage';
import golbal from '@/golbal';
import '@/css/Layout.css';
import '@/css/LoginCard.css';
import '@/App.css';
import logo from "@/img/logo/logo1024.png";
import FindHY from "./pages/user/FindHY";
import UserInfo from "./pages/user/UserInfo";
import Group from "./pages/user/Group";
import MyJoinMeeting from "./pages/myMeeting/MyJoinMeeting";
import RoleManage from "./pages/manage/RoleManage";
import MyMeetLeave from "./pages/myMeeting/MyMeetLeave";
import DepartManage from "./pages/manage/DepartManage";
import EquipManage from "./pages/manage/EquipManage";
import MeetRoomManage from "./pages/manage/MeetRoomManage";
import MeetParaManage from "./pages/manage/MeetParaManage";
import PersonManage from "./pages/manage/PersonManage";
import FaceManage from "./pages/manage/FaceManage";
import JoinPersonManage from "./pages/manage/JoinPersonManage";
import MeetInfoManage from "./pages/manage/MeetInfoManage";
import GGDemo1 from "./pages/graph/GGDemo1";
import GGIndex from "./pages/graph/GGIndex";
// import ViserDemo1 from "./pages/graph/ViserDemo1";
import BizDemo from "./pages/graph/BizDemo";
import ManageIndex from "./pages/manage/ManageIndex";
import EquipRepairManage from "./pages/manage/EquipRepairManage";
import OthersFaceManage from "./pages/myMeeting/OthersFaceManage";
import DoorManage from "./pages/manage/DoorManage";
import FileManage from "./pages/manage/FileManage";
import WeekMeetManage from "./pages/manage/WeekMeetManage";
import DetailManage from "./pages/manage/DetailManage";
import WeekMeeting from "./pages/meeting/WeekMeeting";
import DoorApply from "./pages/others/DoorApply";
import EquipRepair from "./pages/others/EquipRepair";
import BookMeetingManager from "./pages/manage/BookMeetingManager";
import MyVideoMeet from "./pages/myMeeting/MyVideoMeet";
import Cookies from 'js-cookie';

class App extends Component {
    componentWillMount() {
        this.hadLog();
        this.toManager();
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            mode: "user mode",
            GLY_Mode: false,
            display_Head: 'none',
            display_Forget: 'none',
            display_Change: 'none',
            display_ChangeSuccess: 'none',
            display_Menu: 'none',
            display_Login: 'none',
            display_GLY: 'none',
            display_User: 'none',
            display_Visitor: 'block',
            display_name: 'block', //???????????????display?????????
            disabled_getCode: false,
            menu_mode: 'inline',//vertical
            width: '200px',
            collapsed: false,//??????????????????
            username: "",
            password: "",
            new_password: "",
            phone: "",
            phone_code: "",
            pwd_code: "!!!",
            codeTime: 0,
            visible: false,
            name: "Please Login",
            loading: false,
            roleList: [],
            loginFlag: 0,
        }
    }

    /////////////////////////////////////////////////Input?????????????????????/////////////////////////////////////////////////

    //username?????????
    usernameChange = (e) => {
        this.setState({ username: e.target.value })
    }
    //password?????????
    passwordChange = (e) => {
        this.setState({ password: e.target.value })
    }
    //??????????????????
    phoneChange = (e) => {
        this.setState({ phone: e.target.value })
    }
    //??????????????????
    phoneCodeChange = (e) => {
        this.setState({ phone_code: e.target.value })
    }
    //newPassword?????????
    newPasswordChange = (e) => {
        this.setState({ new_password: e.target.value })
    }
    /////////////////////////////////////////////////????????????/////////////////////////////////////////////////
    //???????????????
    compareCode = () => {
        if (this.state.phone_code === this.state.pwd_code) {
            message.success("Verification succeeded!");
            this.showChangePwd();
        } else {
            message.error("Verification failed!");
        }
    }
    //???????????????????????????
    comparePassword = () => {
        if (this.state.password === this.state.new_password) {
            this.changePwd();
        } else {
            message.error("??????????????????????????????");
        }
    }
    //Get verification code60s
    codeTime = () => {
        const timer = setInterval(() => {
            // console.log(this.state.codeTime);
            if (this.state.codeTime > 0) {
                this.setState({
                    codeTime: this.state.codeTime - 1
                });
            } else {
                this.setState({
                    disabled_getCode: false,
                });
                clearInterval(timer);
            }
        }, 1000);
    }
    /////////////////////////////////////////////////????????????????????????????????????/////////////////////////////////////////////////
    //??????????????????
    showForget = () => {
        this.setState({
            display_ChangeSuccess: 'none',
            display_Change: 'none',
            display_Head: 'none',
            display_Forget: 'block',
            display_Login: 'none',
        });
    }
    //??????????????????
    showChangePwd = () => {
        this.setState({
            display_ChangeSuccess: 'none',
            display_Change: 'block',
            display_Head: 'none',
            display_Forget: 'none',
            display_Login: 'none',
        });
    }
    //??????????????????
    showChangeSuccess = () => {
        this.setState({
            display_ChangeSuccess: 'block',
            display_Change: 'none',
            display_Head: 'none',
            display_Forget: 'none',
            display_Login: 'none',
        });
    }
    //Return to login??????
    showLogin = () => {
        this.setState({
            display_ChangeSuccess: 'none',
            display_Change: 'none',
            display_Head: 'none',
            display_Forget: 'none',
            display_Login: 'block',
        });
    }
    /////////////////////////////////////////////////??????/////////////////////////////////////////////////
    //??????
    logUp = () => {
        message.warn("Sorry, the registration system is not yet open, please contact the administrator to apply for an account, thank you");
    }
    //???????????????
    enterLoading = () => {
        this.setState({ loading: true });
        this.sendAjax();
        this.overLoading();
    }
    //?????????????????????2???
    overLoading = () => {
        setInterval(() => { this.setState({ loading: false }) }, 2000);
    }
    /////////////////////////////////////////////////?????????/////////////////////////////////////////////////
    //?????????????????????
    nameChange = (e) => {
        this.setState({ name: e })
    }
    //????????????
    loginOut = () => {
        this.setState({
            GLY_Mode: false,
            display_Head: 'none',
            display_Forget: 'none',
            display_Menu: 'none',
            display_Login: 'block',
            name: "Please Login",
        });
    }
    /////////////////////////////////////////////////4???fetch??????/////////////////////////////////////////////////
    //?????????????????????
    getPhoneCode = () => {

        const phone = this.state.phone;//this.state.username;
        // const url="http://39.106.56.132:8080/pwdCode?phone="+phone;
        const url = golbal.localhostUrl + "pwdCode?phone=" + phone;
        if (phone === "") {
            message.warning("????????????????????????");
        } else {
            fetch(url, {
                method: "POST",
                //type:"post",
                //url:"http://39.106.56.132:8080/userinfo/tologin",
                mode: "cors",
                credentials: "include",//????????????cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({}),
            }).then(function (res) {//function (res) {} ??? res => {}????????????
                return res.json()
            }).then(json => {
                // get result
                const data = json;
                // console.log(data);
                if (data.status === true) {
                    message.success("?????????????????????");
                    this.setState({
                        pwd_code: data.data,
                        disabled_getCode: true,
                        codeTime: 60,
                    }, this.codeTime);

                } else if (!data.status) {
                    message.error("The phone number is incorrect!");
                }

            }).catch(function (e) {
                console.log("fetch fail");
                // alert('system error');
            });

        }
    }
    //Edit Password
    changePwd = () => {
        const phone = this.state.phone;//this.state.username;
        const password = this.state.password;
        // const url="http://39.106.56.132:8080/forgetPwd?phone="+phone+"&password="+password;
        const url = golbal.localhostUrl + "forgetPwd?phone=" + phone + "&password=" + password;
        fetch(url, {
            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
            mode: "cors",
            credentials: "include",//????????????cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} ??? res => {}????????????
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if (data.status === true) {
                message.success("?????????????????????");
                this.showChangeSuccess();
            } else {
                message.error("????????????????????????");
            }

        }).catch(function (e) {
            console.log("fetch fail");
            // alert('system error');
        });
    }
    //???????????????????????????
    toManager = () => {
        // const url="http://39.106.56.132:8080/forgetPwd?phone="+phone+"&password="+password;
        const url = golbal.localhostUrl + "manager/toManager";
        fetch(url, {
            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
            mode: "cors",
            credentials: "include",//????????????cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} ??? res => {}????????????
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if (data.data !== undefined) {
                this.setState({
                    roleList: data.data,
                })
            }
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //??????????????????
    sendAjax = () => {
        //POST??????,IP?????????IP
        const username = this.state.username;//this.state.username;
        const password = this.state.password;//this.state.password;
        // const url="http://39.106.56.132:8080/login?username="+username+"&password="+password;
        const url = golbal.localhostUrl + "login?username=" + username + "&password=" + password;
        if (username === "" || password === "") {
            message.warning("Username or password cannot be empty???");
        } else {
            fetch(url, {

                method: "POST",
                //type:"post",
                //url:"http://39.106.56.132:8080/userinfo/tologin",
                mode: "cors",
                credentials: "include",//????????????cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ username: username, password: password }),
            }).then(function (res) {//function (res) {} ??? res => {}????????????
                return res.json()
            }).then(json => {
                // get result
                const data = json;
                console.log(data);
                if (data.status === true) {
                    this.nameChange(data.data.name);
                    message.success("Login success???");
                    this.toManager();
                    this.setState({
                        mode: "user mode",
                        display_Head: 'block',
                        display_Menu: 'block',
                        display_Login: 'none',
                    });
                    this.setState({
                        loginFlag: this.state.loginFlag + 1
                    })
                    if (data.message === "no") {
                        this.changeMode("user mode")
                    } else {
                        this.changeMode("administrator mode")
                        this.changeMode("user mode");
                    }
                    document.getElementById("toIndex").click();//???????????????Link
                } else if (data.status === false) {
                    message.error("wrong user name or password???");
                } else {
                    message.error("unknown mistake");
                }
            }).catch(function (e) {
                console.log("fetch fail");
                // alert('system error');
            });

        }

    }
    //????????????????????????
    hadLog = () => {
        console.log("????????????????????????")

        //POST??????,IP?????????IP
        const url = golbal.localhostUrl + "showUserinfo"
        // const url="http://39.106.56.132:8080/showUserinfo"
        fetch(url, {
            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "http://39.106.56.132:8082",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} ??? res => {}????????????
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if (data.status) {
                console.log(data.data.roleID);
                if (data.data.roleId !== null) {
                    this.changeMode("administrator mode");
                    this.changeMode("user mode");
                }
                this.setState({
                    mode: "user mode",
                    display_Head: 'block',
                    display_Menu: 'block',
                    display_Login: 'none',
                    name: data.data.name,
                }, function () { });
            } else {
                this.setState({
                    display_Login: 'block',
                }, function () { });
            }
        }).catch(e => {
            console.log("fetch fail");
            // hashHistory.push('????????????');
            // createHashHistory().replace(golbal.webUrl)//????????????1
            document.getElementById("toIndex").click();//???????????????Link
            if (this.state.display_Head === 'block') {
                alert("??????????????????????????????");
                // window.location.href = golbal.webUrl;//????????????2
            }
            this.setState({
                mode: "user mode",
                display_Head: 'none',
                display_Menu: 'none',
                display_Login: 'block',
            }, function () { });
        });
    }

    /////////////////////////////////////////////////?????????/////////////////////////////////////////////////
    //????????????
    changeMode = (msg) => {
        if (msg === "administrator mode") {
            this.setState({
                mode: "administrator mode",
                GLY_Mode: true,
                display_GLY: 'block',
                display_User: 'none',
                display_Visitor: 'none',
            });
        } else if (msg === "????????????") {
            this.setState({
                mode: "????????????",
                display_GLY: 'none',
                display_User: 'none',
                display_Visitor: 'block',
            });
        } else if (msg === "user mode") {
            this.setState({
                mode: "user mode",
                display_GLY: 'none',
                display_User: 'block',
                display_Visitor: 'none',
            });
        } else {
            console.log("???????????????????????????");
            this.setState({
                display_GLY: 'none',
                display_User: 'none',
                display_Visitor: 'block',
            });
        }
    }
    //?????????????????????
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }
    /////////////////////////////////////////////////?????????/////////////////////////////////////////////////
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Layout>
                        <Layout.Header className={'Head'} style={{ display: this.state.display_Head }} >
                            <Head changeMode={(msg) => this.changeMode(msg)} loginOut={() => this.loginOut()} name={this.state.name} GLY_Mode={this.state.GLY_Mode} mode={this.state.mode}></Head>
                        </Layout.Header>
                        <Layout>
                            {/*****************************************???????????????*****************************************/}
                            <Layout.Sider
                                trigger={null}
                                collapsible
                                collapsed={this.state.collapsed}
                                style={{
                                    color: '#fff',
                                    backgroundColor: '#fff',
                                    display: this.state.display_Menu
                                }}
                            >
                                <Menu
                                    className='leftSider'
                                    mode={this.state.menu_mode}
                                    theme='light'
                                    style={{
                                        color: '#000'
                                    }}
                                >
                                    <Menu.Item onClick={this.toggle}>
                                        <Icon type='home' />
                                        <span >Menu</span>
                                    </Menu.Item>
                                    {/*?????????????????????*/}
                                    <Menu.SubMenu title={<span><Icon type="cluster" /><span>User Management</span></span>} style={{ display: this.state.display_GLY }}>
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "Department Management") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/depart'>Department Management</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "????????????") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/role'>Role Management</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "????????????") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/person'>Staff Management</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type="bank" /><span>Meeting Room Management</span></span>} style={{ display: this.state.display_GLY }}>
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "????????????") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/equip'>Device Management</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "Meeting Room Management") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/meetRoom'>Meeting Room Management</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "Parameter Management") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/meetRoomPara'>Parameter Management</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                        <Menu.Item ><Link to='/manage/equipRepair'>Equipment Repair Management</Link></Menu.Item>
                                        <Menu.Item ><Link to='/manage/door'>Access Rights management</Link></Menu.Item>
                                        <Menu.Item ><Link to='/manage/file'>File Management</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='smile' /><span>Facial Information Management</span></span>} style={{ display: this.state.display_GLY }}>
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "Face Management") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/face'>Face Management</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='team' /><span>Meeting Management</span></span>} style={{ display: this.state.display_GLY }}>
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "Meeting Management") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/meetInfo'>Meeting Management</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                        <Menu.Item ><Link to='/manage/weekMeet'>Weekly Meeting Management</Link></Menu.Item>
                                        <Menu.Item ><Link to='/manage/book'>Schedule Meeting</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type="bar-chart" /><span>Data Analysis</span></span>} style={{ display: this.state.display_GLY }}>
                                        {
                                            this.state.roleList.map((item) => {
                                                if (item.menuName === "Parameter Management") {
                                                    return (
                                                        <Menu.Item key={item.id}><Link to='/manage/para'>Data Analysis</Link></Menu.Item>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            })
                                        }
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='appstore' /><span>Other</span></span>} style={{ display: this.state.display_GLY }}>
                                        {/*<Menu.Item><Link to='/manage/detail'>????????????</Link></Menu.Item>*/}
                                    </Menu.SubMenu>
                                    {/*??????????????????????????????*/}
                                    <Menu.SubMenu title={<span><Icon type="tool" /><span>Meeting Management</span></span>} style={{ display: this.state.display_User }}>
                                        <Menu.Item><Link to='/meeting/book'>Book Meeting</Link></Menu.Item>
                                        {/*<Menu.Item><Link to='/meeting/search'>????????????</Link></Menu.Item>*/}
                                        <Menu.Item><Link to='/meeting/myMeeting'>My Booking</Link></Menu.Item>
                                        {/*<Menu.Item><Link to='/book/address'>Leave Approval(????????????My Booking)</Link></Menu.Item>*/}
                                        <Menu.Item><Link to='/myMeeting/myMeetLeave'>Leave Approval</Link></Menu.Item>
                                        <Menu.Item><Link to='/meeting/weekMeet'>Weekly Meeting</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='team' /><span>My Meeting</span></span>} style={{ display: this.state.display_User }}>
                                        <Menu.Item><Link to='/myMeeting/myJoin'>Meeting Arrangement</Link></Menu.Item>
                                        <Menu.Item><Link to='/myMeeting/myVideoMeet'>Video Meeting</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type="video-camera" /><span>Meeting Monitoring</span></span>} style={{ display: this.state.display_User }}>
                                        <Menu.Item><Link to='/manage/joinPerson'>Check-in Record</Link></Menu.Item>
                                        <Menu.Item><Link to='/manage/othersFace'>Anomalous Person</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='user' /><span>Personal Center</span></span>} style={{ display: this.state.display_User }}>
                                        <Menu.Item><Link to='/user/info'>My Profile</Link></Menu.Item>
                                        {/*<Menu.Item><Link to='/user/'>????????????</Link></Menu.Item>*/}
                                        {/*<Menu.Item><Link to='/user/'>????????????</Link></Menu.Item>*/}
                                        {/*<Menu.Item><Link to='/book/HY'>??????????????????</Link></Menu.Item>*/}
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='tags' /><span>Group Management</span></span>} style={{ display: this.state.display_User }}>
                                        <Menu.Item><Link to='/user/group'>My Group</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='appstore' /><span>Other</span></span>} style={{ display: this.state.display_User }}>
                                        <Menu.Item><Link to='/others/equipRepair'>Equipment Repair</Link></Menu.Item>
                                        <Menu.Item><Link to='/others/doorApply'>Open Application</Link></Menu.Item>
                                        {/*<Menu.Item><Link to='/others/'>?????????</Link></Menu.Item>*/}
                                    </Menu.SubMenu>
                                    {/*????????????????????????*/}
                                    <Menu.SubMenu title={<span><Icon type='tool' /><span>Meeting Management</span></span>} style={{ display: this.state.display_Visitor }}>
                                        <Menu.Item><Link to='/meeting/book'>Book Meeting</Link></Menu.Item>
                                        {/*<Menu.Item><Link to='/meeting/search'>????????????</Link></Menu.Item>*/}
                                        <Menu.Item><Link to='/meeting/myMeeting'>My Meeting</Link></Menu.Item>
                                        {/*<Menu.Item><Link to='/book/address'>Leave Approval(????????????My Booking)</Link></Menu.Item>*/}
                                        <Menu.Item><Link to='/myMeeting/myMeetLeave'>Leave Approval</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='team' /><span>My Meeting</span></span>} style={{ display: this.state.display_Visitor }}>
                                        <Menu.Item><Link to='/myMeeting/myJoin'>Meeting Arrangement</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='video-camera' /><span>Meeting Monitoring</span></span>} style={{ display: this.state.display_Visitor }}>
                                        <Menu.Item><Link to='/manage/joinPerson'>Check-in Record</Link></Menu.Item>
                                        <Menu.Item><Link to='/book/address'>????????????????????????</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='user' /><span>My Information</span></span>} style={{ display: this.state.display_Visitor }}>
                                        <Menu.Item><Link to='/user/info'>Personal Information</Link></Menu.Item>
                                        {/*<Menu.Item><Link to='/book/HY'>??????????????????</Link></Menu.Item>*/}
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='tags' /><span>Group Management</span></span>} style={{ display: this.state.display_Visitor }}>
                                        <Menu.Item><Link to='/user/group'>My Group</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu title={<span><Icon type='appstore' /><span>Other</span></span>} style={{ display: this.state.display_Visitor }}>
                                        <Menu.Item><Link to='/others/equipRepair'>Equipment Repair</Link></Menu.Item>
                                        <Menu.Item><Link to='/others/doorApply'>Open Application</Link></Menu.Item>
                                        {/*<Menu.Item><Link to='/others/'>?????????</Link></Menu.Item>*/}
                                    </Menu.SubMenu>
                                </Menu>
                            </Layout.Sider>

                            {/*****************************************????????????*****************************************/}
                            <Layout.Content className='contentLayout'>
                                {/*************************************?????????????????????**************************************/}
                                <Row style={{ marginTop: 10, borderRadius: 10 }}>
                                    <Col span={10} offset={7} >
                                        {/*??????*/}
                                        <Card title="Login" className="loginCard" style={{ display: this.state.display_Login }}>
                                            <Input prefix={<Icon type='user' />} type='' placeholder='user name' onKeyUp={this.usernameChange}></Input>
                                            <br />
                                            <br />
                                            <Input prefix={<Icon type='lock' />} type='password' placeholder='password' onKeyUp={this.passwordChange}></Input>
                                            <Button className={'headBtn1'} type='default' onClick={this.showForget}>Forget Password</Button>
                                            <Button className={'headBtn2'} type='primary' loading={this.state.loading} onClick={this.enterLoading} >Login</Button>
                                            <Button className={'headBtn3'} type='default' onClick={this.logUp}>No Account? Please Register</Button>
                                        </Card>
                                        {/*????????????*/}
                                        <Card title="retrieve password" className={"forgetCard"} style={{ display: this.state.display_Forget }}>
                                            <Steps style={{ width: '100%' }} current={0}>
                                                <Steps.Step style={{ margin: 0 }} title="First Step" description="Get verification code" />
                                                <Steps.Step style={{ margin: 0, marginRight: 30 }} title="Second Step" description="Edit Password" />
                                                <Steps.Step style={{ margin: 0 }} title="Third Step" description="Successfully modified" />
                                            </Steps>
                                            <br />
                                            <Input type='' placeholder='Phone' onKeyUp={this.phoneChange}></Input>
                                            <br />
                                            <Input type='' className='phoneCodeInput' placeholder='Enter confirmation code' onKeyUp={this.phoneCodeChange}></Input>
                                            <Button className='forgetBtn2' type='default' disabled={this.state.disabled_getCode} onClick={this.getPhoneCode}>{this.state.codeTime > 0 ? "???" + this.state.codeTime + "????????????" : "Get verification code"}</Button>
                                            <Button className='forgetBtn1' type='default' onClick={this.showLogin}>Return to login</Button>
                                            <Button className='forgetBtn1' type='primary' onClick={this.compareCode}>Next step</Button>
                                        </Card>
                                        {/*Edit Password*/}
                                        <Card title="????????????" className={"forgetCard"} style={{ display: this.state.display_Change }}>
                                            <Steps style={{ width: '440px' }} current={1}>
                                                <Steps.Step style={{ margin: 0 }} title="First Step" description="Get verification code" />
                                                <Steps.Step style={{ margin: 0, marginRight: 30 }} title="Second Step" description="Edit Password" />
                                                <Steps.Step style={{ margin: 0 }} title="Third Step" description="Successfully modified" />
                                            </Steps>
                                            <br />
                                            <Input type='' placeholder='???????????????' onKeyUp={this.passwordChange}></Input>
                                            <br /><br />
                                            <Input type='' placeholder='??????????????????' onKeyUp={this.newPasswordChange}></Input>
                                            <Button className='forgetBtn1' type='default' onClick={this.showLogin}>Return to login</Button>
                                            <Button className='forgetBtn1' type='primary' onClick={this.comparePassword}>Edit Password</Button>
                                        </Card>
                                        {/*????????????*/}
                                        <Card title="????????????" className={"forgetCard"} style={{ display: this.state.display_ChangeSuccess }}>
                                            <Steps style={{ width: '440px' }} current={2}>
                                                <Steps.Step style={{ margin: 0 }} title="First Step" description="Get verification code" />
                                                <Steps.Step style={{ margin: 0, marginRight: 30 }} title="Second Step" description="Edit Password" />
                                                <Steps.Step style={{ margin: 0 }} title="Third Step" description="Modify successfully, return to login" />
                                            </Steps>
                                            <Button className='forgetBtn1' type='primary' onClick={this.showLogin}>Return to login</Button>
                                        </Card>
                                    </Col>
                                </Row>
                                {/*************************************????????????**************************************/}
                                {/*???????????????????????????*/}
                                <div style={{ display: this.state.display_Head }}>
                                    <Route path={"/book/address"} component={B_O_Add} />
                                    <Route path={"/book/time"} component={B_O_Time} />
                                    <Route path={"/book/HY"} component={B_O_HY} />
                                    <Route path={"/user/group"} component={Group} />
                                    <Route path={"/user/findHY"} component={FindHY} />
                                    <Route path={"/user/info"} component={UserInfo} />
                                    <Route path={"/welcome"} component={Welcome} />
                                    <Route path={"/meeting/book"} component={Meeting_Book} />
                                    <Route path={"/meeting/search"} component={Meeting_Mine} />
                                    <Route path={"/meeting/myMeeting"} component={Meeting_Mine} />
                                    <Route path={"/meeting/weekMeet"} component={WeekMeeting} />
                                    <Route path={"/others/doorApply"} component={DoorApply} />
                                    <Route path={"/others/equipRepair"} component={EquipRepair} />
                                    <Route path={"/manage/book"} component={BookMeetingManager} />
                                    <Route path={"/manage/meeting"} component={Meeting_Manage} />
                                    <Route path={"/manage/role"} component={RoleManage} />
                                    <Route path={"/manage/depart"} component={DepartManage} />
                                    <Route path={"/manage/equip"} component={EquipManage} />
                                    <Route path={"/manage/equipRepair"} component={EquipRepairManage} />
                                    <Route path={"/manage/door"} component={DoorManage} />
                                    <Route path={"/manage/file"} component={FileManage} />
                                    <Route path={"/manage/weekMeet"} component={WeekMeetManage} />
                                    <Route path={"/manage/detail"} component={DetailManage} />
                                    <Route path={"/manage/meetRoom"} component={MeetRoomManage} />
                                    <Route path={"/manage/meetRoomPara"} component={MeetParaManage} />
                                    <Route path={"/manage/person"} component={PersonManage} />
                                    <Route path={"/manage/face"} component={FaceManage} />
                                    <Route path={"/manage/othersFace"} component={OthersFaceManage} />
                                    <Route path={"/manage/joinPerson"} component={JoinPersonManage} />
                                    <Route path={"/manage/meetInfo"} component={MeetInfoManage} />
                                    <Route path={"/manage/para"} component={ManageIndex} />
                                    <Route path={"/myMeeting/myJoin"} component={MyJoinMeeting} />
                                    <Route path={"/myMeeting/myVideoMeet"} component={MyVideoMeet} />
                                    <Route path={"/index"}
                                        render={() => {
                                            return <BizDemo
                                                loginFlag={this.state.loginFlag}
                                            />
                                        }}
                                    />
                                    <Route path={"/myMeeting/myMeetLeave"} component={MyMeetLeave} />
                                    {/*?????????Link??????*/}
                                    <Link to={"/index"} id="toIndex" />
                                </div>

                            </Layout.Content>

                        </Layout>
                        <Layout.Footer>
                            Copyright @OfferRealize Full Stack Course
                        </Layout.Footer>
                    </Layout>
                </BrowserRouter>

            </div>
        );
    }

}
export default App;

///////////////////////////////////////////////////?????????????????????/////////////////////////////////////////////////
class Head extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            username: "",
            password: "",
            visible: false,
            name: "Login",
            loading: false,
        }
    }
    //????????????
    handleChange = (msg) => {
        this.props.changeMode(msg);
        console.log(`selected ${msg}`);
        document.getElementById("toIndex").click();//???????????????Link
    }
    //????????????
    loginRole = (msg) => {
        this.props.changeMode(msg);
    }
    //???????????????
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    }
    //???????????????
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    //?????????????????????
    nameChange = (e) => {
        this.setState({ name: e })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.props.loginOut();
        this.setState({
            visible: false,
        });
        this.logout();
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    //????????????????????????
    logout = () => {
        //POST??????,IP?????????IP
        // const url="http://39.106.56.132:8080/logout"
        const url = golbal.localhostUrl + "logout"
        fetch(url, {
            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} ??? res => {}????????????
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if (data.status) {
                message.success("Retreat safely!");
            } else {
                message.error("unknown mistake");
            }

        }).catch(function (e) {
            console.log("fetch fail");
            // alert('system error');
        });

    }

    //?????????
    render() {
        const loginOut = (<div onClick={this.showDrawer}>{"Logout"}</div>);
        return (
            <div className={'head'} style={this.props.style}>
                {/*right*/}
                {/*<div>{this.props.name}</div>*/}
                <img src={logo} className="App-logo logo" alt="logo" onClick={function () { }} />
                <span className={'companyName'}><h2><Link to='/index'>Google Meeting System</Link></h2></span>

                {/*????????? ????????????*/}
                <div style={this.props.GLY_Mode ? { display: "block" } : { display: "none" }}>
                    <Select className={'headBtn1'} defaultValue={this.props.mode} style={{ width: 120 }} onChange={this.handleChange}>
                        {/*<Select.Option value="????????????">????????????</Select.Option>*/}
                        <Select.Option value="administrator mode">administrator mode</Select.Option>
                        <Select.Option value="user mode">user mode</Select.Option>
                    </Select>
                </div>

                {/*????????? ????????????*/}

                {/*????????????*/}
                <Popover title="" content={loginOut} >
                    <Button className={'headBtn1'} type="primary" >{this.props.name}</Button>
                </Popover>

                {/*????????????*/}
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={"Ok"}
                    cancelText={"Cancel"}
                >
                    <h2>Are you sure to quit?</h2>
                </Modal>

            </div>
        );
    }
}
