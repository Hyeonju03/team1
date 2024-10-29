package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.mappers.CodeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CodeService {
    @Autowired
    private CodeMapper codeMapper;

    public CodeDTO selectCategories(String comCode) {
        return codeMapper.selectCode(comCode, null);
    }

    // 모든 부서 가져오기
    public List<CodeDTO> getDepCode() {
        return codeMapper.getDepCode();
    }

    // 부서 추가
    public void insertDepartment(CodeDTO codeDTO, String updepCode) {
        CodeDTO existingCodes = codeMapper.selectCode(codeDTO.getComCode(), null);

        String updatedDepCode;
        String updatedUpdepCode;

        if (existingCodes == null) {
            // 처음 추가하는 부서일 경우 depCode에만 추가
            updatedDepCode = codeDTO.getDepCode();
            updatedUpdepCode = "";
        } else {
            // 기존 depCode와 updepCode가 있을 때 새로운 값 이어붙임
            updatedDepCode = existingCodes.getDepCode() + "," + codeDTO.getDepCode();
            updatedUpdepCode = existingCodes.getUpdepCode() + "," + updepCode;
        }

        // 업데이트할 DTO 설정
        CodeDTO updatedCodeDTO = new CodeDTO();
        updatedCodeDTO.setDepCode(updatedDepCode);
        updatedCodeDTO.setUpdepCode(updatedUpdepCode);
        updatedCodeDTO.setComCode(codeDTO.getComCode());

        codeMapper.updateDepartment(updatedCodeDTO);
    }

    // depCode와 updepCode 업데이트
    public void updateDepartment(CodeDTO codeDTO) {
        // 기존 depCode와 updepCode를 조회
        CodeDTO existingCodes = codeMapper.selectCode(codeDTO.getComCode(), null);

        if (existingCodes != null && !codeDTO.getUpdepCode().isEmpty()) {

            // 새로운 depCode와 updepCode 값 추가
            String updatedDepCode = (existingCodes.getDepCode() != null ? existingCodes.getDepCode() + "," : "") + codeDTO.getDepCode();
            String updatedUpdepCode = (existingCodes.getUpdepCode() != null ? existingCodes.getUpdepCode() + "," : "") + codeDTO.getUpdepCode();

            // 업데이트 할 DTO 설정
            //CodeDTO updatedCodeDTO = new CodeDTO();
            existingCodes.setDepCode(updatedDepCode);
            existingCodes.setUpdepCode(updatedUpdepCode);

            codeMapper.updateDepartment(existingCodes);


        } else {
            //throw new RuntimeException("부서 코드가 존재하지 않습니다: " + codeDTO.getDepCode());

            System.out.println("최초의 부서임");
            existingCodes.setUpdepCode(",");
            existingCodes.setDepCode(codeDTO.getDepCode());
            codeMapper.updateDepartment(existingCodes);
        }
    }


    // 부서 삭제
    public void deleteDepartment(String comCode, String depCode) {
        // 모든 부서 정보 조회
        CodeDTO code = codeMapper.selectCode(comCode, depCode);

        List<String> updepCodeList = new ArrayList<>();
        updepCodeList.addAll(Arrays.asList(code.getUpdepCode().split(",")));

        List<String> depCodeList = new ArrayList<>();
        depCodeList.addAll(Arrays.asList(code.getDepCode().split(",")));

        int foundIndex = depCodeList.indexOf(depCode);
        updepCodeList.remove(foundIndex);
        depCodeList.remove(foundIndex);

        while (updepCodeList.lastIndexOf(depCode) != -1) {
            int foundLastIndex = updepCodeList.lastIndexOf(depCode);
            updepCodeList.remove(foundLastIndex);
            depCodeList.remove(foundLastIndex);
        }

        // CodeDTO에 @Builder 만들어야지 사용 가능
        CodeDTO codeDto = CodeDTO.builder().comCode(comCode)
                .depCode(String.join(",", depCodeList)) // depCodeList를 ,로 이어 붙임
                .updepCode(String.join(",", updepCodeList)) // updepCodeList를 ,로 이어 붙임
                .build();

        codeMapper.updateDepartment(codeDto);
    }

    // 부서 트리 생성
    public List<CodeDTO> createDepartmentTree() {
        // 모든 부서 코드와 상위 부서 코드를 가져오는 로직
        List<CodeDTO> allDepartments = codeMapper.getDepCode();

        // 부서 코드와 상위 부서 코드 분리
        String depCodes = String.join(",", allDepartments.stream().map(CodeDTO::getDepCode).toArray(String[]::new));
        String updepCodes = String.join(",", allDepartments.stream().map(CodeDTO::getUpdepCode).toArray(String[]::new));

        // 부서 트리 생성
        return buildDepartmentTree(depCodes, updepCodes);
    }

    // 부서 트리 구축 메서드
    private List<CodeDTO> buildDepartmentTree(String depCodes, String updepCodes) {
        // 부서 코드와 상위 부서 코드를 쉼표로 나누기
        String[] depArray = depCodes.split(",");
        String[] updepArray = updepCodes.split(",");

        // CodeDTO 객체를 담을 리스트
        List<CodeDTO> departments = new ArrayList<>();

        // 부서 객체 생성 및 리스트에 추가
        for (int i = 0; i < depArray.length; i++) {
            CodeDTO department = new CodeDTO();
            department.setDepCode(depArray[i].trim()); // 부서 코드
            department.setUpdepCode(i < updepArray.length ? updepArray[i].trim() : ""); // 상위 부서 코드
            department.setChildren(new ArrayList<>()); // 하위 부서 리스트 초기화
            departments.add(department);
        }

        // Map으로 변환하여 상위 부서와 하위 부서 관계 설정
        Map<String, CodeDTO> map = new HashMap<>();
        for (CodeDTO department : departments) {
            map.put(department.getDepCode(), department);
        }

        List<CodeDTO> tree = new ArrayList<>();
        for (CodeDTO department : departments) {
            if (department.getUpdepCode().isEmpty()) {
                tree.add(department); // 상위 부서인 경우 최상위 리스트에 추가
            } else {
                CodeDTO parent = map.get(department.getUpdepCode());
                if (parent != null) {
                    parent.getChildren().add(department); // 하위 부서 추가
                }
            }
        }
        return tree;
    }


}
