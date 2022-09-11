package com.IMeeting.controller;

import com.IMeeting.dao.FaceDao;
import com.IMeeting.dao.OpenApplyDao;
import com.IMeeting.entity.*;
import com.IMeeting.resposirity.FaceInfoRepository;
import com.IMeeting.resposirity.JoinPersonRepository;
import com.IMeeting.resposirity.OpenApplyRepository;
import com.IMeeting.resposirity.UserinfoRepository;
import com.IMeeting.service.FaceService;
import com.IMeeting.service.UserinfoService;
import com.IMeeting.util.BinaryConversion;
import com.IMeeting.util.FaceRecognition;
import com.IMeeting.util.FileUtil;
import com.IMeeting.util.TimeUtil;
import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.OSSException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


@RestController
@RequestMapping("/face")
public class FaceController {
    @Autowired
    private FaceInfoRepository faceInfoRepository;
    @Autowired
    private FaceService faceService;
    @Autowired
    private UserinfoRepository userinfoRepository;
    @Autowired
    private JoinPersonRepository joinPersonRepository;
    @Autowired
    private UserinfoService userinfoService;
    @Autowired
    private OpenApplyDao openApplyDao;
    @Autowired
    private FaceDao faceDao;
    @Autowired
    private OpenApplyRepository openApplyRepository;

    public String getUrl(MultipartFile fileupload) throws OSSException, ClientException, IOException {
        String endpoint = "oss-cn-beijing.aliyuncs.com";
        String accessKeyId = "LTAI8bzC3TvwnYNZ";
        String accessKeySecret = "OPbUtvrPLs1zme45RHMcjf7jINWqpR";

        // 创建OSSClient实例
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);

        // 文件桶
        String bucketName = "jgn";
        // 文件名格式
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmss");
        // 该桶中的文件key
        String dateString = sdf.format(new Date()) + ".jpg";// 20180322010634.jpg
        // 上传文件
        ossClient.putObject("jgn", dateString, new ByteArrayInputStream(fileupload.getBytes()));

