package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.DocumentDTO;
import kr.or.nextit.team1.mappers.DocumentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.Document;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentMapper documentMapper;

    public List<DocumentDTO> documentSelect(String comCode) {
        return documentMapper.documentSelect(comCode);
    }

    @Transactional
    public void documentInsert(String title, String category, String content, MultipartFile attachment) {
        DocumentDTO documentDTO = new DocumentDTO();
        documentDTO.setEmpCode("3118115625");
        documentDTO.setTitle(title);
        documentDTO.setDocCateCode(category);
        documentDTO.setContent(content);

        try {
            // 첨부파일 처리 (파일을 저장하고, 경로 등을 documentDTO에 설정)
            if (attachment != null && !attachment.isEmpty()) {
                String filePath = saveFile(attachment);
                documentDTO.setFilePath(filePath);

                String generatedFileName = UUID.randomUUID().toString();
                documentDTO.setFileName(generatedFileName);

                documentDTO.setFileOriginName(attachment.getOriginalFilename());
                documentDTO.setFileSize(attachment.getSize());
            }
            documentMapper.documentInsert(documentDTO);

        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 오류 출력
            throw new RuntimeException("문서 저장 중 오류가 발생했습니다."); // 사용자에게 오류 메시지 반환
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        // 바탕화면 경로를 가져오기
        String filePath = System.getProperty("user.home") + "/Desktop";

        // 파일 이름 설정 (원본 이름 + 현재 시간)
        String originalFileName = file.getOriginalFilename();
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String fileName = timestamp + "_" + originalFileName;

        // 저장할 파일 경로 설정
        Path path = Paths.get(filePath, fileName);

        Files.copy(file.getInputStream(), path);
        return path.toString();
    }

    public DocumentService(DocumentMapper documentMapper) {
        this.documentMapper = documentMapper;
    }

    public DocumentDTO documentDetail(int id){
        return documentMapper.documentDetail(id);
    }
}
