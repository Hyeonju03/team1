package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.MailDTO;
import kr.or.nextit.team1.mappers.MailMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

@Service
public class MailSendService {

    private final MailMapper mailMapper;

    @Autowired
    public MailSendService(MailMapper mailMapper) {
        this.mailMapper = mailMapper;
    }

    public void sendMail(MailDTO mailDTO) {
        try{
            mailMapper.insertMail(mailDTO);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

        String title = mailDTO.getTitle();
        String content = mailDTO.getContent();
        String user_name = "kimdajin@naver.com";
        String password = "ekwlskim1325!";

        SendMail sendMail = new SendMail();

//      쪼개기
        String[] ccc = mailDTO.getMailRef().split(",");

        String[] toto = mailDTO.getMailTarget().split(",");

        String path = mailDTO.getFilePath();

        sendMail.goMail(sendMail.setting(new Properties(), user_name, password), title, content, toto ,ccc ,path);

    }

    public String saveFile(MultipartFile file) throws IOException {

        // 바탕화면 경로를 가져오기
        String filePath = System.getProperty("user.home") + "/fileFuck";

        // 파일 이름 설정 (원본 이름 + 현재 시간)
        String originalFileName = file.getOriginalFilename();
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String fileName = timestamp + "_" + originalFileName;

        // 저장할 파일 경로 설정
        Path path = Paths.get(filePath, fileName);

        Files.copy(file.getInputStream(), path);
        return path.toString();
    }

}
