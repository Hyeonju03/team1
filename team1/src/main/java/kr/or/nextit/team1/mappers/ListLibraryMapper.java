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
}
