package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.DocumentDTO;
import kr.or.nextit.team1.Services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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
            @RequestParam(required = false) MultipartFile attachment) {
        documentService.documentInsert(title, category, content, attachment);
        return ResponseEntity.ok("Document saved successfully");
    }

    // 문서함 상세
    @GetMapping("/documents/{id}")
    public ResponseEntity<DocumentDTO> documentDetail(@PathVariable("id") int id){
        DocumentDTO document = documentService.documentDetail(id);
        if(document != null){
            return new ResponseEntity<>(document, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/documents/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("id") int id){
        DocumentDTO documentDTO= documentService.documentDetail(id);
        String filePath = documentDTO.getFilePath();
        String fileName = documentDTO.getFileName();
        String fileOriginName = documentDTO.getFileOriginName();

        Path path = Paths.get(filePath, fileName);

        String encodedFileName = URLEncoder.encode(fileOriginName, StandardCharsets.UTF_8).replaceAll("\\+", " ");

        Resource resource = new PathResource(path);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + encodedFileName + "\"")
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(documentDTO.getFileSize()))
                .body(resource);
    }
}


