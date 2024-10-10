package kr.or.nextit.team1.BusinessApplication;

import com.example.demo.model.ApplyForBusiness;
import com.example.demo.service.ApplyForBusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business-applications")
public class BusinessApplication {
    @Autowired
    private ApplyForBusinessService ApplyForBusinessService;

    @PostMapping
    public ResponseEntity<BusinessApplication> createApplyForBusiness(@RequestBody BusinessApplication application) {
        return ResponseEntity.ok(ApplyForBusinessService.createApplyForBusiness(application));
    }

    @GetMapping("/verify/{businessNumber}")
    public ResponseEntity<BusinessApplication> verifyBusinessNumber(@PathVariable String businessNumber) {
        return ResponseEntity.ok(ApplyForBusinessService.verifyBusinessNumber(businessNumber));
    }
}
