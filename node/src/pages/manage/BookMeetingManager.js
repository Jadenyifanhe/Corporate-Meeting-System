import React, { Component } from 'react';
import moment from 'moment';
import {
    Slider,
    Switch,
    InputNumber,
    Col,
    Row,
    Card,
    Button,
    message,
    DatePicker,
    Checkbox, Modal, Table,
} from 'antd';
import golbal from '@/golbal';
import ShowMeeting from "@/pages/meeting/tool/ShowMeeting";
import CollectionCreateFormM from "@/pages/manage/tool/CollectionCreateFormM";
import MeetingGraph from "@/pages/meeting/tool/MeetingGraph";
import FreeTimePopover from "@/pages/meeting/tool/FreeTimePopover";
import '@/css/meeting.less';
import NoMeeting from "@/pages/meeting/tool/noMeeting3.png";

const data = [{
    key: '1',
    name: 'John',
    time: 32,
    begin:"",
    over:"",
    dateLimit:"",
    timeLimit:"",
    timeInterval:"",
    tenantId:1,

}, {
    key: '2',
    name: 'John',
    time: 32,
    begin:"",
    over:"",
    dateLimit:"",
    timeLimit:"",
    timeInterval:"",
    tenantId:1,
}, {
    key: '3',
    name: 'Brown',
    time: 32,
    begin:"",
    over:"",
    dateLimit:"",
    timeLimit:"",
    timeInterval:"",
    tenantId:1,
}];

class BookMeetingManager extends Component {
    componentDidMount(){
        this.reserveIndex();
        this.selectAllPeople();
    }
    state = {
        bookRule:{
            id: 1,
            begin: "07:00",
            over: "18:30",
            dateLimit: "7",
            timeLimit: "120",
            timeInterval: "15",
            tenantId: 1
        },
        checkEquip:[],
        equipList:[],
        roomList:[],
        roomListShow:[],
        roomTools:[],
        bookVisible: false,
        othersList:[],
        searchDate:moment().format("YYYY-MM-DD"),
        searchMeetInfo:[],
        contain:0,
        screenVisible:false,
        dataSource:[],
        peopleList:[[],[],[],[]],
    };

    onClose = () => {
        this.setState({
            bookVisible: false,
        });
    };

    showDrawer = () => {
        this.setState({
            bookVisible: true,
        });
    };
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    getOthersList=(e)=>{
        console.log(e)
        this.setState({
            othersList:e
        })
    }
    checkEquipChange=(e)=>{
        console.log(e)
        this.setState({
            checkEquip:e,
        },this.roomListShowFlash());
        this.roomListShowFlash2(e);
    }
    containChange=(e)=>{
        this.setState({
            contain:e,
        },this.roomListShowFlash());
    }
    timeChange=(e)=>{//????????????????????????setState?????????????????????????????????????????????e???????????????fetch????????????????????????
        console.log(e.format("YYYY-MM-DD"));
        this.oneDayReserver(e);
    }
    roomListShowFlash=()=>{
        let roomListShow=[];
        this.state.roomList.map(()=>{//?????????true
            return roomListShow.push(true);
        });
        this.state.roomList.map((item, i)=>{//????????????
            if(item.contain<this.state.contain){
                roomListShow[i]=false;
            }
            return null;
        });
        console.log("checkEquip",this.state.checkEquip)
        this.state.checkEquip.map((item)=>{//????????????
            this.state.roomTools.map((item2,i)=>{
                let flag=false;
                item2.map(item3=>{
                    if (item3.equipId===item){
                        flag=true;
                    }
                    return null;
                })
                roomListShow[i]=flag&roomListShow[i];
                return null;
            })
            return null;
        });
        console.log(roomListShow);
        this.setState({
            roomListShow:roomListShow,
        })
    }
    roomListShowFlash2=(e)=>{
        let roomListShow=[];
        this.state.roomList.map(()=>{//?????????true
            return roomListShow.push(true);
        });
        this.state.roomList.map((item, i)=>{//????????????
            if(item.contain<this.state.contain){
                roomListShow[i]=false;
            }
            return null;
        });
        console.log("checkEquip",e)
        e.map((item)=>{//????????????
            this.state.roomTools.map((item2,i)=>{
                let flag=false;
                item2.map(item3=>{
                    if (item3.equipId===item){
                        flag=true;
                    }
                    return null;
                })
                roomListShow[i]=flag&roomListShow[i];
                return null;
            })
            return null;
        });
        console.log(roomListShow);
        this.setState({
            roomListShow:roomListShow,
        })
    }
    screenOk = (e) => {
        console.log(e);
        this.setState({
            screenVisible: false,
        });
    }

