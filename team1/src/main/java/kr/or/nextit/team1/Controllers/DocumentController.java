package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.DocumentDTO;
import kr.or.nextit.team1.Services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // 문서함 리스트
    @GetMapping("/company/{comCode}")
    public ResponseEntity<List<DocumentDTO>> documentSelect(@PathVariable String comCode) {
        List<DocumentDTO> documents = documentService.documentSelect(comCode);
        return ResponseEntity.ok(documents);
    }

    // 문서함 등록
    @PostMapping("/documents")
    public ResponseEntity<String> documentInsert(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String content,
            @RequestParam(required = false) MultipartFile attachment, @RequestParam String empCode) {
        documentService.documentInsert(title, category, content, attachment, empCode);
        return ResponseEntity.ok("Document saved successfully");
    }

    // 문서함 상세
    @GetMapping("/documents/{id}")
    public ResponseEntity<DocumentDTO> documentDetail(@PathVariable("id") int id) {
        DocumentDTO document = documentService.documentDetail(id);
        if (document != null) {
            return new ResponseEntity<>(document, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 첨부파일 다운
    @GetMapping("/documents/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("id") int id) throws IOException {
        DocumentDTO documentDTO = documentService.documentDetail(id);

        Path filePath = Paths.get(documentDTO.getFilePath()).toAbsolutePath().normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream"; // 기본 바이너리 타입
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", resource.getFilename()))
                .body(resource);
    }

    // 문서함 수정
    @PutMapping("/documents/{id}")
    public ResponseEntity<DocumentDTO> documentUpdate(@PathVariable int id, @RequestParam Map<String, Object> params,
                                                      @RequestParam(required = false) MultipartFile attachment) {

        // 유효성 검사
        if (params.get("title") == null || params.get("category") == null || params.get("content") == null) {
            return ResponseEntity.badRequest().body(null); // 잘못된 요청 처리
        }

        DocumentDTO documentDTO = new DocumentDTO();
        documentDTO.setDocNum(id);
        Object empCodeObject = params.get("empCode");
        String empCode = empCodeObject != null ? empCodeObject.toString() : null;
        documentDTO.setEmpCode(empCode);
        documentDTO.setDocCateCode((String) params.get("category"));
        documentDTO.setTitle((String) params.get("title"));
        documentDTO.setContent((String) params.get("content"));


        // 기존 문서 정보 가져오기
        DocumentDTO existingDocument = documentService.documentDetail(id);
        if (existingDocument == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 문서가 없는 경우
        }

        String existingFilePath = existingDocument.getFilePath(); // 기존 파일 경로
        try {
            // 새로운 파일이 있을 경우
            if (attachment != null && !attachment.isEmpty()) {
                // 기존 파일 삭제
                Path path = Paths.get(existingFilePath);
                Files.deleteIfExists(path); // 파일 삭제

                // 새로운 파일 저장
                String filePath = documentService.saveFile(attachment); // 파일 저장 로직 재사용
                documentDTO.setFilePath(filePath); // 새로운 파일 경로 설정
                documentDTO.setFileOriginName(attachment.getOriginalFilename()); // 원본 파일 이름 설정
                documentDTO.setFileSize(attachment.getSize()); // 파일 크기 설정


                String generatedFileName = UUID.randomUUID().toString();
                documentDTO.setFileName(generatedFileName);


            } else {
                // 기존 파일 유지
                documentDTO.setFilePath(existingFilePath); // 기존 파일 경로 설정
                documentDTO.setFileOriginName(existingDocument.getFileOriginName()); // 기존 파일 이름 유지
                documentDTO.setFileSize(existingDocument.getFileSize()); // 기존 파일 크기 유지
            }

            // 로그 추가
            System.out.println("Updating document with ID: " + id);
            System.out.println("DocumentDTO: " + documentDTO);


            // 문서 업데이트
            documentService.documentUpdate(id, documentDTO); // 서비스에서 문서 업데이트 호출
            return ResponseEntity.ok(documentDTO); // 업데이트된 문서 반환
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 오류 발생 시 500 반환
        }
    }

    // 문서함 삭제
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> documentDelete(@PathVariable int id) {
        documentService.documentDelete(id);
        return ResponseEntity.noContent().build(); // 삭제 성공시 204 No Content 반환
    }
}


