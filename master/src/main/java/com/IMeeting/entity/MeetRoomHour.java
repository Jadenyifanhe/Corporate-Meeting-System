package com.IMeeting.entity;

/**
 * Created by gjw on 2019/2/11.
 */
public class MeetRoomHour {
    private int id;
    private String meetRoomName;
    private double hour;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMeetRoomName() {
        return meetRoomName;
    }

    public void setMeetRoomName(String meetRoomName) {
        this.meetRoomName = meetRoomName;
    }

    public double getHour() {
        return hour;
    }

    public void setHour(double hour) {
        this.hour = hour;
    }
}
