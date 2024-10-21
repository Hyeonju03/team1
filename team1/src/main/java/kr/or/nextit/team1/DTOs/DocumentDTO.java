package kr.or.nextit.team1.DTOs;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class DocumentDTO {
    private String empCode;
    private int docNum;
    private String docCateCode;
    private String title;
    private String content;
    private String fileName;
    private String fileOriginName;
    private Long fileSize;
    private String filePath;
    private LocalDateTime startDate;

}
