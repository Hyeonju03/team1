package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.mappers.CodeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {

    @Autowired
    private CodeMapper codeMapper;


}
