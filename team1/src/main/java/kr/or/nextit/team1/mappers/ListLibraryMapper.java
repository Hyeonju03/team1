package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.ListLibraryDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface ListLibraryMapper {
    List<ListLibraryDTO> chartSelect(String code);
    ListLibraryDTO RClickWindowSelect(String code);
    void noticeInsert(ListLibraryDTO dto);
    List<ListLibraryDTO> noticeListSelect1(String code);
    List<ListLibraryDTO> noticeListSelect2(String code);
    List<ListLibraryDTO> loadNoticeSelect(String code);
    void noticeUpdate(Map<String, Object> data);
    List<ListLibraryDTO> addressBookSelect(String code);
    List<ListLibraryDTO> addressBookListSelect(String code);
    void addressBookAdd(Map<String, Object> data);
    void addressBookDelete(Map<String, Object> data);
    List<ListLibraryDTO> chatInSelect1(String chatNum);
    List<ListLibraryDTO> chatInSelect2(String chatNum);
    List<ListLibraryDTO> chatInSelect3(String chatNum);
    void chatInUpdate1(Map<String, Object> data);
    List<ListLibraryDTO> chatInSelect4(String code);
    void chatAdd1(Map<String, Object> data);
    void chatAdd2(Map<String, Object> data);
    List<ListLibraryDTO> myChatList(String code);
    String empCodeCheck(String code);
    List<ListLibraryDTO> empCodeCheck2(String code);
    void chatOut(Map<String, Object> data);
}