    screenCancel = (e) => {
        console.log(e);
        this.setState({
            screenVisible: false,
        });
    }
    bookByMeetRoom=(roomId)=>{
        const form = this.formRef.props.form;
        form.setFieldsValue({
            meetingRoom:roomId
        })
        this.setState({
            bookVisible:true
        })
    }
    ////////////////////////////////////////////fetch??????//////////////////////////////////////////////////////////////////
    //????????????????????????
    showScreen=()=>{
        let weight=[]
        let equipList=[]
        this.state.equipList.map((item)=>{
            equipList.push(item.id)
        })
        equipList.map((item1)=>{
            let k=1
            this.state.checkEquip.map((item2)=>{
                if(item1===item2){
                    k=5
                }
                return null
            })
            return weight.push(k)
        })

        const url=golbal.localhostUrl+"meeting/recommandMeetRoom";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//????????????cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                equips:equipList,
                weight:weight,
                contain:this.state.contain,
            }),
        }).then(function (res) {//function (res) {} ??? res => {}????????????
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            this.setState({
                dataSource:data.data,
            })
            this.setState({
                screenVisible: true,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });

    }
    //????????????
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const url=golbal.localhostUrl+"meeting/reserveByManage";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials:"include",//????????????cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    topic:values.title,
                    content:values.description,
                    meetRoomId:values.meetingRoom,
                    reserveDate:values.dateTime.format("YYYY-MM-DD"),
                    beginTime:values.startTime.format("HH:mm"),
                    lastTime:values.continuedTime,
                    prepareTime:values.prepareTime,
                    joinPeopleId:values.guests,
                    outsideJoinPersons:this.state.othersList,
                    userId:values.userId,
                }),
            }).then(function (res) {//function (res) {} ??? res => {}????????????
                return res.json()
            }).then(json => {
                // get result
                const data = json;
                console.log(data);
                if(data.status){
                    message.success("Booking information submitted successfully!")
                    this.setState({
                        bookVisible: false,
                    })
                    form.resetFields();
                }else {
                    // message.error("???????????????????????????????????????????????????")
                    message.error(data.message);
                }

            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });

            console.log('Received values of form: ', values);
            console.log("Tittle",values.title);
            console.log("Meeting Description",values.description);
            console.log("Room ID",values.meetingRoom);
            console.log("????????????",values.dateTime.format("YYYY-MM-DD"));
            console.log("Start Time",values.startTime.format("HH:mm"));
            console.log("Duration",values.continuedTime);
            console.log("Preparation Time",values.prepareTime);
            console.log("Participants",values.guests);
            console.log("List of other people",this.state.othersList);
            console.log("?????????ID",values.userId);
            //form.resetFields();//????????????

        });
    }
    //selectAllPeople
    selectAllPeople = () =>{
        const url=golbal.localhostUrl+"userInfo/selectAllPeople";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//????????????cookie
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
            this.setState({
                    peopleList:data.data
                });
            this.roomListShowFlash();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //reserveIndex
    reserveIndex = () =>{
        const url=golbal.localhostUrl+"meeting/reserveIndex";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//????????????cookie
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
            this.setState({
                bookRule:data.data[0] || {
                    id: 1,
                    begin: "07:00",
                    over: "18:30",
                    dateLimit: "7",
                    timeLimit: "120",
                    timeInterval: "15",
                    tenantId: 1
                },
                equipList:data.data[1],
                roomList:data.data[2],
                searchMeetInfo:data.data[3],
                roomTools:data.data[4],
            },this.roomListShowFlash()//?????????????????????????????????
            );
            this.roomListShowFlash();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //oneDayReserver
    oneDayReserver = (e) =>{
        const url=golbal.localhostUrl+"meeting/oneDayReserver";
        let meetRooms=[];
        this.state.roomList.map((item)=>{
            meetRooms.push(item.id);
            return null;
        })
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//????????????cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                dayReservation:e.format("YYYY-MM-DD"),
                meetRooms:meetRooms,
            }),
        }).then(function (res) {//function (res) {} ??? res => {}????????????
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            this.setState({
                searchMeetInfo:data.data,
                searchDate:e.format("YYYY-MM-DD"),
            },function () {})
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                render:(text,m,i)=>{
                    return (
                        <div>{i+1}</div>
                    )
                }
            },{
                title: 'Meeting Room Name',
                dataIndex: 'meetRoomName',
            },{
                title: 'Meeting Room Capacity',
                dataIndex: 'contain',
            },{
                title: 'Instrument',
                render:(text)=>{
                    return(
                        <div>
                            {text.equips.toString()}
                        </div>
                    )
                }
            },{
                title: 'Suitability',
                dataIndex: 'similar',
                key: 'similar',
            },{
                title: 'Operation',
                render:(text)=>{
                    return(
                        <div>
                            <FreeTimePopover
                                searchDate={this.state.searchDate}
                                meetRoomName={text.meetRoomName}
                                meetRoomId={text.meetRoomId}
                            />
                            <Button type='primary'
                                onClick={()=>{
                                    this.bookByMeetRoom(text.meetRoomId);

                                }}
                            >
                                ??????
                            </Button>
                        </div>
                    )
                }
            },
        ];
        const timeTable=[{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            className:"colStyle",
            width:120,
        }];
        const beginH =parseInt(this.state.bookRule.begin.split(":")[0]);
        const overH =parseInt(this.state.bookRule.over.split(":")[0]);
        for(let i=beginH;i<=overH;i++){
            timeTable.push(
                {
                    title: i+":00-"+(i+1)+":00",
                    colSpan: 4,
                    className:"11",
                }, {
                    title: '8:00-9:00',
                    colSpan: 0,
                }, {
                    title: '8:00-9:00',
                    colSpan: 0,
                }, {
                    title: '8:00-9:00',
                    colSpan: 0,
                }
            )
        }
        let searchMeetInfo=[]
        this.state.searchMeetInfo.map(()=>{
            return searchMeetInfo.push([]);
        })
        return (
            <div id={"haha"} >
                <Row>
                    <Col span={18} offset={3}>

                        <Card
                            title={<h1 style={{float:'left',marginBottom:-10}}>
                                Schedule Meeting
                            </h1>}
                            extra={<Button href="#" type={"primary"} onClick={this.showDrawer}>Create Reservation</Button>}
                            // style={{ width: 300 }}
                        >
                            <Row>
                                <Col span={8} >
                                    Date:
                                    <DatePicker
                                        placeholder="Select Date"
                                        onChange={this.timeChange}
                                        defaultValue={moment(this.state.searchDate,"YYYY-MM-DD")}
                                    />
                                </Col>
                                <Col span={8} >
                                    Number of people:
                                    <InputNumber value={this.state.contain} min={0} defaultValue={0} onChange={this.containChange} />
                                    more than
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18} >
                                    <div style={{marginTop:"10px",marginLeft:"1px"}}>
                                        <Checkbox.Group value={this.state.checkEquip} style={{ width: '100%' }} onChange={this.checkEquipChange}>
                                            <Row>
                                                <Col span={2} offset={1}>Equipment???</Col>
                                                {
                                                    this.state.equipList.map(item=>{
                                                        return (
                                                            <Col span={4} key={item.id}><Checkbox value={item.id}>{item.name}</Checkbox></Col>
                                                        )

                                                    })
                                                }
                                            </Row>
                                        </Checkbox.Group>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <Button type='primary' onClick={this.showScreen}>AI quickly finds meeting rooms</Button>
                                    <Modal
                                        title="AI Screening Results"
                                        visible={this.state.screenVisible}
                                        width={800}
                                        onOk={this.screenOk}
                                        onCancel={this.screenCancel}
                                        okText={"Ok"}
                                        cancelText={"Cancel"}
                                    >
                                        <Table rowKey={record=>record.meetRoomId} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                                    </Modal>
                                </Col>
                            </Row>
                            {
                                this.state.searchMeetInfo.toString()===searchMeetInfo.toString()?
                                    <img style={{width:"100%"}} src={NoMeeting} alt={"There is no Schedule Meeting that day."}/>:
                                    <MeetingGraph //????????????
                                        startTime={this.state.searchDate+" "+this.state.bookRule.begin}
                                        overTime={this.state.searchDate+" "+this.state.bookRule.over}
                                        searchMeetInfo={this.state.searchMeetInfo} //????????????????????????
                                        roomListShow={this.state.roomListShow} //????????????roomList
                                        roomList={this.state.roomList} //roomList
                                    />
                            }


                        </Card>
                        {/*<Card>*/}
                            {/**/}
                            {/*<Row>*/}
                                {/*<Table className={'table'} columns={timeTable} dataSource={data} bordered/>*/}
                                {/*<Col span={16} offset={4}>*/}
                                    {/*<Demo/>*/}
                                {/*</Col>*/}
                            {/*</Row>*/}
                        {/*</Card>*/}
                    </Col>
                </Row>
                <CollectionCreateFormM
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList}
                    visible={this.state.bookVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                    userList={this.state.peopleList}
                >
                </CollectionCreateFormM>
                <ShowMeeting roomList={this.state.roomList} searchDate={this.state.searchDate}/>
            </div>
        );
    }
}



class Demo extends Component {
    state = {
        disabled: false,
    };

    handleDisabledChange = (disabled) => {
        this.setState({ disabled });
    }

    render() {
        const { disabled } = this.state;
        return (
            <div>
                <Slider min={800} max={1400} range defaultValue={[800,800]} step={25} disabled={disabled} />
                Disabled: <Switch size="small" checked={disabled} onChange={this.handleDisabledChange} />
            </div>
        );
    }
}


export default BookMeetingManager;
