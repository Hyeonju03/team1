package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
    private LocalDateTime startDate;

    public MailDTO(String empCode, String title, String content, String mailTarget, String mailRef, String fileSize) {
        this.empCode = empCode;
        this.title = title;
        this.content = content;
        this.mailTarget = mailTarget;
        this.mailRef = mailRef;
        this.fileSize = fileSize;
    }
}
