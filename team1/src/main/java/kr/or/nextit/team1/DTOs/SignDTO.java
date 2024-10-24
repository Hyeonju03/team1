package kr.or.nextit.team1.DTOs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SignDTO {
    private String empCode;
    private int signNum;
    private String signCateCode;
    private String title;
    private String content;
    private String fileName;
    private String fileOriginalName;
    private float fileSize;
    private String filePath;
    private String target;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
