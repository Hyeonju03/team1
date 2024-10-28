package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CodeMapper {
    CodeDTO selectCategory(String comCode, String depCode); // 모든 카테고리 가져오기

    List<CodeDTO> getDepCode();

    void insertDepartment(CodeDTO newDepartment);

    void updateDepartment(CodeDTO codeDTO);

    void deleteDepartment(String depCode);
}
