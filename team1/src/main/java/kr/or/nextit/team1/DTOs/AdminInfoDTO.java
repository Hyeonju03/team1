package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminInfoDTO {
    private String adminId;
    private String adminPw;
    private String adminEmail;
}
