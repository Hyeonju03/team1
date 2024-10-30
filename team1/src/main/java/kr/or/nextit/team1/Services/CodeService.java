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
    public List<CodeDTO> getDepCode(String comCode) {
        return codeMapper.getDepCode(comCode);
    }

    // 부서 추가
    public void insertDepartment(CodeDTO codeDTO) {
        // 기존 depCode와 updepCode를 조회
        CodeDTO existingCodes = codeMapper.selectCode(codeDTO.getComCode(), null);

        if (existingCodes != null) {

            // 새로운 depCode와 updepCode 값 추가
            String updatedDepCode = (existingCodes.getDepCode() != null ? existingCodes.getDepCode() + "," : "") + codeDTO.getDepCode();
            String updatedUpdepCode = (existingCodes.getUpdepCode() != null ? existingCodes.getUpdepCode() + "," : "") + codeDTO.getUpdepCode();

            // 업데이트 할 DTO 설정
            //CodeDTO updatedCodeDTO = new CodeDTO();
            codeDTO.setDepCode(updatedDepCode);
            codeDTO.setUpdepCode(updatedUpdepCode);

            codeMapper.updateDepartment(codeDTO);


        } else {
            throw new RuntimeException("부서 코드가 존재하지 않습니다: " + codeDTO.getDepCode());
        }

    }

    // 부서 이름 수정
    public void updateDepartmentName(String comCode, String oldDepCode, String newDepCode) {
        CodeDTO code = codeMapper.selectCode(comCode, oldDepCode);

        List<String> updepCodeList = new ArrayList<>();
        updepCodeList.addAll(Arrays.asList(code.getUpdepCode().split(",")));

        List<String> depCodeList = new ArrayList<>();
        depCodeList.addAll(Arrays.asList(code.getDepCode().split(",")));

        // depCodeList에서 oldDepCode의 인덱스를 찾고 해당 위치에 newDepCode로 교체
        int foundIndex = depCodeList.indexOf(oldDepCode);
        if (foundIndex != -1) {
            depCodeList.set(foundIndex, newDepCode);
        }

        // 기존의 depCode를 참고하는 updepCode 값을 찾아 업데이트
        while (updepCodeList.lastIndexOf(oldDepCode) != -1) {
            int foundLastIndex = updepCodeList.lastIndexOf(oldDepCode);
            updepCodeList.set(foundLastIndex, newDepCode);
        }

        // CodeDTO에 @Builder 만들어야지 사용 가능
        CodeDTO codeDto = CodeDTO.builder().comCode(comCode)
                .depCode(String.join(",", depCodeList)) // depCodeList를 ,로 이어 붙임
                .updepCode(String.join(",", updepCodeList)) // updepCodeList를 ,로 이어 붙임
                .build();

        codeMapper.updateDepartment(codeDto);
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
    public List<CodeDTO> createDepartmentTree(String comCode) {
        // 모든 부서 코드와 상위 부서 코드를 가져오는 로직
        List<CodeDTO> allDepartments = codeMapper.getDepCode(comCode);

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

    // 모든 부서 가져오기
    public CodeDTO selectPosition(String comCode) {
        CodeDTO code = codeMapper.selectPosition(comCode);

        if (code != null && code.getPosCode() != null) {
            String[] positionNames = code.getPosCode().split(","); // 쉼표로 분리
            CodeDTO codeDTO = new CodeDTO();
            codeDTO.setPosCode(String.join(",", positionNames)); // 다시 문자열로 조합하여 설정
            return codeDTO;
        }
        return null;
    }

    // 직급 추가
    public void insertPosition(CodeDTO codeDTO) {
        CodeDTO currentPosition = codeMapper.selectCode(codeDTO.getComCode(), null);
        if (currentPosition != null) {
            // 새로운 값 추가
            String updatedPosCode = (currentPosition.getPosCode() != null ? currentPosition.getPosCode() + "," : "") + codeDTO.getPosCode();
            codeDTO.setPosCode(updatedPosCode);
            codeMapper.updatePosition(codeDTO);
        } else {
            throw new RuntimeException("직급 코드가 존재하지 않습니다: " + codeDTO.getPosCode());
        }
    }

    // 직급 순서 변경
    public void updatePositionOrder(String comCode, String posCode) {
        codeMapper.updatePositionOrder(comCode, posCode);
    }
}
