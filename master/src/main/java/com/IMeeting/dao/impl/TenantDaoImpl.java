package com.IMeeting.dao.impl;

import com.IMeeting.dao.TenantDao;
import com.IMeeting.dao.VideoRightDao;
import com.IMeeting.entity.Tenant;
import com.IMeeting.entity.VideoRight;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Repository
public class TenantDaoImpl extends BaseDaoImpl<Tenant,Integer>implements TenantDao {
}
