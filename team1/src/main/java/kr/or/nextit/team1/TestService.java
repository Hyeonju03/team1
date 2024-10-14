package kr.or.nextit.team1;

import kr.or.nextit.team1.mappers.MainMapper;
import org.springframework.stereotype.Service;

@Service
public class TestService {
    private final MainMapper mainMapper;

    public TestService(MainMapper mainMapper) {
        this.mainMapper = mainMapper;
    }

    public String test(){
        return mainMapper.selectTest();
    }


}
