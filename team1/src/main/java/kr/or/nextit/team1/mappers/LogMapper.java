package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.LogDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogMapper {
    LogDTO selectLog();
    LogDTO selectIsLog(String comCode);
    void logInsert(LogDTO logDTO);
    void logUpdate(LogDTO logDTO);



}
