package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class MailDTO implements Serializable {
    private String empCode;
    private String title;
    private String content;
    private String mailTarget;
    private String mailRef;
    private String fileName;
    private String fileOriginalName;
    private String fileSize;
    private String filePath;
    private MultipartFile attachment;
}
