package kr.or.nextit.team1.notice;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDTO {

    private int noticeNum;
    private String title;
    private String content;
    private LocalDateTime startDate;


    // admininfo 테이블에서 가져올 컬럼
    private String adminId; // 관리자 ID


    // employ 테이블에서 가져올 컬럼
    private String empCode; // 직원 ID

}
