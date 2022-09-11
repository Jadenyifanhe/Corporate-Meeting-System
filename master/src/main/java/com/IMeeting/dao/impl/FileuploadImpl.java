package com.IMeeting.dao.impl;

import com.IMeeting.dao.FileUploadDao;
import com.IMeeting.dao.MeetingDao;
import com.IMeeting.entity.FileUpload;
import com.IMeeting.entity.Meeting;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Repository
public class FileuploadImpl extends BaseDaoImpl<FileUpload,Integer>implements FileUploadDao {
}
