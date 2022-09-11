package com.IMeeting.service.serviceImpl;

import com.IMeeting.entity.*;
import com.IMeeting.resposirity.DepartRepository;
import com.IMeeting.resposirity.PositionRepository;
import com.IMeeting.resposirity.RoleInfoRepository;
import com.IMeeting.resposirity.UserinfoRepository;
import com.IMeeting.service.TenantService;
import com.IMeeting.service.UserinfoService;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.IMeeting.config.Constant.DEFAULT_PASSWORD;

@Service
public class UserserviceImpl implements UserinfoService {
    @Autowired
    private UserinfoRepository userinfoRepository;
    @Autowired
    private DepartRepository departRepository;
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private RoleInfoRepository roleInfoRepository;
    @Autowired
    private TenantService tenantService;

    @Override
    public Userinfo login(String username, String password) {
        Userinfo u1 = userinfoRepository.findByUsername(username);
        if (u1 != null && BCrypt.checkpw(password, u1.getPassword())) {
            return u1;
        }

        Userinfo u2 = userinfoRepository.findByPhone(username);
        if (u2 != null && BCrypt.checkpw(password, u2.getPassword())) {
            return u2;
        }
        return null;
    }

    @Override
    public Userinfo getUserinfo(Integer id) {
        Optional<Userinfo> userinfo = userinfoRepository.findById(id);
        if (userinfo.isPresent()) {
            return userinfo.get();
        }
        return null;
    }

    @Override
    public Depart getDepart(Integer id) {
        Optional<Depart> depart = departRepository.findById(id);
        if (depart.isPresent()) {
            return depart.get();
        }
        return null;
    }

    @Override
    public Position getPosition(Integer id) {
        Optional<Position> position = positionRepository.findById(id);
        if (position.isPresent()) {
            return position.get();
        }
        return null;
    }

