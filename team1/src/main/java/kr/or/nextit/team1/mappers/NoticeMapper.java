package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.notice.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;


import java.util.List;
import java.util.Map;


@Mapper
public interface NoticeMapper {
    List<NoticeDTO> noticeList();
    NoticeDTO noticeDetail(int noticeNum);
    void noticeCreate(NoticeDTO noticeDTO);
    void noticeUpdate(NoticeDTO noticeDTO);
    int noticeDelete(int noticeNum);


    List<Map<String, Object>> getAdminAndEmployeeInfo(String adminId);

    // 관리자 유효성 검사 메소드
    int validateAdmin(String adminId); // adminId가 존재하면 1, 없으면 0 반환

    int validateUser(String empCode);
}
