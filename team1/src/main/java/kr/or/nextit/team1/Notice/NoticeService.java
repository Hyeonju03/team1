package kr.or.nextit.team1.repository;

import kr.or.nextit.team1.model.BusinessApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessApplicationRepository extends JpaRepository<BusinessApplication, Long> {
    Optional<BusinessApplication> findByBusinessNumber(String businessNumber);
}