package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.SignDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SignMapper {
    List<SignDTO> signSelect(@Param("empCode") String empCode);
    void signInsert(SignDTO signDTO);
    SignDTO signDetail(int id);
    int signUpdate(@Param("id") int id, @Param("target") String target);
    int signDelete(int id);
}
