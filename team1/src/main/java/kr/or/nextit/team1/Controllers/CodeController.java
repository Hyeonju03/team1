package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.Services.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CodeController {

    @Autowired
    private CodeService codeService;

    @GetMapping("/code/{comCode}")
    public List<CodeDTO> selectCategories(@PathVariable String comCode) {
       return codeService.selectCategories(comCode); // 모든 카테고리 반환 
    }
    //public CodeDTO selectCategories(@PathVariable String comCode) {}
}
