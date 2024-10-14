package kr.or.nextit.team1;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class DocumentController {

    private List<DocumentDTO> documents = new ArrayList<>();
    private int currentId = 1;


//    @GetMapping
//    public List<DocumentDTO> getDocuments() {
////        documents.add(new DocumentDTO(1, "문서 제목 테스트 1", "카테고리 테스트 1", "2024-10-10 12:00"));
////        documents.add(new DocumentDTO(2, "문서 제목 테스트 2", "카테고리 테스트 2", "2024-10-09 13:13"));
//
//        // Document 엔티티를 DocumentDTO로 변환
//        List<DocumentDTO> documentDTOs = documents.stream()
//                .map(document -> new DocumentDTO(document.getId(), document.getTitle(), document.getCategory(), document.getDate(), document.getContent()))
//                .collect(Collectors.toList());
//
//        return documentDTOs;
//    }

    @GetMapping("/document")
    public List<DocumentDTO> getDocuments() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        documents.add(new DocumentDTO(1, "문서 제목 테스트 1", "카테고리 테스트 1",  LocalDateTime.parse("2024-10-10 12:00", formatter), "문서 내용 테스트1"));
        documents.add(new DocumentDTO(2, "문서 제목 테스트 2", "카테고리 테스트 2",  LocalDateTime.parse("2024-10-09 13:13", formatter), "문서 내용 테스트2"));

        // Document 엔티티를 DocumentDTO로 변환
        List<DocumentDTO> documentDTOs = documents.stream()
                .map(document -> new DocumentDTO(document.getId(), document.getTitle(), document.getCategory(), document.getDate(), document.getContent()))
                .collect(Collectors.toList());

        return documentDTOs;
    }

    // 문서함 등록
    @PostMapping("/document")
    public ResponseEntity<String> createDocument(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String content,
            @RequestParam(required = false) MultipartFile attachment) {

        DocumentDTO documentDTO = new DocumentDTO();
        documentDTO.setId(currentId++);
        documentDTO.setTitle(title);
        documentDTO.setCategory(category);
        documentDTO.setContent(content);
        documentDTO.setDate(LocalDateTime.now().plusHours(9));

        // 파일 처리 예시
        if (attachment != null && !attachment.isEmpty()) {
            // 첨부파일 처리 로직 추가
        }

        documents.add(documentDTO); // 문서 저장
        return ResponseEntity.ok("문서가 성공적으로 등록되었습니다. ID: " + documentDTO.getId());
    }
}