    /*-------------华丽分割线-------------*/
    @Override
    public ServerResult selectAllPeople(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<List> result = new ArrayList<>();
        List<Depart> departs = departRepository.findByTenantId(tenantId);
        List<Position> positions = positionRepository.findByTenantId(tenantId);
        List<RoleInfo> roleInfos = roleInfoRepository.findByTenantId(tenantId);
        result.add(departs);
        result.add(positions);
        result.add(roleInfos);
        List<Userinfo> userinfos = userinfoRepository.findByTenantIdAndStatus(tenantId, 1);
        result.add(userinfos);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(result);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult updateOne(Userinfo userinfo) {
        Integer userId = userinfo.getId();
        Userinfo userInServer = getUserinfo(userId);
        if (userInServer.getWorknum().equals(userinfo.getWorknum())) {
        } else {
            Optional<Tenant> tenantOptional = tenantService.findById(userInServer.getTenantId());
            if (!tenantOptional.isPresent()) {
                return ServerResult.failWithMessage("No Tenant onboarded yet");
            }
            userinfo.setUsername(tenantOptional.get().getNum() + "—" + userinfo.getWorknum());
            userinfoRepository.updateUsername(userId, tenantOptional.get().getNum() + "-" + userinfo.getWorknum());
        }
        Integer departId = null, positionId = null, roleId = null;
        if (userinfo.getPositionId() != null)
            positionId = userinfo.getPositionId();
        if (userinfo.getDepartId() != null)
            departId = userinfo.getDepartId();
        if (userinfo.getRoleId() != null)
            roleId = userinfo.getRoleId();
        userinfoRepository.updateUserInfo(userId, userinfo.getWorknum(), userinfo.getName(), userinfo.getPhone(), departId, positionId, roleId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult insertOne(Userinfo userinfo, Integer tenantId) {
        Optional<Tenant> tenantOptional = tenantService.findById(tenantId);
        if (!tenantOptional.isPresent()) {
            return ServerResult.failWithMessage("No Tenant onboarded yet");
        }
        userinfo.setUsername(tenantOptional.get().getNum() + "-" + userinfo.getWorknum());
        userinfo.setTenantId(tenantId);
        String hashedPassword = BCrypt.hashpw(DEFAULT_PASSWORD, BCrypt.gensalt());
        userinfo.setPassword(hashedPassword);
        userinfo.setStatus(1);
        if (userinfo.getDepartId() == null) {
            userinfo.setDepartId(0);
        }
        userinfoRepository.saveAndFlush(userinfo);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult batchImport(String fileName, MultipartFile file, HttpServletRequest request) throws
            Exception {
        List<Userinfo> userinfos = new ArrayList<Userinfo>();
        ServerResult serverResult = new ServerResult();
        if (!fileName.matches("^.+\\.(?i)(xls)$") && !fileName.matches("^.+\\.(?i)(xlsx)$")) {
            serverResult.setMessage("文件格式不正确,必须为xls或者xlsx格式");
            serverResult.setStatus(true);
        }
        boolean isExcel2003 = true;
        if (fileName.matches("^.+\\.(?i)(xlsx)$")) {
            isExcel2003 = false;
        }
        InputStream is = file.getInputStream();
        Workbook wb = null;
        if (isExcel2003) {
            wb = new HSSFWorkbook(is);
        } else {
            wb = new XSSFWorkbook(is);
        }
        Sheet sheet = wb.getSheetAt(0);
        boolean flag = false;
        Userinfo userinfo;
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Optional<Tenant> tenantOptional = tenantService.findById(tenantId);
        if (!tenantOptional.isPresent()) {
            return ServerResult.failWithMessage("No tenant found for tenant " + tenantId);
        }
        String tenantNum = tenantOptional.get().getNum();
        String hashedPassword = BCrypt.hashpw(DEFAULT_PASSWORD, BCrypt.gensalt());
        for (int r = 1; r <= sheet.getLastRowNum(); r++) {
            Row row = sheet.getRow(r);
            if (row == null) {
                continue;
            }
            userinfo = new Userinfo();
            row.getCell(0).setCellType(Cell.CELL_TYPE_STRING);
            String workNum = row.getCell(0).getStringCellValue();
            if (workNum == null || workNum.isEmpty()) {
                serverResult.setMessage("导入失败(第" + (r + 1) + "行,工号未填写)");
                serverResult.setStatus(true);
                flag = true;
                break;
            }
            if (row.getCell(1).getCellType() != 1) {
                serverResult.setMessage("导入失败(第" + (r + 1) + "行,姓名请设为文本格式)");
                serverResult.setStatus(true);
                flag = true;
                break;
            }
            String name = row.getCell(1).getStringCellValue();
            if (name == null || name.isEmpty()) {
                serverResult.setMessage("导入失败(第" + (r + 1) + "行,姓名未填写)");
                serverResult.setStatus(true);
                flag = true;
                break;
            }
            row.getCell(2).setCellType(Cell.CELL_TYPE_STRING);
            String phone = row.getCell(2).getStringCellValue();
            Userinfo u = userinfoRepository.findByWorknumAndTenantId(workNum, tenantId);
            if (u != null) {
                serverResult.setMessage("导入失败(第" + (r + 1) + "行工号为" + workNum + "的员工已存在)");
                serverResult.setStatus(true);
                flag = true;
                break;
            }
            userinfo.setName(name);
            userinfo.setWorknum(workNum);
            userinfo.setUsername(tenantNum + workNum);
            userinfo.setPassword(hashedPassword);
            userinfo.setPhone(phone);
            userinfo.setTenantId(tenantId);
            userinfo.setStatus(1);
            userinfo.setDepartId(0);
            userinfos.add(userinfo);
        }
        if (flag == false) {
            for (Userinfo userinfoRecord : userinfos) {
                userinfoRepository.saveAndFlush(userinfoRecord);
            }
            serverResult.setStatus(true);
            serverResult.setMessage("导入成功");
        }
        return serverResult;
    }

    @Override
    public ServerResult showOne(Integer id) {
        Userinfo userinfo = getUserinfo(id);
        UserInfoResult userInfoResult = new UserInfoResult();
        userInfoResult.setId(userinfo.getId());
        userInfoResult.setWorknum(userinfo.getWorknum());
        userInfoResult.setName(userinfo.getName());
        userInfoResult.setPhone(userinfo.getPhone());
        userInfoResult.setResume(userinfo.getResume());
        userInfoResult.setDepartId(userinfo.getDepartId());
        userInfoResult.setPositionId(userinfo.getPositionId());
        userInfoResult.setRoleId(userinfo.getRoleId());
        if (userinfo.getDepartId() != null) {
            Depart depart = getDepart(userinfo.getDepartId());
            userInfoResult.setDepartName(depart.getName());
        }
        if (userinfo.getPositionId() != null) {
            Position position = getPosition(userinfo.getPositionId());
            userInfoResult.setPositionName(position.getName());
        }
        if (userinfo.getRoleId() != null) {
            RoleInfo role = getRoleInfo(userinfo.getRoleId());
            userInfoResult.setRoleName(role.getName());
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setData(userInfoResult);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public RoleInfo getRoleInfo(Integer roleId) {
        Optional<RoleInfo> roleInfo = roleInfoRepository.findById(roleId);
        if (roleInfo.isPresent())
            return roleInfo.get();
        return null;
    }
}
