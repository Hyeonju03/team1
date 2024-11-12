package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.LogDTO;
import kr.or.nextit.team1.mappers.LogMapper;
import org.springframework.stereotype.Service;

@Service
public class LogService {
    private final LogMapper logMapper;

    public LogService(LogMapper logMapper) {
        this.logMapper = logMapper;
    }

    public LogDTO selectLog() {
        return logMapper.selectLog();
    }
    public LogDTO selectIsLog(String comCode) {
        return logMapper.selectIsLog(comCode);
    }
    public void logInsert(LogDTO logDTO) {
        logMapper.logInsert(logDTO);
    }
    public void logUpdate(LogDTO logDTO) {
        logMapper.logUpdate(logDTO);
    }

}
