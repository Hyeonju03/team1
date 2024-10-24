package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.ListLibraryDTO;
import kr.or.nextit.team1.mappers.ListLibraryMapper;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
