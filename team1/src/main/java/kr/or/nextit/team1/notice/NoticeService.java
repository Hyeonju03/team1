package kr.or.nextit.team1.notice;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service // 이 클래스가 Spring의 서비스 계층의 구성 요소임을 나타내는 어노테이션
public class NoticeService {
    private List<NoticeDTO> notices; // 공지사항을 저장할 리스트
    private long nextId = 1; // 다음 공지사항 ID를 위한 변수

    // 생성자: NoticeService 인스턴스가 생성될 때 호출됨
    public NoticeService() {
        notices = new ArrayList<>(); // notices 리스트 초기화

        // 임시 데이터 추가
        for (int i = 1; i <= 10; i++) {
            NoticeDTO notice = new NoticeDTO(); // 새로운 NoticeDTO 객체 생성
            notice.setId((long) i); // ID 설정
            notice.setTitle("공지사항 " + i); // 제목 설정
            notice.setContent("공지사항 " + i + "의 내용입니다."); // 내용 설정
            notice.setCreatedAt(new Date()); // 생성 날짜 설정
            notice.setUpdatedAt(new Date()); // 수정 날짜 설정
            notices.add(notice); // 리스트에 공지사항 추가
        }
        nextId = 11; // 다음 ID 설정 (11부터 시작)
    }

    // 모든 공지사항을 반환하는 메서드
    public List<NoticeDTO> getAllNotices() {
        return new ArrayList<>(notices); // notices 리스트의 복사본 반환
    }

    // ID로 공지사항을 가져오는 메서드
    public NoticeDTO getNoticeById(Long id) {
        return notices.stream() // notices 리스트를 스트림으로 변환
                .filter(notice -> notice.getId().equals(id)) // ID가 일치하는 공지사항 필터링
                .findFirst() // 첫 번째 요소를 찾음
                .orElse(null); // 없으면 null 반환
    }

    // 새로운 공지사항을 생성하는 메서드
    public NoticeDTO createNotice(NoticeDTO noticeDTO) {
        noticeDTO.setId(nextId++); // ID를 설정하고 다음 ID로 증가
        noticeDTO.setCreatedAt(new Date()); // 현재 날짜를 생성 날짜로 설정
        noticeDTO.setUpdatedAt(new Date()); // 현재 날짜를 수정 날짜로 설정
        notices.add(noticeDTO); // 리스트에 새로운 공지사항 추가
        return noticeDTO; // 생성된 공지사항 반환
    }

    // 공지사항을 업데이트하는 메서드
    public NoticeDTO updateNotice(Long id, NoticeDTO noticeDTO) {
        for (int i = 0; i < notices.size(); i++) { // notices 리스트를 순회
            if (notices.get(i).getId().equals(id)) { // ID가 일치하는 공지사항 찾기
                noticeDTO.setId(id); // ID 설정
                noticeDTO.setCreatedAt(notices.get(i).getCreatedAt()); // 기존 생성 날짜 유지
                noticeDTO.setUpdatedAt(new Date()); // 현재 날짜를 수정 날짜로 설정
                notices.set(i, noticeDTO); // 리스트의 해당 인덱스에 업데이트된 공지사항 설정
                return noticeDTO; // 업데이트된 공지사항 반환
            }
        }
        return null; // ID가 일치하는 공지사항이 없으면 null 반환
    }

    // 공지사항을 삭제하는 메서드
    public boolean deleteNotice(Long id) {
        return notices.removeIf(notice -> notice.getId().equals(id)); // ID가 일치하는 공지사항을 리스트에서 제거하고, 성공 여부 반환
    }
}
