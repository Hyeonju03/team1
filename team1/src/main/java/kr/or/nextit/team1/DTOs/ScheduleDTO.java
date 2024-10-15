package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {
    private String empCode;
    private int id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String content;
    private String category;
}
