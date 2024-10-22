package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.SignDTO;
import kr.or.nextit.team1.mappers.SignMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class SignService {

    @Autowired
    private SignMapper mapper;

    public SignService(SignMapper mapper) {
        this.mapper = mapper;
    }

    public List<SignDTO> signSelect(String empCode) {
        return mapper.signSelect(empCode);
    }

    @Transactional
    public void signInsert(String empCode, String title, String category, String content, String target, MultipartFile attachment) {
        SignDTO sign = new SignDTO();
        sign.setEmpCode(empCode);
        sign.setTitle(title);
        sign.setSignCateCode(category);
        sign.setContent(content);
        sign.setTarget(target);

        try {
            if(attachment != null && !attachment.isEmpty()) {
                String filePath = saveFile(attachment);
                sign.setFilePath(filePath);

                String generatedFileName = UUID.randomUUID().toString();
                sign.setFileName(generatedFileName);

                sign.setFileOriginalName(attachment.getOriginalFilename());
                sign.setFileSize(attachment.getSize());
            }
            mapper.signInsert(sign);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("저장 오류");
        }

    }

    public String saveFile(MultipartFile file) throws Exception {
        String filePath = System.getProperty("user.home") + "/upload";

        String originalFilenName = file.getOriginalFilename();
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String fileName = timestamp + "_" + originalFilenName;

        Path path = Paths.get(filePath, fileName);

        Files.copy(file.getInputStream(), path);
        return path.toString();
    }

    public SignDTO signDetail(int id) {
        return mapper.signDetail(id);
    }

    @Transactional
    public String signUpdate(int id, String target) {
        mapper.signUpdate(target);
        return target;
    }

    @Transactional
    public void signDelete(int id) {
        mapper.signDelete(id);
    }
}
