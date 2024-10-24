package kr.or.nextit.team1.DTOs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleDTO {
    private String empCode;
    private int id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String content;
    private String category;
}
