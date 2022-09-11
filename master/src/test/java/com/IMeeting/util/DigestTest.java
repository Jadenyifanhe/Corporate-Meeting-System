package com.IMeeting.util;

import org.junit.Assert;
import org.junit.Test;
import org.mindrot.jbcrypt.BCrypt;

import static com.IMeeting.config.Constant.DEFAULT_PASSWORD;

public class DigestTest {
    @Test
    public void getBCryptValue() {
        String hashed = BCrypt.hashpw(DEFAULT_PASSWORD, BCrypt.gensalt());
        System.out.println(hashed);
        Assert.assertTrue(BCrypt.checkpw(DEFAULT_PASSWORD, hashed));

    }

}