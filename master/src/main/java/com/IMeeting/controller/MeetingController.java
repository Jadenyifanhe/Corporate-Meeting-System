package com.IMeeting.controller;


import com.IMeeting.entity.*;
import com.IMeeting.resposirity.*;
import com.IMeeting.service.*;
import com.IMeeting.util.DateUtil;
import com.IMeeting.util.MeetUtil;
import com.IMeeting.util.TimeUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;


@RestController
@RequestMapping("/meeting")
public class MeetingController {
    @Autowired
    private MeetingService meetingService;
    @Autowired
    private GroupService groupService;
    @Autowired
    private EquipService equipService;
    @Autowired
    private MeetRoomService meetRoomService;
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private LeaveInformationRepository leaveInformationRepository;
    @Autowired
    private MeetroomRepository meetroomRepository;
    @Autowired
    private MeetroomParameterRepository meetroomParameterRepository;
    @Autowired
    private DepartRepository departRepository;
    @Autowired
    private JoinPersonRepository joinPersonRepository;
    @Autowired
    private PushMessageRepository pushMessageRepository;
    @Autowired
    private MeetroomEquipRepository meetroomEquipRepository;
    @Autowired
    private OutsideJoinPersonRepository outsideJoinPersonRepository;
    @Autowired
    private UserinfoService userinfoService;
    private transient Logger log = LoggerFactory.getLogger(this.getClass());


    //预定会议首页
    @RequestMapping("/reserveIndex")
    public ServerResult reserveIndex(HttpServletRequest request) {
        ServerResult serverResult = meetingService.toReserveIndex(request);
        return serverResult;
    }

    //查找一个会议室某一天的预定情况
    @RequestMapping("/oneRoomReserver")
    public ServerResult oneRoomReserver(@RequestParam(value = "reserverDate", required = false) String reserverDate, @RequestParam(value = "roomId", required = false) Integer roomId) {
        ServerResult serverResult = meetingService.getOneRoomReserver(reserverDate, roomId);
        return serverResult;
    }

    //查询某天会议室集合的预定情况，进度条显示
    @RequestMapping("/oneDayReserver")
    public ServerResult oneDayReserver(@RequestBody OneDayReservation oneDayReservation) {
        ServerResult serverResult = meetingService.getOneDayReserve(oneDayReservation);
        return serverResult;
    }

    //在预定的时候获取该用户拥有的群组列表
    @RequestMapping("/getGroupList")
    public ServerResult getGroupList(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        ServerResult serverResult = groupService.getGroupList(userId);
        return serverResult;
    }

    //在预定的时候选择某个群组，将该群组的所有成员显示出来
    @RequestMapping("/showOneGroup")
    public ServerResult showOneGroup(@RequestParam Integer groupId) {
        ServerResult serverResult = groupService.showOneGroup(groupId);
        return serverResult;
    }

    //除了群组人员以外选择其他人员
    @RequestMapping("/selectPeople")
    public ServerResult selectPeople(HttpServletRequest request) {
        ServerResult serverResult = groupService.showUser(request);
        return serverResult;
    }

    //预定会议
    @RequestMapping("/reserveMeeting")
    public ServerResult reserveMeeting(@RequestBody ReserveParameter reserveParameter, HttpServletRequest request) throws Exception {
        ServerResult serverResult = meetingService.reserveMeeting(reserveParameter, request);
        return serverResult;
    }

    //抢会议
    @RequestMapping("/robMeeting")
    public ServerResult robMeeting(@RequestBody ReserveParameter reserveParameter, HttpServletRequest request) {
        ServerResult serverResult = meetingService.robMeeting(reserveParameter, request);
        return serverResult;
    }

    //调用会议
    @RequestMapping("/coordinateMeeting")
    public ServerResult coordinateMeeting(@RequestBody CoordinateParameter coordinateParameter, HttpServletRequest request) {
        ServerResult serverResult = meetingService.coordinateMeeting(coordinateParameter, request);
        return serverResult;
    }

