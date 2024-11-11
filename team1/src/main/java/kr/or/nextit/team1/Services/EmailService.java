package kr.or.nextit.team1.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Properties;
import java.util.Random;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationCode(String to , String code) {

        String title = "하잉 인증코드 보내줄겡";
        String content = code;
        String user_name = "kimdajin@naver.com";
        String password = "ekwlskim1325!";

        SendMail sendMail = new SendMail();
        sendMail.goMail(sendMail.setting(new Properties(), user_name, password), title, content, to);
    }
}
