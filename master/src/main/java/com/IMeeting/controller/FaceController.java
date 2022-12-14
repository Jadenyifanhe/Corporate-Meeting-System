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

        // ??????OSSClient??????
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);

        // ?????????
        String bucketName = "jgn";
        // ???????????????
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmss");
        // ??????????????????key
        String dateString = sdf.format(new Date()) + ".jpg";// 20180322010634.jpg
        // ????????????
        ossClient.putObject("jgn", dateString, new ByteArrayInputStream(fileupload.getBytes()));

        // ??????URL???????????????100?????????????????????int???????????????long?????????
        Date expiration = new Date(new Date().getTime() + 3600l * 1000 * 24 * 365 * 100);
        // ??????URL
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

    //????????????????????????????????????
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

    //?????????????????????????????????????????????????????????????????????????????????
    //??????????????????code -1???????????????????????? 0??????????????? 1??????????????? 2???????????????
    @RequestMapping("/selectStatus")
    public ServerResult insertPicture(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        FaceInfo faceInfo = faceInfoRepository.findByUserId(userId);
        ServerResult serverResult = new ServerResult();
        if (faceInfo == null)
            serverResult.setCode(-1);//???????????????????????????
        else {
            Integer status = faceInfo.getStatus();
            serverResult.setCode(status);
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    //?????????????????????????????????
    @RequestMapping("/compare")
    public ServerResult compare(@RequestParam("faceDetail") String faceDetail, @RequestParam("meetingId") Integer meetingId, HttpServletRequest request) throws IOException {
//        File f=FileUtil.multoFile(fileupload);
        System.out.println("????????????");
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
        System.out.println("?????? ?????????????????????????????????????????????????????????");
        System.out.println("?????????????????????"+joinPersons.size());
        for (int i = 0; i < joinPersons.size(); i++) {
            System.out.println("???"+i+"???????????????");
            joinPerson = joinPersons.get(i);
            faceInfo = faceInfoRepository.findByUserIdAndStatus(joinPerson.getUserId(), 1);
            System.out.println("??????????????????????????????????????????????????????");
            if (faceInfo != null) {
                System.out.println("???????????????????????????????????????");
                byte[] target = faceInfo.getFaceDetail();
                similarResult = faceRecognition.faceCompare(source, target);
            }
            if (similarResult > 0.8) {
                System.out.println("?????????????????????");
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String nowTime = sdf.format(new java.util.Date());
                System.out.println("????????????");
                joinPersonRepository.updateStatusAndTime(joinPerson.getId(), 1, nowTime);
                bol = 1;
                Userinfo userinfo=userinfoService.getUserinfo(joinPerson.getUserId());
                serverResult.setMessage(userinfo.getName()+",?????????????????????");
                System.out.println(userinfo.getName()+",?????????????????????");
                break;
            }
//            System.out.println(similarResult);
        }
//        File del = new File(f.toURI());
//        del.delete();
        if (bol == 0) {
            serverResult.setMessage("????????????????????????????????????");
            System.out.println("????????????????????????????????????");
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    //??????????????????????????????
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
            serverResult.setMessage("????????????");
            serverResult.setCode(1);
        }else{
            serverResult.setMessage("?????????????????????????????????");
            serverResult.setCode(0);
        }


//        File del = new File(f.toURI());
//        del.delete();
        serverResult.setStatus(true);
        return serverResult;
    }

    //????????????????????????
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
            serverResult.setMessage("?????????????????????????????????????????????");
        }
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String nowTime=simpleDateFormat.format(new Date());
        byte[] target = faceInfo.getFaceDetail();
        similarResult = faceRecognition.faceCompare(source, target);
        if (similarResult > 0.8) {
            serverResult.setMessage("????????????");
            serverResult.setCode(1);
            faceDao.executeSql("update u_face m set m.last_time =? where m.id=?",nowTime,faceInfo.getId());
        }else{
            serverResult.setMessage("????????????");
            serverResult.setCode(2);
        }
        serverResult.setStatus(true);
        return serverResult;
    }


    /*-------------???????????????-------------*/
    //??????????????????????????????????????????
    @RequestMapping("/selectAll")
    public ServerResult selectAll(HttpServletRequest request) {
        ServerResult serverResult = faceService.selectAll(request);
        return serverResult;
    }

    //????????????
    @RequestMapping("/pass")
    public ServerResult pass(@RequestParam("faceId") Integer faceId) {
        faceInfoRepository.updateFaceStatus(faceId, 1);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //???????????????
    @RequestMapping("/dispass")
    public ServerResult dispass(@RequestParam("faceId") Integer faceId) {
        faceInfoRepository.updateFaceStatus(faceId, 2);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //?????????????????????????????????
    @RequestMapping("/deleteOne")
    public ServerResult deleteOne(@RequestParam("faceId") Integer faceId) {
        faceInfoRepository.deleteOne(faceId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //?????????????????????????????????
    @RequestMapping("/insertByManager")
    public ServerResult insertByManager(@RequestParam("file") MultipartFile fileupload, @RequestParam("worknum") String worknum, HttpServletRequest request) throws IOException {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Userinfo userinfo = userinfoRepository.findByWorknumAndTenantId(worknum, tenantId);
        ServerResult serverResult = new ServerResult();
        if (userinfo == null) {
            serverResult.setMessage("???????????????????????????");
        } else {
            Integer userId = userinfo.getId();
            FaceInfo faceinfo = faceInfoRepository.findByUserId(userId);
            if (faceinfo != null) {
                serverResult.setMessage("????????????????????????????????????????????????????????????");
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
