package kr.or.nextit.team1.BusinessApplication;

import com.example.demo.model.ApplyForBusiness;
import com.example.demo.repository.ApplyForBusinessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

@Service
public class BusinessApplicationRepository {

    @Autowired
    private ApplyForBusinessRepository ApplyForBusinessRepository;

    public ApplyForBusiness createBusinessApplication(ApplyForBusiness application) {
        // Add any necessary validation or business logic here
        return ApplyForBusinessRepository.save(application);
    }

    public ApplyForBusiness verifyBusinessNumber(String businessNumber) {
        // In a real-world scenario, this would involve checking against an official business registry
        // For this example, we'll just check if it exists in our database
        return ApplyForBusinessRepository.findByBusinessNumber(businessNumber)
                .orElseThrow(() -> new EntityNotFoundException("Business not found with number: " + businessNumber));
    }
}