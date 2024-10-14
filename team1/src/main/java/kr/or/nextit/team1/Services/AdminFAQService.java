package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.AdminFAQDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminFAQService {

    private final List<AdminFAQDTO> faqs = new ArrayList<>();

    public List<AdminFAQDTO> getAllFAQs() {
        return faqs; // 현재는 메모리 내의 리스트를 반환
    }

    public void addFAQ(AdminFAQDTO faq) {
        faqs.add(faq);
    }

}
