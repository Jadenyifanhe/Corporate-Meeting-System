import { Component } from "react";
import { Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './cusLogin.css';
class Parent extends Component {
    render(){
        return(
            <CusLogin myName='Leah'/>
        )
    }
}

class CusLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: ''
        }
    }

  
    onClick = () => {
        console.log('Login', this.state.userName, this.state.password);
        const url = `http://localhost:8080/login?username=${this.state.userName}&password=${this.state.password}`;

        if(!this.state.userName || !this.state.password) {
            message.warning("username or password cannot be empty!")
        }else{
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify({userName: this.state.userName,password: this.state.password })
            }).then(function (res){
                return res.json()
            }).then(json => {
                const data = json;
                if(data.status === '200'){
                    console.log('Login Success');
                    message.success("Login Success");
                    // render component
                }else{
                    message.error("Login Error");
                }
            }).catch(function (e){
                message.error("fetch fail");
            });
        }
    }
    render() {
        console.log(this.props.myName);
        return (
            <div>
                <p>
                    IMeeting
                </p >
                <div className="cusLogin">
                    <div><Input placeholder="default size" prefix={<UserOutlined />} value={this.state.userName} onChange={(e) => {this.setState({userName: e.target.value})}}/></div>
                    <div><Input.Password placeholder="input password" value={this.state.password} onChange={(e) => {this.setState({password: e.target.value})}} /></div>
                </div>
                <Button onClick={this.onClick}>Login</Button>
            </div>

        )
    }
}

export default Parent;