    //取消会议
    @RequestMapping("/cancelMeeting")
    public ServerResult coordinateMeeting(@RequestParam("meetingId") Integer meetingId) {
        ServerResult serverResult = meetingService.cancelMeeting(meetingId);
        return serverResult;
    }

    //显示用户当月预定情况
    @RequestMapping("/showMyReserve")
    public ServerResult showMyReserve(HttpServletRequest request) {
        ServerResult serverResult = meetingService.showMyReserve(request);
        return serverResult;
    }

    //查找某个月用户会议预定情况
    @RequestMapping("/specifiedMyReserve")
    public ServerResult specifiedMyReserve(HttpServletRequest request, @RequestParam("yearMonth") String yearMonth) {
        ServerResult serverResult = meetingService.specifiedMyReserve(request, yearMonth);
        return serverResult;
    }

    //显示用户某一天所有预定情况
    @RequestMapping("/showOneDayReserve")
    public ServerResult showMyReserve(@RequestParam("reserveDate") String reserveDate, HttpServletRequest request) {
        ServerResult serverResult = meetingService.oneDayMyReserve(reserveDate, request);
        return serverResult;
    }

    //显示某个预定会议的细节
    @RequestMapping("/showOneReserveDetail")
    public ServerResult showOneReserveDetail(@RequestParam("meetingId") Integer meetingId) {
        ServerResult serverResult = meetingService.oneReserveDetail(meetingId);
        return serverResult;
    }

    //拒绝调用会议
    @RequestMapping("/disagreeCoordinate")
    public ServerResult disagreeCoordinate(@RequestParam("coordinateId") Integer coordinateId) {
        ServerResult serverResult = meetingService.disagreeCoordinate(coordinateId);
        return serverResult;
    }

    //同意调用会议
    @RequestMapping("/agreeCoordinate")
    public ServerResult agreeCoordinate(@RequestParam("coordinateId") Integer coordinateId) {
        ServerResult serverResult = meetingService.agreeCoordinate(coordinateId);
        return serverResult;
    }

    //第一种修改方式，修改了时间或者会议室地点或者都修改，相当于取消原会议重新预定
    //第二种修改方式，修改除时间和会议室地点外的其他内容
    @RequestMapping("/editOneServer")
    public ServerResult OneEditMyServer(@RequestBody ReserveParameter reserveParameter, HttpServletRequest request) throws Exception {
        Meeting meeting = meetingService.findByMeetingId(reserveParameter.getMeetingId());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String reserveBegin = reserveParameter.getReserveDate() + " " + reserveParameter.getBeginTime();
        String reserveOver = TimeUtil.addMinute(reserveBegin, reserveParameter.getLastTime());
        Integer reserveMeetroomId = reserveParameter.getMeetRoomId();
        ServerResult serverResult = null;
        if (meeting.getBegin().equals(reserveBegin) && meeting.getOver().equals(reserveOver) && meeting.getMeetroomId().equals(reserveMeetroomId)) {
            serverResult = meetingService.twoEditMyServer(reserveParameter, request);
        } else {
            serverResult = meetingService.oneEditMyServer(reserveParameter, request);
        }
        return serverResult;
    }

    //提前结束会议
    @RequestMapping("/advanceOver")
    public ServerResult advanceOver(@RequestParam("meetingId") Integer meetingId) throws Exception {
        ServerResult serverResult = meetingService.advanceOver(meetingId);
        return serverResult;
    }

