package kr.or.nextit.team1.DTOs;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ListLibraryDTO {
    private String depCode;
    private String upDepCode;
    private String empCode;
    private String empName;
    private String empDepCode;
    private String mail;
    private String PH;
    private String state;
    private String title;
    private String content;
    private List<String> targets;
    private LocalDateTime endTime;
}
