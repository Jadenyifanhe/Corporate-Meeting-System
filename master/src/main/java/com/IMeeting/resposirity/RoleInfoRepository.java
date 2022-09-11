package com.IMeeting.resposirity;

import com.IMeeting.entity.RoleInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by gjw on 2019/2/1.
 */
@Repository
public interface RoleInfoRepository extends JpaRepository<RoleInfo,Integer>{
    List<RoleInfo>findByTenantId(Integer tenantId);
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from RoleInfo m where m.id=?1")
    int deleteOne(Integer roleId);
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update  RoleInfo m set name=?2 where m.id=?1")
    int updateOne(Integer roleId,String roleName);
}
