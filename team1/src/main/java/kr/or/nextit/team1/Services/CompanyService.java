package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.DTOs.CompanyDTO;
import kr.or.nextit.team1.mappers.CodeMapper;
import kr.or.nextit.team1.mappers.CompanyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyService {
    private final CompanyMapper companyMapper;
    private final CodeMapper codeMapper;

    @Autowired
    public CompanyService(CompanyMapper companyMapper, CodeMapper codeMapper) {
        this.companyMapper = companyMapper;
        this.codeMapper = codeMapper;
    }

    @Transactional
    public void insertCompany(CompanyDTO companyDTO) {
        companyMapper.insertCompany(companyDTO);

        CodeDTO code = new CodeDTO();
        code.setComCode(companyDTO.getComCode());
        code.setDepCode(companyDTO.getComName());

        companyMapper.insertCodeByDepCode(code);
    }

    public List<CompanyDTO> selectComList(String comCode) {
        return companyMapper.selectComList(comCode);
    }

    public int selectAllEmpNum(String comCode) {
        return companyMapper.selectAllEmpNum(comCode);
    }

    public void updateInfo(CompanyDTO companyDTO) {
        companyMapper.updateInfo(companyDTO);
    }

    public void updateStatus(String comCode) {
        companyMapper.updateStatus(comCode);
    }

    public int selectStatus(String comCode) {
        return companyMapper.selectStatus(comCode);
    }
}
