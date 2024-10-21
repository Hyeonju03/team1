package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.CompanyDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CompanyMapper {
    void insertCompany(CompanyDTO companyDTO);

}
