package com.IMeeting.resposirity;

import com.IMeeting.entity.AbnormalInfo;
import com.IMeeting.entity.CoordinateInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
public interface AbnormalRepository extends JpaRepository<AbnormalInfo,Integer> {
    List<AbnormalInfo> findByStatus(int status);
    List<AbnormalInfo>findByMeetingIdAndImgUrl(int meetingId,String imgUrl);
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update AbnormalInfo m set m.status=1 where m.id=?1")
    int changeStatus(int id);
    @Query(value = "select m from AbnormalInfo m where m.userId=?1 and m.status=1 order by m.isRead ,m.time")
    List<AbnormalInfo>selectMyAbnormal(int userId);
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update AbnormalInfo m set m.isRead=1 where m.id=?1")
    int isRead(int id);
}
