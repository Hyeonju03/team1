package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.DocumentDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import javax.swing.text.Document;
import java.util.List;

@Mapper
public interface DocumentMapper {
    List<DocumentDTO> documentSelect(@Param("comCode") String comCode);
    void documentInsert(DocumentDTO documentDTO);
}