    //计算显示我参加的会议(本月)已结束和未开始会议的次数
    @RequestMapping("/toSelectMyJoinMeeting")
    public ServerResult toSelectMyJoinMeeting(HttpServletRequest request) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String yearMonth = sdf.format(new java.util.Date()).substring(0, 7);
        ServerResult serverResult = meetingService.selectMyJoinMeeting(request, yearMonth);
        return serverResult;
    }

    //根据月份计算显示我参加的会议的已结束和未开始会议的次数参数如2019-01-20
    @RequestMapping("/specifiedMyJoinMeeting")
    public ServerResult specifiedMyJoinMeeting(HttpServletRequest request, @RequestParam("yearMonth") String yearMonth) {
        ServerResult serverResult = meetingService.selectMyJoinMeeting(request, yearMonth);
        return serverResult;
    }

    //显示某一天我参加的会议情况
    @RequestMapping("/selectMyJoinMeetingByDate")
    public ServerResult selectMyJoinMeetingByDate(HttpServletRequest request, @RequestParam("meetDate") String meetDate) {
        ServerResult serverResult = meetingService.selectMyJoinMeetingByDate(meetDate, request);
        return serverResult;
    }

    //提交请假
    @RequestMapping("/sendLeaveInformation")
    public ServerResult sendLeaveInformation(HttpServletRequest request, @RequestBody LeaveInformation leaveInformation) {
        ServerResult serverResult = meetingService.sendLeaveInformation(leaveInformation, request);
        return serverResult;
    }

    //根据日期显示未开始和进行中会议的请假请求总数和未处理请假数量
    @RequestMapping("/CountLeaveInformation")
    public ServerResult CountLeaveInformation(HttpServletRequest request) {
        ServerResult serverResult = meetingService.countLeaveInformation(request);
        return serverResult;
    }

    //显示某场会议的请假情况
    @RequestMapping("/showOneMeetingLeaveInfo")
    public ServerResult showOneMeetingLeaveInfo(@RequestParam("meetingId") Integer meetingId) {
        ServerResult serverResult = meetingService.showOneMeetingLeaveInfo(meetingId);
        return serverResult;
    }

    //同意请假
    @RequestMapping("/agreeLeave")
    public ServerResult agreeLeave(@RequestParam("leaveInfoId") Integer leaveInfoId) {
        leaveInformationRepository.agreeLeave(leaveInfoId);
        LeaveInformation leaveInformation = meetingService.findById(leaveInfoId);
        joinPersonRepository.updateStatus(3, leaveInformation.getMeetingId(), leaveInformation.getUserId());
        PushMessage pushMessage = new PushMessage();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowTime = sdf.format(new Date());
        pushMessage.setTime(nowTime);
        pushMessage.setStatus(0);
        pushMessage.setMessage("请假审批通过");
        pushMessage.setReceiveId(leaveInformation.getUserId());
        pushMessage.setMeetingId(leaveInformation.getMeetingId());
        pushMessageRepository.saveAndFlush(pushMessage);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //拒绝请假
    @RequestMapping("/disagreeLeave")
    public ServerResult disagreeLeave(@RequestParam("leaveInfoId") Integer leaveInfoId) {
        leaveInformationRepository.disagreeLeave(leaveInfoId);
        LeaveInformation leaveInformation = meetingService.findById(leaveInfoId);
        joinPersonRepository.updateStatus(4, leaveInformation.getMeetingId(), leaveInformation.getUserId());
        PushMessage pushMessage = new PushMessage();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowTime = sdf.format(new Date());
        pushMessage.setTime(nowTime);
        pushMessage.setStatus(0);
        pushMessage.setMessage("请假审批未通过");
        pushMessage.setReceiveId(leaveInformation.getUserId());
        pushMessage.setMeetingId(leaveInformation.getMeetingId());
        pushMessageRepository.saveAndFlush(pushMessage);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //消息推送
    @RequestMapping("/pushMessage")
    public ServerResult pushMessage(HttpServletRequest request) {
        ServerResult serverResult = meetingService.findPushMessage(request);
        return serverResult;
    }

    //智能推荐会议室
    @RequestMapping("/recommandMeetRoom")
    public ServerResult recommandMeetRoom(HttpServletRequest request, @RequestBody RecommandPara recommandPara) {
        int[] equips = recommandPara.getEquips();
        double[] weight = recommandPara.getWeight();
        List<Meetroom> meetrooms = meetingService.getEffectiveMeetroom(request);
//        List<Meetroom>meetrooms=meetroomRepository.findByTenantId((Integer) request.getSession().getAttribute("tenantId"));
        int equipLength = equips.length;
        double target[] = new double[equipLength + 1];//需求
        for (int j = 0; j < equipLength; j++) {
            target[j] = 1;
        }
//        System.out.println("out target:"+target[]);

        List<RecommandResult> recommandResults = new ArrayList<>();
        RecommandResult recommandResult;
        NumberFormat nf = NumberFormat.getPercentInstance();
        for (Meetroom meetroom : meetrooms) {
            double source[] = new double[equipLength + 1];
            target[equipLength] = recommandPara.getContain();
            int meetRoomId = meetroom.getId();
            for (int i = 0; i < equipLength; i++) {
                MeetroomEquip meetroomEquip = meetroomEquipRepository.findByEquipIdAndMeetroomId(equips[i], meetRoomId);
                if (meetroomEquip == null)
                    source[i] = 0;
                else
                    source[i] = 1;
            }
            source[equipLength] = meetroom.getContain();
            double similar = meetingService.countSimilar(source, target, weight);
            if (nf.format(similar).equals("\ufffd")) {
            } else {
                recommandResult = new RecommandResult();
                recommandResult.setMeetRoomId(meetRoomId);
                Meetroom meetroom1 = meetRoomService.getMeetRoom(meetRoomId);
                recommandResult.setMeetRoomName(meetroom1.getName());
                recommandResult.setContain(meetroom1.getContain());
                recommandResult.setNum(meetroom1.getNum());
                List<MeetroomEquip> meetroomEquips = meetroomEquipRepository.findByMeetroomId(meetRoomId);
//                List<String> equips1 = new ArrayList<>();
//                for (int j = 0; j < meetroomEquips.size(); j++) {
//                    Equip equip = equipService.getOne(meetroomEquips.get(j).getEquipId());
//                    equips1.add(equip.getName());
//                }
                recommandResult.setMeetroomEquips(meetroomEquips);
//                recommandResult.setEquips(equips1);
                recommandResult.setCalSimilar(similar);
                recommandResult.setSimilar(nf.format(similar));
                recommandResults.add(recommandResult);
            }
        }
        Collections.sort(recommandResults, new Comparator<RecommandResult>() {
            /*
             * int compare(Person p1, Person p2) 返回一个基本类型的整型，
             * 返回负数表示：p1 大于p2，
             * 返回0 表示：p1和p2相等，
             * 返回正数表示：p1小于p2
             */
            public int compare(RecommandResult p1, RecommandResult p2) {
                //按照相似度进行升序排列
                if (p1.getCalSimilar() > p2.getCalSimilar()) {
                    return -1;
                }
                if (p1.getCalSimilar() == p2.getCalSimilar()) {
                    return 0;
                }
                return 1;
            }
        });
        ServerResult serverResult = new ServerResult();
        serverResult.setData(recommandResults);
        serverResult.setStatus(true);
        return serverResult;
    }

    //查找智能推荐会议室空闲时间段
    @RequestMapping("/findFreeTime")
    public ServerResult findFreeTime(@RequestParam("meetDate") String meetDate, @RequestParam("meetRoomId") Integer meetRoomId, HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetroomParameter meetroomParameter = meetroomParameterRepository.findByTenantId(tenantId);
        String beginTime = meetroomParameter.getBegin();
        String overTime = meetroomParameter.getOver();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String yearMonth = sdf.format(new java.util.Date()).substring(0, 10);
        List<String> result = new ArrayList<>();
        if (yearMonth.equals(meetDate)) {
            String nowTime = sdf.format(new java.util.Date()).substring(11, 16);
            List<Meeting> meetings = meetingRepository.selectByMeetDateAndStatusEQLOneAndThree(meetDate, meetRoomId);
            result = MeetUtil.returnFreeTime(nowTime, overTime, meetings);
        } else {
            List<Meeting> meetings = meetingRepository.selectByMeetDateAndStatus(meetDate, 1, meetRoomId);
            result = MeetUtil.returnFreeTime(beginTime, overTime, meetings);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setData(result);
        return serverResult;
    }

    /*-------------华丽分割线-------------*/
    //跳转条件查找预定记录页面,返回显示会议室id和名字，部门id和名字
    @RequestMapping("/toFindMeetingBySpecification")
    public ServerResult toFindMeetingBySpecification(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<Meetroom> meetrooms = meetroomRepository.findByTenantId(tenantId);
        List<Depart> departs = departRepository.findByTenantId(tenantId);
        List<List> lists = new ArrayList<>();
        lists.add(meetrooms);
        lists.add(departs);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(lists);
        serverResult.setStatus(true);
        return serverResult;
    }

    //条件查找预定记录,参数备注见实体类，查询开始时间、结束时间必须同时有才可以
    @RequestMapping("/findMeetingBySpecification")
    public ServerResult findMeetingBySpecification(@RequestBody SelectMeetingParameter selectMeetingParameter, HttpServletRequest request) {
        ServerResult serverResult = new ServerResult();
        List<Meeting> meetings = meetingService.findBySpecification(selectMeetingParameter, request);
        List<ReserverRecord> list = new ArrayList<>();
        ReserverRecord reserverRecord;
        Meeting meeting;
        for (int i = 0; i < meetings.size(); i++) {
            reserverRecord = new ReserverRecord();
            meeting = meetings.get(i);
            String status = "";
            switch (meeting.getStatus()) {
                case 6:
                    status = "预约失败";
                    break;
                case 1:
                    status = "预约成功";
                    break;
                case 2:
                    status = "预约中";
                    break;
                case 3:
                    status = "会议进行中";
                    break;
                case 4:
                    status = "会议结束";
                    break;
                case 5:
                    status = "取消会议";
                    break;
                case 7:
                    status = "调用失败";
                    break;
                case 8:
                    status = "调用中";
                    break;
            }
            reserverRecord.setStatus(status);
            reserverRecord.setId(meeting.getId());
            reserverRecord.setTopic(meeting.getTopic());
            reserverRecord.setBegin(meeting.getBegin());
            reserverRecord.setOver(meeting.getOver());
            Meetroom meetroom = meetingService.findByMeetRoomId(meeting.getMeetroomId());
            reserverRecord.setMeetRoom(meetroom.getName());
            reserverRecord.setCreateTime(meeting.getCreateTime());
            reserverRecord.setPeopleName(meeting.getUserinfo().getName());
            if (meeting.getDepart() != null) {
                reserverRecord.setDepartName(meeting.getDepart().getName());
            }
            list.add(reserverRecord);
        }
        serverResult.setData(list);
        serverResult.setStatus(true);
        return serverResult;
    }

    //导出会议预定情况，需要和findMeetingBySpecification一样的条件传入
    @RequestMapping("/exportMeetingRecord")
    public void exportMeetingRecord(@RequestBody SelectMeetingParameter selectMeetingParameter, HttpServletRequest request, HttpServletResponse response) throws IOException {
        ServerResult serverResult = new ServerResult();
        List<Meeting> meetings = meetingService.findBySpecification(selectMeetingParameter, request);
        meetingService.exportMeetingRecord(meetings, response);
    }

    //传入参数begin查询开始时间 over结束时间 way方面 1会议室 2部门 3预定人 type方式 1时间 2次数
    @RequestMapping("/selectDataCount")
    public ServerResult selectDataCount(HttpServletRequest request, @RequestParam("begin") String begin, @RequestParam("over") String over, @RequestParam("way") int way, @RequestParam("type") int type) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        ServerResult serverResult = new ServerResult();
        if (way == 1 && type == 1) {
            List<Object> result = meetingService.countHourByMeetRoom(tenantId, begin, over);
            List<MeetRoomHour> meetRoomHours = (List<MeetRoomHour>) result.get(0);
            if (meetRoomHours.size() != 0) {
                serverResult.setMessage(meetRoomHours.get((int) result.get(1)).getMeetRoomName() + "会议室在查询时间内使用会议室时间长，建议增加开设该类型会议室，" +
                        "对该会议室资源进行合理分配管理");
                serverResult.setData(meetRoomHours);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
            }
        } else if (way == 1 && type == 2) {
            List<Object> result = meetingService.countTimeByMeetRoom(tenantId, begin, over);
            List<MeetRoomTime> meetRoomTimes = (List<MeetRoomTime>) result.get(0);
            if (meetRoomTimes.size() != 0) {
                serverResult.setMessage(meetRoomTimes.get((int) result.get(1)).getMeetRoomName() + "在查询时间内使用频率高，建议增加开设该类型会议室，" +
                        "对该会议室资源进行合理分配管理");
                serverResult.setData(meetRoomTimes);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        } else if (way == 2 && type == 1) {
            List<Object> result = meetingService.countHourByDepart(tenantId, begin, over);
            List<DepartHour> departHours = (List<DepartHour>) result.get(0);
            if (departHours.size() != 0) {
                serverResult.setMessage(departHours.get((int) result.get(1)).getDepartName() + "在查询时间内使用会议室时间长，建立对会议室资源进行合理调控");
                serverResult.setData(departHours);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        } else if (way == 2 && type == 2) {
            List<Object> result = meetingService.countTimeByDepart(tenantId, begin, over);
            List<DepartTime> departTimes = (List<DepartTime>) result.get(0);
            if (departTimes.size() != 0) {
                serverResult.setMessage(departTimes.get((int) result.get(1)).getDepartName() + "在查询时间内使用会议室频率高，建立对会议室资源进行合理调控");
                serverResult.setData(departTimes);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        } else if (way == 3 && type == 1) {
            List<Object> result = meetingService.countHourByPeople(tenantId, begin, over);
            List<UserHour> userHours = (List<UserHour>) result.get(0);
            if (userHours.size() != 0) {
                serverResult.setMessage(userHours.get((int) result.get(1)).getUserName() + "在查询时间内使用会议室时间长，建立对会议室资源进行合理调控");
                serverResult.setData(userHours);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        } else if (way == 3 && type == 2) {
            List<Object> result = meetingService.countTimeByPeople(tenantId, begin, over);
            List<UserTime> userTimes = (List<UserTime>) result.get(0);
            if (userTimes.size() != 0) {
                serverResult.setMessage(userTimes.get((int) result.get(1)).getUserName() + "在查询时间内使用会议室频率高，建立对会议室资源进行合理调控");
                serverResult.setData(userTimes);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        }
        return serverResult;
    }

    @RequestMapping("/indexData")
    public ServerResult indexData(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        // validate params in request
        if (userId == null || tenantId == null) {
            return ServerResult.failWithMessage("Invalid request parameters");
        }
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String today = simpleDateFormat.format(new Date());
        Date addDay = DateUtil.addDay(new Date(), 14);
        Date reduceDay = DateUtil.addDay(new Date(), -14);
        List<Meeting> meetings = meetingRepository.findMyRecentMeeting(userId, simpleDateFormat.format(reduceDay), simpleDateFormat.format(addDay));
        DecimalFormat df = new DecimalFormat("0.00");
        log.info("userId: " + userId + " tenantId: " + tenantId);
        double free = Double.parseDouble(df.format((float) meetroomRepository.countFree(tenantId) / meetroomRepository.countAll(tenantId))) * 100;
        List<Meeting> meetingList = meetingRepository.findMyLastTwoWeekMeeting(userId, simpleDateFormat.format(reduceDay), today);
        List<Integer> meetingCount = new ArrayList<>();
        int countSum;
        for (int i = 1; i <= 14; i++) {
            String date = simpleDateFormat.format(DateUtil.addDay(reduceDay, i));
            countSum = 0;
            for (Meeting meeting : meetingList) {
                if (meeting.getMeetDate().equals(date))
                    countSum++;
            }
            meetingCount.add(countSum);
        }
        List<Object> meetRoomCount = new ArrayList<>();
        List<Meeting> groupMeeting = meetingRepository.GroupMyLastTwoWeekMeetingByMeetRoom(userId, simpleDateFormat.format(reduceDay), today);
        for (Meeting meeting : groupMeeting) {
            List<Object> list = new ArrayList<>();
            int count = meetingRepository.countMyLastTwoWeekMeetingByRoomId(userId, simpleDateFormat.format(reduceDay), today, meeting.getMeetroomId());
            list.add(meeting.getMeetroom().getName());
            list.add(count);
            meetRoomCount.add(list);
        }
        List<Meeting> m = meetingRepository.GroupLastTwoWeekMeetingByTenant(tenantId, simpleDateFormat.format(reduceDay), today);
        List<Object> tenantMeetRoomCount = new ArrayList<>();
        for (Meeting meeting : m) {
            List<Object> list = new ArrayList<>();
            int count = meetingRepository.countLastTwoWeekMeetingByRoomId(simpleDateFormat.format(reduceDay), today, meeting.getMeetroomId());
            list.add(meeting.getMeetroom().getName());
            list.add(count);
            tenantMeetRoomCount.add(list);
        }
        ServerResult serverResult = new ServerResult();
        List<Object> result = new ArrayList<>();
        result.add(meetings);//用户近两周和过去两周将要参加的会议
        result.add(free);//当前时间段空余会议室
        result.add(meetingList.size());//用户前两周召开的会议次数
        result.add(meetingCount);//用户前两周每天召开的会议次数
        result.add(meetingList);//用户近两周参加的会议信息
        result.add(meetRoomCount);//用户前两周每个会议室的使用次数统计
        result.add(tenantMeetRoomCount);//租户的每个会议室前两周使用次数统计
        serverResult.setData(result);
        serverResult.setStatus(true);
        return serverResult;
    }

    //管理端进行预定会议
    @RequestMapping("/reserveByManage")
    public ServerResult reserveByManage(@RequestBody ReserveParameter reserveParameter, HttpServletRequest request) throws Exception {
        ServerResult serverResult = new ServerResult();
        Integer userId = reserveParameter.getUserId();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetroomParameter meetroomParameter = meetroomParameterRepository.findByTenantId(tenantId);
        String beginTime = meetroomParameter.getBegin();
        String overTime = meetroomParameter.getOver();
        int lastTime = reserveParameter.getLastTime();
        int prepareTime = reserveParameter.getPrepareTime();
        String reserveBeginTime = reserveParameter.getBeginTime();
        String reserveDate = reserveParameter.getReserveDate();
        String afterBeginTime = reserveDate + " " + reserveParameter.getBeginTime();
        String afterOverTime = TimeUtil.addMinute(afterBeginTime, lastTime);
        String nowTime = sdf.format(new java.util.Date());
        TimeUtil timeUtil = new TimeUtil();
        int bol1 = 2, bol2 = 2, bol3 = 2, bol4 = 2;
        bol1 = timeUtil.DateCompare(reserveBeginTime, beginTime, "HH:mm");
        bol2 = timeUtil.DateCompare(afterOverTime.substring(11, 16), overTime, "HH:mm");
        bol3 = timeUtil.DateCompare(reserveBeginTime, afterOverTime.substring(11, 16), "HH:mm");
        bol4 = timeUtil.DateCompare(afterBeginTime, nowTime, "yyyy-MM-dd HH:mm");
        if (prepareTime > lastTime) {
            serverResult.setMessage("准备时间不能大于持续时间");
        } else if (bol3 == 0) {
            serverResult.setMessage("预定时间不能为0分钟");
        } else if (bol1 == -1) {
            serverResult.setMessage("预定时间不能早于" + beginTime);
        } else if (bol2 == 1) {
            serverResult.setMessage("结束时间不能晚于" + overTime);
        } else if (bol4 == -1) {
            serverResult.setMessage("预定会议时间不能在当前时间之前");
        } else {
            Integer meetroomId = reserveParameter.getMeetRoomId();
            List<Meeting> meetings = meetingRepository.findIntersectMeeting(afterBeginTime, afterOverTime, meetroomId);
            if (meetings.size() != 0) {
                return ServerResult.failWithMessage("预定时间段有冲突");
            }
            Meeting meeting = new Meeting();
            meeting.setMeetDate(reserveParameter.getReserveDate());
            meeting.setBegin(afterBeginTime);
            meeting.setContent(reserveParameter.getContent());
            meeting.setMeetroomId(meetroomId);
            meeting.setOver(afterOverTime);
            meeting.setStatus(1);
            meeting.setLastTime(lastTime);
            meeting.setTopic(reserveParameter.getTopic());
            meeting.setTenantId(tenantId);
            meeting.setUserId(userId);
            meeting.setMeetDate(reserveDate);
            meeting.setPrepareTime(prepareTime);
            Userinfo userinfo = userinfoService.getUserinfo(userId);
            meeting.setDepartId(userinfo.getDepartId());
            meeting.setCreateTime(nowTime);
            Meeting meeting1 = meetingRepository.saveAndFlush(meeting);
            Integer meetingId = meeting1.getId();
            JoinPerson joinPerson;
            PushMessage pushMessage;
//                Meetroom meetroom=findByMeetRoomId(meetroomId);
            String message = "您有一个新的会议，点击查看详情";
            int b = 0;
            List<Integer> list = reserveParameter.getJoinPeopleId();
            for (int i = 0; i < list.size(); i++) {
                Integer id = list.get(i);
                if (id.equals(userId))
                    b = 1;
                joinPerson = new JoinPerson();
                joinPerson.setMeetingId(meetingId);
                joinPerson.setUserId(id);
                joinPerson.setStatus(0);
                joinPersonRepository.saveAndFlush(joinPerson);
                pushMessage = new PushMessage();
                pushMessage.setReceiveId(id);
                pushMessage.setStatus(0);
                pushMessage.setMessage(message);
                pushMessage.setMeetingId(meetingId);
                pushMessage.setTime(nowTime);
                pushMessageRepository.saveAndFlush(pushMessage);
            }
            if (b == 0) {
                joinPerson = new JoinPerson();
                joinPerson.setMeetingId(meetingId);
                joinPerson.setUserId(userId);
                joinPerson.setStatus(0);
                joinPersonRepository.saveAndFlush(joinPerson);
                pushMessage = new PushMessage();
                pushMessage.setReceiveId(userId);
                pushMessage.setStatus(0);
                pushMessage.setMessage(message);
                pushMessageRepository.saveAndFlush(pushMessage);
            }
            List<OutsideJoinPerson> outsideJoinPersons = reserveParameter.getOutsideJoinPersons();
            for (int i = 0; i < outsideJoinPersons.size(); i++) {
                OutsideJoinPerson outsideJoinPerson = new OutsideJoinPerson();
                outsideJoinPerson.setName(outsideJoinPersons.get(i).getName());
                outsideJoinPerson.setPhone(outsideJoinPersons.get(i).getPhone());
                outsideJoinPerson.setMeetingId(meetingId);
                outsideJoinPersonRepository.saveAndFlush(outsideJoinPerson);
            }
            serverResult.setMessage("会议预定成功");
            serverResult.setStatus(true);
        }
        return serverResult;
    }


}
