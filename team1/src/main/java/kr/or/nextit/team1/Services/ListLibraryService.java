package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.ListLibraryDTO;
import kr.or.nextit.team1.mappers.ListLibraryMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ListLibraryService {
    private  final ListLibraryMapper listLibraryMapper;

    public ListLibraryService(ListLibraryMapper listLibraryMapper) {this.listLibraryMapper = listLibraryMapper;}

    public List<ListLibraryDTO> chartSelect(String code){
        return listLibraryMapper.chartSelect(code);
    }

    public ListLibraryDTO RClickWindowSelect(String code){
        return listLibraryMapper.RClickWindowSelect(code);
    }

    public void noticeInsert(ListLibraryDTO dto){
        listLibraryMapper.noticeInsert(dto);
    }

    public List<ListLibraryDTO> noticeListSelect1(String code){
        return listLibraryMapper.noticeListSelect1(code);
    }
    public List<ListLibraryDTO> noticeListSelect2(String code){
        return listLibraryMapper.noticeListSelect2(code);
    }
    public List<ListLibraryDTO> loadNoticeSelect(String code){
        return listLibraryMapper.loadNoticeSelect(code);
    }
    public void noticeUpdate(Map<String, Object> data){
        listLibraryMapper.noticeUpdate(data);
    }

    public List<ListLibraryDTO> addressBookSelect(String code){return listLibraryMapper.addressBookSelect(code);}
    public List<ListLibraryDTO> addressBookListSelect(String code){return listLibraryMapper.addressBookListSelect(code);}
    public void addressBookAdd(Map<String, Object> data){
        listLibraryMapper.addressBookAdd(data);
    }
    public void addressBookDelete(Map<String, Object> data){
        listLibraryMapper.addressBookDelete(data);
    }

    public List<ListLibraryDTO> chatInSelect1(String chatNum){return listLibraryMapper.chatInSelect1(chatNum);}
    public List<ListLibraryDTO> chatInSelect2(String chatNum){return listLibraryMapper.chatInSelect2(chatNum);}
    public List<ListLibraryDTO> chatInSelect3(String chatNum){return listLibraryMapper.chatInSelect3(chatNum);}
    public List<ListLibraryDTO> chatInSelect4(String code){return listLibraryMapper.chatInSelect4(code);}

    public void chatInUpdate1(Map<String, Object> data){
        listLibraryMapper.chatInUpdate1(data);
    }
}