        // 设置URL过期时间为100年，默认这里是int型，转换为long型即可
        Date expiration = new Date(new Date().getTime() + 3600l * 1000 * 24 * 365 * 100);
        // 生成URL
        URL url = ossClient.generatePresignedUrl(bucketName, dateString, expiration);
        return url.toString();
    }

    @RequestMapping("/insert")
    public ServerResult insertPicture(@RequestParam("fileupload") MultipartFile fileupload, @RequestParam("faceDetail") String faceDetail, HttpServletRequest request) throws OSSException, ClientException, IOException {
        FaceInfo faceInfo = new FaceInfo();
        faceInfo.setTenantId((Integer) request.getSession().getAttribute("tenantId"));
        faceInfo.setFaceDetail(BinaryConversion.parseHexStr2Byte(faceDetail));
        faceInfo.setStatus(0);
        faceInfo.setUserId((Integer) request.getSession().getAttribute("userId"));
        faceInfo.setFaceAddress(getUrl(fileupload));
        FaceInfo bol = faceInfoRepository.saveAndFlush(faceInfo);
        ServerResult serverResult = new ServerResult();
        if (bol != null)
            serverResult.setStatus(true);
        return serverResult;
    }

    //审核失败重新上传面部信息
    @RequestMapping("/update")
    public ServerResult update(@RequestParam("fileupload") MultipartFile fileupload, @RequestParam("faceDetail") String faceDetail, HttpServletRequest request) throws OSSException, ClientException, IOException {
        String faceAddress = getUrl(fileupload);
        byte[] realFaceDetail = BinaryConversion.parseHexStr2Byte(faceDetail);
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        int bol = faceInfoRepository.updateFaceInfo(userId, 0, faceAddress, realFaceDetail);
        ServerResult serverResult = new ServerResult();
        if (bol != 0) {
            serverResult.setStatus(true);
        }
        return serverResult;
    }

    //查询该用户数据库中是否有人脸数据记录，如果有及相应状态
    //查询结构返回code -1表示没有人脸数据 0表示未审核 1表示已通过 2表示未通过
    @RequestMapping("/selectStatus")
    public ServerResult insertPicture(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        FaceInfo faceInfo = faceInfoRepository.findByUserId(userId);
        ServerResult serverResult = new ServerResult();
        if (faceInfo == null)
            serverResult.setCode(-1);//没有该用户人脸数据
        else {
            Integer status = faceInfo.getStatus();
            serverResult.setCode(status);
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    //比较某一员工的人脸数据
    @RequestMapping("/compare")
    public ServerResult compare(@RequestParam("faceDetail") String faceDetail, @RequestParam("meetingId") Integer meetingId, HttpServletRequest request) throws IOException {
//        File f=FileUtil.multoFile(fileupload);
        System.out.println("会议签到");
        ServerResult serverResult = new ServerResult();
        FaceRecognition faceRecognition = new FaceRecognition();
        byte[] source = BinaryConversion.parseHexStr2Byte(faceDetail);
//        byte[]=faceRecognition.getFeatureData(f);
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<JoinPerson> joinPersons = joinPersonRepository.findByMeetingId(meetingId);
//        List<FaceInfo> faceInfoList=faceInfoRepository.findByTenantIdAndStatus(tenantId,1);
        FaceInfo faceInfo;
        JoinPerson joinPerson;
        double similarResult = 0;
        int bol = 0;
        System.out.println("循环 从参会人员列表中获取面部信息，进行比较");
        System.out.println("参会人员数量："+joinPersons.size());
        for (int i = 0; i < joinPersons.size(); i++) {
            System.out.println("第"+i+"个参会人员");
            joinPerson = joinPersons.get(i);
            faceInfo = faceInfoRepository.findByUserIdAndStatus(joinPerson.getUserId(), 1);
            System.out.println("查找人脸列表中是否有参会人员人脸信息");
            if (faceInfo != null) {
                System.out.println("有人脸信息，进行相似度比较");
                byte[] target = faceInfo.getFaceDetail();
                similarResult = faceRecognition.faceCompare(source, target);
            }
            if (similarResult > 0.8) {
                System.out.println("身份验证成功！");
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String nowTime = sdf.format(new java.util.Date());
                System.out.println("进行签到");
                joinPersonRepository.updateStatusAndTime(joinPerson.getId(), 1, nowTime);
                bol = 1;
                Userinfo userinfo=userinfoService.getUserinfo(joinPerson.getUserId());
                serverResult.setMessage(userinfo.getName()+",欢迎您参加会议");
                System.out.println(userinfo.getName()+",欢迎您参加会议");
                break;
            }
//            System.out.println(similarResult);
        }
//        File del = new File(f.toURI());
//        del.delete();
        if (bol == 0) {
            serverResult.setMessage("对不起，您非本场参会人员");
            System.out.println("对不起，您非本场参会人员");
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    //会议室非签到身份验证
    @RequestMapping("/BaseCompare")
    public ServerResult BaseCompare(@RequestParam("faceDetail") String faceDetail,@RequestParam("meetRoomId") Integer meetRoomId, HttpServletRequest request) throws IOException {
        ServerResult serverResult = new ServerResult();
        FaceRecognition faceRecognition = new FaceRecognition();
        byte[] source = BinaryConversion.parseHexStr2Byte(faceDetail);
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<FaceInfo> faceInfoList=faceInfoRepository.findByTenantIdAndStatus(tenantId,1);
        FaceInfo faceInfo;
        double similarResult = 0;
        int userId=0;
        for (int i = 0; i < faceInfoList.size(); i++) {
                faceInfo=faceInfoList.get(i);
                byte[] target = faceInfo.getFaceDetail();
                similarResult = faceRecognition.faceCompare(source, target);
            if (similarResult > 0.8) {
                userId=faceInfo.getUserId();
                break;
            }
        }
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd");
        String today=simpleDateFormat.format(new Date());
        System.out.println(today);
        SimpleDateFormat simpleDateFormat1=new SimpleDateFormat("HH:mm");
        String nowTime=simpleDateFormat1.format(new Date());
        System.out.println(nowTime);
        List<OpenApply> openApplies=openApplyRepository.findByUserIdAndStatusAndMeetRoomId(1,1,meetRoomId,today,nowTime);
        int size=openApplies.size();
        if (size!=0){
            serverResult.setMessage("欢迎进入");
            serverResult.setCode(1);
        }else{
            serverResult.setMessage("对不起，您没有权限进入");
            serverResult.setCode(0);
        }


//        File del = new File(f.toURI());
//        del.delete();
        serverResult.setStatus(true);
        return serverResult;
    }

    //文件提取身份验证
    @RequestMapping("/FileCompare")
    public ServerResult FileCompare(@RequestParam("faceDetail") String faceDetail, HttpServletRequest request) throws IOException {
        ServerResult serverResult = new ServerResult();
        FaceRecognition faceRecognition = new FaceRecognition();
        byte[] source = BinaryConversion.parseHexStr2Byte(faceDetail);
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        FaceInfo faceInfo=faceInfoRepository.findByUserIdAndStatus(userId,1);
        double similarResult = 0;
        if (faceInfo==null){
            serverResult.setCode(-1);
            serverResult.setMessage("对不起，您还没有有效的面部信息");
        }
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String nowTime=simpleDateFormat.format(new Date());
        byte[] target = faceInfo.getFaceDetail();
        similarResult = faceRecognition.faceCompare(source, target);
        if (similarResult > 0.8) {
            serverResult.setMessage("验证通过");
            serverResult.setCode(1);
            faceDao.executeSql("update u_face m set m.last_time =? where m.id=?",nowTime,faceInfo.getId());
        }else{
            serverResult.setMessage("验证失败");
            serverResult.setCode(2);
        }
        serverResult.setStatus(true);
        return serverResult;
    }


    /*-------------华丽分割线-------------*/
    //查询该租户所有员工的面部信息
    @RequestMapping("/selectAll")
    public ServerResult selectAll(HttpServletRequest request) {
        ServerResult serverResult = faceService.selectAll(request);
        return serverResult;
    }

    //审核通过
    @RequestMapping("/pass")
    public ServerResult pass(@RequestParam("faceId") Integer faceId) {
        faceInfoRepository.updateFaceStatus(faceId, 1);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //审核未通过
    @RequestMapping("/dispass")
    public ServerResult dispass(@RequestParam("faceId") Integer faceId) {
        faceInfoRepository.updateFaceStatus(faceId, 2);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //删除某一员工的人脸数据
    @RequestMapping("/deleteOne")
    public ServerResult deleteOne(@RequestParam("faceId") Integer faceId) {
        faceInfoRepository.deleteOne(faceId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //管理端上传员工人脸数据
    @RequestMapping("/insertByManager")
    public ServerResult insertByManager(@RequestParam("file") MultipartFile fileupload, @RequestParam("worknum") String worknum, HttpServletRequest request) throws IOException {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Userinfo userinfo = userinfoRepository.findByWorknumAndTenantId(worknum, tenantId);
        ServerResult serverResult = new ServerResult();
        if (userinfo == null) {
            serverResult.setMessage("该工号的员工不存在");
        } else {
            Integer userId = userinfo.getId();
            FaceInfo faceinfo = faceInfoRepository.findByUserId(userId);
            if (faceinfo != null) {
                serverResult.setMessage("该工号的员工面部信息已存在，请勿重复录入");
            } else {
                FaceInfo faceInfo = new FaceInfo();
                faceInfo.setTenantId(tenantId);
                FaceRecognition faceRecognition = new FaceRecognition();
                File f = FileUtil.multoFile(fileupload);
                faceInfo.setFaceDetail(faceRecognition.getFeatureData(f));
                File del = new File(f.toURI());
                del.delete();
                faceInfo.setStatus(1);
                faceInfo.setUserId(userId);
                faceInfo.setFaceAddress(getUrl(fileupload));
                faceInfoRepository.saveAndFlush(faceInfo);
                serverResult.setStatus(true);
                f.delete();
            }
        }

        return serverResult;
    }
    

}
