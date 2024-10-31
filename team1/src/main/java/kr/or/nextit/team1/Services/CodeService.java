package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.mappers.CodeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CodeService {
    @Autowired
    private CodeMapper codeMapper;
    public List<CodeDTO> selectCategories(String comCode) 
        return codeMapper.selectCategories(comCode);

    }
}
