package kr.or.nextit.team1.DTOs;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class UpdateDepCodeDto {
    private String newDepCode;
    private String oldDepCode;
    private String comCode;
}
