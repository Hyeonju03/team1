package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.BusinessDTO;
import kr.or.nextit.team1.mappers.BusinessMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessService {

    @Autowired
    private BusinessMapper businessMapper;

    public List<BusinessDTO> getAllBusinesses() { // 사업자 정보 반환
        return businessMapper.getAllBusinesses();
    }

    public BusinessDTO getBusinessByComCode(String comCode) { // 특정 사업자 번호에 해당하는 DB 호출
        return businessMapper.getBusinessByComCode(comCode);
    }

    public BusinessDTO createBusiness(BusinessDTO businessDTO) { // 새로운 사업자 정보 DB에 추가
        businessMapper.createBusiness(businessDTO);
        return businessDTO;
    }
//    public BusinessDTO updateBusiness(BusinessDTO businessDTO) {
//        int updatedRows = businessMapper.updateBusiness(businessDTO);
//        if (updatedRows > 0) {
//            return businessDTO;
//        }
//        return null;
//    }
//
//    public boolean deleteBusiness(String comCode) {
//        int deletedRows = businessMapper.deleteBusiness(comCode);
//        return deletedRows > 0;
//    }
}