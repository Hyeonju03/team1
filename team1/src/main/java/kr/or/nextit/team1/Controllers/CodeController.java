package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.Services.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<List<CodeDTO>> getDepCode(@RequestParam String comCode) {
        List<CodeDTO> departmentList = codeService.getDepCode(comCode);
        return ResponseEntity.ok(departmentList);
    }

    // 부서 트리 구조 가져오기
    @GetMapping("/departments/tree")
    public ResponseEntity<List<CodeDTO>> getDepartmentTree(@RequestParam String comCode) {
        List<CodeDTO> departmentTree = codeService.createDepartmentTree(comCode);
        return ResponseEntity.ok(departmentTree);
    }

    // 부서 추가
    @PutMapping("/departments/insert")
    public String insertDepartment(@RequestBody CodeDTO codeDTO) {
        codeService.insertDepartment(codeDTO);

        return "부서 코드가 성공적으로 업데이트되었습니다.";
    }

    // 부서 수정
    @PutMapping("/departments/update")
    public ResponseEntity<String> updateDepartmentName(@RequestBody Map<String, String> params) {
        String comCode = params.get("comCode");
        String oldDepCode = params.get("oldDepCode");
        String newDepCode = params.get("depCode");

        try {
            codeService.updateDepartmentName(comCode, oldDepCode, newDepCode);
            return ResponseEntity.ok("부서가 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("부서 이름 수정 중 오류가 발생했습니다.");
        }
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

    // 직급 조회
    @GetMapping("/positions")
    public ResponseEntity<CodeDTO> selectPosition(@RequestParam String comCode) {
        CodeDTO positionList = codeService.selectPosition(comCode);
        return ResponseEntity.ok(positionList);
    }

    // 직급 추가
    @PutMapping("/positions/insert")
    public String insertPosition(@RequestBody CodeDTO codeDTO) {
        codeService.insertPosition(codeDTO);
        return "직급이 추가 되었습니다.";
    }

    // 직급 순서 변경
    @PutMapping("/positions/updateOrder")
    public ResponseEntity<String> updatePositionOrder(@RequestBody Map<String, String> params) {
        String comCode = params.get("comCode");
        String posCode = params.get("posCode");

        codeService.updatePositionOrder(comCode, posCode);

        return ResponseEntity.ok("직급 순서 변경 성공");
    }
}
