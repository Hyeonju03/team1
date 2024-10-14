package kr.or.nextit.team1.BusinessApplication;

import kr.or.nextit.team1.model.BusinessApplication;
import kr.or.nextit.team1.repository.BusinessApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

@Service
public class BusinessApplicationService {

    private final BusinessApplicationRepository businessApplicationRepository;

    @Autowired
    public BusinessApplicationService(BusinessApplicationRepository businessApplicationRepository) {
        this.businessApplicationRepository = businessApplicationRepository;
    }

    public BusinessApplication createBusinessApplication(BusinessApplication application) {
        return businessApplicationRepository.save(application);
    }

    public BusinessApplication verifyBusinessNumber(String businessNumber) {
        return businessApplicationRepository.findByBusinessNumber(businessNumber)
                .orElseThrow(() -> new EntityNotFoundException("Business not found with number: " + businessNumber));
    }
}