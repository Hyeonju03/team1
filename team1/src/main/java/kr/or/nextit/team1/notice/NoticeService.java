package kr.or.nextit.team1.notice;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Service
public class NoticeService {
    private List<NoticeDTO> notices;
    private long nextId = 1;

    public NoticeService() {
        notices = new ArrayList<>();
        // 임시 데이터 추가
        for (int i = 1; i <= 10; i++) {
            NoticeDTO notice = new NoticeDTO();
            notice.setId((long) i);
            notice.setTitle("공지사항 " + i);
            notice.setContent("공지사항 " + i + "의 내용입니다.");
            notice.setCreatedAt(new Date());
            notice.setUpdatedAt(new Date());
            notices.add(notice);
        }
        nextId = 11;
    }

    public List<NoticeDTO> getAllNotices() {
        return new ArrayList<>(notices);
    }

    public NoticeDTO getNoticeById(Long id) {
        return notices.stream()
                .filter(notice -> notice.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public NoticeDTO createNotice(NoticeDTO noticeDTO) {
        noticeDTO.setId(nextId++);
        noticeDTO.setCreatedAt(new Date());
        noticeDTO.setUpdatedAt(new Date());
        notices.add(noticeDTO);
        return noticeDTO;
    }

    public NoticeDTO updateNotice(Long id, NoticeDTO noticeDTO) {
        for (int i = 0; i < notices.size(); i++) {
            if (notices.get(i).getId().equals(id)) {
                noticeDTO.setId(id);
                noticeDTO.setCreatedAt(notices.get(i).getCreatedAt());
                noticeDTO.setUpdatedAt(new Date());
                notices.set(i, noticeDTO);
                return noticeDTO;
            }
        }
        return null;
    }

    public boolean deleteNotice(Long id) {
        return notices.removeIf(notice -> notice.getId().equals(id));
    }
}