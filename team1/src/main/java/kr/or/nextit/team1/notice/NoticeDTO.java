package kr.or.nextit.team1.notice;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDTO {

    private String empCode;
    private int noticeNum;
    private String title;
    private String content;
    private String target;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
