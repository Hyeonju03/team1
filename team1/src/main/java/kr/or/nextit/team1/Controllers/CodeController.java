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
    public ResponseEntity<String> insertDepartment(@RequestBody CodeDTO codeDTO, String updepCode) {
        try {
            // updepCode가 없으면 최상위 부서로 생각
            codeService.insertDepartment(codeDTO, updepCode != null ? updepCode : "");
            return ResponseEntity.ok("부서가 성공적으로 추가 되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("부서 추가 중 오류가 발생했습니다.");
        }
    }

    // depCode와 updepCode 업데이트
    @PutMapping("/departments/update")
    public String updateDepartment(@RequestBody CodeDTO codeDTO) {
        codeService.updateDepartment(codeDTO);
        return "부서 코드가 성공적으로 업데이트되었습니다.";
    }
    
    // 부서 삭제
    @DeleteMapping("/departments/delete/{comCode}/{depCode}")
    public ResponseEntity<String> deleteDepartment(@PathVariable String comCode, @PathVariable String depCode) {
        try {
            codeService.deleteDepartment(comCode, depCode);
            return ResponseEntity.ok("부서가 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("부서 삭제 중 오류가 발생했습니다.");
        }
    }
}
