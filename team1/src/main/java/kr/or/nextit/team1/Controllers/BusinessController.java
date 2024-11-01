package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.BusinessDTO;
import kr.or.nextit.team1.Services.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
public class BusinessController {

    private static final Logger logger = LoggerFactory.getLogger(BusinessController.class);
    // 오류 발생시 구체적인 로그 메세지 보기

    @Autowired
    private BusinessService businessService;

    @GetMapping("/api/apply")
    public ResponseEntity<List<BusinessDTO>> getAllBusinesses() {   // GET BusinessDTO
        List<BusinessDTO> businesses = businessService.getAllBusinesses(); // List로 반환
        return ResponseEntity.ok(businesses);
    }

    @GetMapping("/api/apply/{comCode}") // 사업자 번호
    public ResponseEntity<BusinessDTO> getBusinessByComCode(@PathVariable String comCode) {

        BusinessDTO business = businessService.getBusinessByComCode(comCode);
        // 특정 사업자 번호에 해당하는 정보 가져오기

        if (business != null) { // 해당 사업자 번호 DB에 존재 여부 확인
            return ResponseEntity.ok(business);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/apply")
    public ResponseEntity<String> createBusiness(@RequestBody BusinessDTO businessDTO) { // Post BusinessDTO

        // 새로운 사업자 등록
        try {
            businessService.createBusiness(businessDTO);
            logger.info("사용 등록 신청 완료: {}", businessDTO.getComCode());
            return ResponseEntity.ok("사용 등록 신청이 완료되었습니다.");
        } catch (RuntimeException  e) {
            logger.error("사용 등록 신청 중 오류 발생: {}", businessDTO.getComCode(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("신청 중 오류가 발생했습니다." + e.getMessage());
        }
    }

//        @PutMapping("/api/apply/{comCode}")
//    public ResponseEntity<BusinessDTO> updateBusiness(@PathVariable String comCode, @RequestBody BusinessDTO businessDTO) {
//        businessDTO.setComCode(comCode);
//        BusinessDTO updatedBusiness = businessService.updateBusiness(businessDTO);
//        if (updatedBusiness != null) {
//            return ResponseEntity.ok(updatedBusiness);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @DeleteMapping("/api/apply/{comCode}")
//    public ResponseEntity<Void> deleteBusiness(@PathVariable String comCode) {
//        boolean deleted = businessService.deleteBusiness(comCode);
//        if (deleted) {
//            return ResponseEntity.noContent().build();
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
}
