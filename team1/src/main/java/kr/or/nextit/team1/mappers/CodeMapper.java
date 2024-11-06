package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.DTOs.UpdateDepCodeDto;
import kr.or.nextit.team1.DTOs.UpdatePosCodeDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CodeMapper {
    CodeDTO selectCode(String comCode, String depCode); // 모든 카테고리 가져오기

    // 부서 권한
    String getAuthoritydepartmentManagementByEmpCode(String empCode);

    List<CodeDTO> getDepCode(String comCode);

//    void insertDepartment(CodeDTO newDepartment);

    // 부서 추가, 수정, 삭제 모두 사용
    void updateDepartment(CodeDTO codeDTO);

    // 직급 권한
    String getAuthoritypositionManagementByEmpCode(String empCode);

    CodeDTO selectPosition(String comCode);

    // 직급 추가, 수정, 삭제 모두 사용
    void updatePosition(CodeDTO codeDTO);

    // 회사명 불러오기
    String selectCompanyName(String comCode);

    List<CodeDTO> selectCategories(String comCode); // 모든 카테고리 가져오기

    // 부서 수정될 때, employee의 depCode도 수정
    void updateEmployeeDepCode(UpdateDepCodeDto updateDepCodeDto);

    // 부서 사용중이면 삭제 못하게
    int countEmployeesByDepCode(String comCode, String depCode);

    // 직급 수정될 때, employee의 posCode도 수정
    void updateEmployeePosCode(UpdatePosCodeDto updatePosCodeDto);

    // 직급 사용중이면 삭제 못하게
    int countEmployeesByPosCode(String comCode, String posCode);
}
