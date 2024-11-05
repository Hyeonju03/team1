package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

//EMP_CODE,TITLE,CONTENT,START_DATE,Q_STATUS FROM adminqtest

@Data
@AllArgsConstructor
public class AdminQDetailDTO {
    private String empCode;
    private String title;
    private String content;
    private LocalDateTime startDate;
    private Boolean QStatus;
    private int QNum;
    private String ansTitle;
    private String ansContent;

    public AdminQDetailDTO() {

    }


}
