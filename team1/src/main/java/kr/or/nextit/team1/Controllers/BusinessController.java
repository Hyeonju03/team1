package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.BusinessDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BusinessController {

    public BusinessDTO businessTest = new BusinessDTO("1234567890","테스트 기업","홍길동","010-1234-5678");

    @GetMapping("/verify")
    public ResponseEntity<BusinessDTO> verifyBusiness(@RequestParam String businessNumber) {
        if (businessNumber.equals(businessTest.getBusinessNumber())) {
            // BusinessTest에서 정보를 가져와서 새 DTO 생성
            BusinessDTO responseDTO = new BusinessDTO();
            responseDTO.setBusinessNumber(businessTest.getBusinessNumber());
            responseDTO.setCompanyName(businessTest.getCompanyName());
            responseDTO.setRepresentativeName(businessTest.getRepresentativeName());
            responseDTO.setRepresentativeContact(businessTest.getRepresentativeContact());
            return ResponseEntity.ok(responseDTO);
        }
        return ResponseEntity.ok(new BusinessDTO());
    }
}
