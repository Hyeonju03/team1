package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.ScheduleDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ScheduleMapper {
    List<ScheduleDTO> selectSchedules();
//    ScheduleDTO selectSchedule(int id);
//    int registerSchedule(ScheduleDTO board);
//    int modifySchedule(ScheduleDTO board);
//    int removeSchedule(int id);
}
