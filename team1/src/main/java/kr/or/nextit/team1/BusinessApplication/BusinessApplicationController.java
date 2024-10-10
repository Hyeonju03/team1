package kr.or.nextit.team1.BusinessApplication;

import kr.or.nextit.team1.model.BusinessApplication;
import kr.or.nextit.team1.service.BusinessApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business-applications")
public class BusinessApplicationController {

    private final BusinessApplicationService businessApplicationService;

    @Autowired
    public BusinessApplicationController(BusinessApplicationService businessApplicationService) {
        this.businessApplicationService = businessApplicationService;
    }

    @PostMapping
    public ResponseEntity<BusinessApplication> createBusinessApplication(@RequestBody BusinessApplication application) {
        return ResponseEntity.ok(businessApplicationService.createBusinessApplication(application));
    }

    @GetMapping("/verify/{businessNumber}")
    public ResponseEntity<BusinessApplication> verifyBusinessNumber(@PathVariable String businessNumber) {
        return ResponseEntity.ok(businessApplicationService.verifyBusinessNumber(businessNumber));
    }
}