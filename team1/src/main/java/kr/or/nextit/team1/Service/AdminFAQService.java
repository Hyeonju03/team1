package kr.or.nextit.team1.Service;

import kr.or.nextit.team1.DTO.AdminFAQDTO;
import org.springframework.beans.factory.annotation.Autowired;
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
