package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.DocumentDTO;
import kr.or.nextit.team1.Services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.Document;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/company/{comCode}")
    public ResponseEntity<List<DocumentDTO>> documentSelect(@PathVariable String comCode) {
        List<DocumentDTO> documents = documentService.documentSelect(comCode);
        return ResponseEntity.ok(documents);
    }

    // 문서함 등록
    @PostMapping("/api/document")
    public ResponseEntity<String> documentInsert(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String content,
            @RequestParam(required = false) MultipartFile attachment) {
        documentService.documentInsert(title, category, content, attachment);
        return ResponseEntity.ok("Document saved successfully");

    }

}


