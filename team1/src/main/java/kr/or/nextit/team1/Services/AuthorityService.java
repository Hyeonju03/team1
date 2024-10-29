package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.AuthorityDTO;
import kr.or.nextit.team1.mappers.AuthorityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class    AuthorityService {
    private static AuthorityMapper authorityMapper;

    @Autowired
    public AuthorityService(AuthorityMapper authorityMapper) {
        this.authorityMapper = authorityMapper;
    }

    public void insertAuth(AuthorityDTO authorityDTO) {
        try {
            authorityMapper.insertAuth(authorityDTO);
        } catch (Exception e) {
            e.printStackTrace();
            throw  e;
        }
    }

    public void updateAuth(AuthorityDTO authorityDTO) {
        authorityMapper.updateAuth(authorityDTO);
    }
}
