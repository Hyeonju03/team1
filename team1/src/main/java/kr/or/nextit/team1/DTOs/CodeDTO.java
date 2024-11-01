package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeDTO {
    private String comCode;
    private String depCode;
    private String updepCode;
    private String posCode;
    private String docCateCode;
    private String signCateCode;

    private List<CodeDTO> children; // 하위 부서 리스트
}
