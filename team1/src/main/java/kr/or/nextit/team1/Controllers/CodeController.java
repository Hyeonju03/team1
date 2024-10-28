package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.Services.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CodeController {

    @Autowired
    private CodeService codeService;

    @GetMapping("/code/{comCode}")
    public CodeDTO selectCategories(@PathVariable String comCode) {
        return codeService.selectCategories(comCode); // 모든 카테고리 반환

    }

    // 부서 조회
    @GetMapping("/departments")
    public ResponseEntity<List<CodeDTO>> getDepCode() {
        List<CodeDTO> departmentList = codeService.getDepCode();
        return ResponseEntity.ok(departmentList);
    }

    // 부서 트리 구조 가져오기
    @GetMapping("/departments/tree")
    public ResponseEntity<List<CodeDTO>> getDepartmentTree() {
        List<CodeDTO> departmentTree = codeService.createDepartmentTree();
        return ResponseEntity.ok(departmentTree);
    }

    // 부서 추가
    @PostMapping("/departments/insert")
    public ResponseEntity<String> insertDepartment(@RequestBody CodeDTO newDepartment) {
        codeService.insertDepartment(newDepartment);
        return ResponseEntity.ok("부서 추가 성공");
    }

    // depCode와 updepCode 업데이트
    @PutMapping("/departments/update")
    public String updateDepartment(@RequestBody CodeDTO codeDTO) {
        codeService.updateDepartment(codeDTO);
        return "부서 코드가 성공적으로 업데이트되었습니다.";
    }


    // 부서 삭제
    @DeleteMapping("/departments/delete/{depCode}")
    public ResponseEntity<String> deleteDepartment(@PathVariable String depCode) {
        System.out.println("depCode 값 : " + depCode);
        try {
            boolean result = codeService.deleteDepartment(depCode);
            if (result) {
                return ResponseEntity.ok("부서가 성공적으로 삭제되었습니다.");
            } else {
                return ResponseEntity.status(404).body("부서 코드가 존재하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("서버 오류:" + e.getMessage());
        }
    }
}
