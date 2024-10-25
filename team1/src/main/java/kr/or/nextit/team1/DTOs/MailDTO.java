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
    private int mailNum;
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
    private boolean deleteYn;

    public MailDTO(int mailNum, String empCode, String title, String content, String mailTarget, String mailRef, String fileSize, LocalDateTime startDate) {
        this.mailNum = mailNum;
        this.empCode = empCode;
        this.title = title;
        this.content = content;
        this.mailTarget = mailTarget;
        this.mailRef = mailRef;
        this.fileSize = fileSize;
        this.startDate = startDate;
    }

    public MailDTO(int mailNum, String empCode, String title, String content, String mailTarget, String mailRef, String fileSize, LocalDateTime startDate, boolean deleteYn) {
        this.mailNum = mailNum;
        this.empCode = empCode;
        this.title = title;
        this.content = content;
        this.mailTarget = mailTarget;
        this.mailRef = mailRef;
        this.fileSize = fileSize;
        this.startDate = startDate;
        this.deleteYn = deleteYn;
    }
}
