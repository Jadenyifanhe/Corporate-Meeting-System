package com.IMeeting.resposirity;

/**
 * Created by gjw on 2018/12/12.
 */

import com.IMeeting.entity.MeetroomParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface MeetroomParameterRepository extends JpaRepository<MeetroomParameter,Integer>{
    MeetroomParameter findByTenantId(Integer tenantId);
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update m_meetroom_parameter set `begin`=:begin,date_limit=:dateLimit,`over`=:over,time_interval=:timeInterval,time_limit=:timeLimit where id=:id",nativeQuery = true)
    int updateMMeetroomPara(Integer id,String begin,Integer dateLimit,String over,Integer timeInterval,Integer timeLimit);
}
