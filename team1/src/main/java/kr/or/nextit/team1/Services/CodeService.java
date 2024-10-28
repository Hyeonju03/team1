package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.mappers.CodeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CodeService {
    @Autowired
    private CodeMapper codeMapper;

    public CodeDTO selectCategories(String comCode) {
        return codeMapper.selectCategory(comCode, null);
    }

    // 모든 부서 가져오기
    public List<CodeDTO> getDepCode() {
        return codeMapper.getDepCode();
    }

    // 부서 추가
    public void insertDepartment(CodeDTO newDepartment) {
        codeMapper.insertDepartment(newDepartment);
    }

    // depCode와 updepCode 업데이트
    public void updateDepartment(CodeDTO codeDTO) {
        // 입력된 부서 코드 로그 출력
        // 기존 depCode와 updepCode를 조회
        CodeDTO existingCodes = codeMapper.selectCategory(codeDTO.getComCode(), null);

        if (existingCodes != null) {

            // 새로운 depCode와 updepCode 값 추가
            String updatedDepCode = (existingCodes.getDepCode() != null ? existingCodes.getDepCode() + "," : "") + codeDTO.getDepCode();
            String updatedUpdepCode = (existingCodes.getUpdepCode() != null ? existingCodes.getUpdepCode() + "," : "") + codeDTO.getUpdepCode();

            // 업데이트 할 DTO 설정
            CodeDTO updatedCodeDTO = new CodeDTO();
            updatedCodeDTO.setDepCode(updatedDepCode);
            updatedCodeDTO.setUpdepCode(updatedUpdepCode);

            codeMapper.updateDepartment(updatedCodeDTO);


        } else {
            throw new RuntimeException("부서 코드가 존재하지 않습니다: " + codeDTO.getDepCode());
        }

    }


    // 부서 삭제
    public boolean deleteDepartment(String depCode) {
        System.out.println("삭제 요청 부서 코드: " + depCode);

        // 기존 depCode를 조회
        CodeDTO existingCodes = codeMapper.selectCategory(null, depCode);


        if (existingCodes != null) {
            System.out.println("조회된 부서 코드: " + existingCodes.getDepCode());
            String currentDepCode = existingCodes.getDepCode();

            // 부서 코드 삭제
            String updatedDepCodes = Arrays.stream(currentDepCode.split(","))
                    .filter(code -> !code.trim().equals(depCode.trim())) // 삭제할 코드가 아닌 것만 필터링
                    .collect(Collectors.joining(",")); // 필터링된 코드를 다시 쉼표로 조합

            if (updatedDepCodes.isEmpty()) {
                System.out.println("모든 부서 코드가 삭제되었습니다.");
            } else {
                existingCodes.setDepCode(updatedDepCodes);
                codeMapper.updateDepartment(existingCodes);
                System.out.println("업데이트된 부서 코드: " + updatedDepCodes);
            }
            return true;
        }

        System.out.println("부서 코드가 존재하지 않습니다.");
        return false;
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
