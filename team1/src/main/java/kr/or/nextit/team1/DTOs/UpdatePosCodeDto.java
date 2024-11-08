package kr.or.nextit.team1.DTOs;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class UpdatePosCodeDto {
    private String newPosCode;
    private String oldPosCode;
    private String comCode;
}
