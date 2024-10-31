package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CodeMapper {
    CodeDTO selectCode(String comCode, String depCode); // 모든 카테고리 가져오기

    List<CodeDTO> getDepCode(String comCode);

    void insertDepartment(CodeDTO newDepartment);

    void updateDepartment(CodeDTO codeDTO);

    CodeDTO selectPosition(String comCode);

    // 추가, 수정, 삭제 모두 사용
    void updatePosition(CodeDTO codeDTO);

    // 회사명 불러오기
    String selectCompanyName(String comCode);


}
