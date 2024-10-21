package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.MailDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MailMapper {
    int insertMail(MailDTO mailDTO);

    List<MailDTO> selectSendMail(String empCode);

}
