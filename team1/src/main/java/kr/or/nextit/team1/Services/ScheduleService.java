package kr.or.nextit.team1.Services;

import java.util.List;

import kr.or.nextit.team1.DTOs.ScheduleDTO;
import kr.or.nextit.team1.mappers.ScheduleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleMapper scheduleMapper;


    @Transactional
    public List<ScheduleDTO> selectSchedules(String empCode) {
        return scheduleMapper.selectSchedules(empCode);
    }

    @Transactional
    public void scheduleInsert(ScheduleDTO scheduleDTO) {
        try {
            scheduleMapper.scheduleInsert(scheduleDTO);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void updateSchedule(ScheduleDTO scheduleDTO) {
        scheduleMapper.updateSchedule(scheduleDTO);
    }

    @Transactional
    public void deleteSchedule(String sNum) {
        scheduleMapper.deleteSchedule(sNum);
    }


    public String selectAuth(String empCode) {
        return scheduleMapper.selectAuth(empCode);
    }

    public List<ScheduleDTO> selectDepSchedule(String empCode) {
        return scheduleMapper.selectDepSchedule(empCode);
    }

    public List<ScheduleDTO> selectFullSchedule(String empCode) {
        return scheduleMapper.selectFullSchedule(empCode);
    }


}
