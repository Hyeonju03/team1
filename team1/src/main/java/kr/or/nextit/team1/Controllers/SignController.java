package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.SignDTO;
import kr.or.nextit.team1.Services.SignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
@RestController
@RequiredArgsConstructor
public class SignController {
    private final SignService service;

    // 문서함 리스트 띄우기
    @GetMapping("/sign/{empCode}")
    public ResponseEntity<List<SignDTO>> signSelect(@PathVariable String empCode) {
        List<SignDTO> signs = service.signSelect(empCode);
        return ResponseEntity.ok(signs);
    }

    // 결재 등록
    @PostMapping("/sign/register")
    public ResponseEntity<String> signInsert(
            @RequestParam String empCode,
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String content,
            @RequestParam String target,
            @RequestParam(required = false) MultipartFile attachment) {
        service.signInsert(empCode, title, category, content, target, attachment);
        return ResponseEntity.ok("Sign in successful");
    }

    // 결제 상세 내용
    @GetMapping("/sign/detail/{id}")
    public ResponseEntity<SignDTO> signDetail(@PathVariable("id") int id) {
        SignDTO sign = service.signDetail(id);
        if(sign != null) {
            return new ResponseEntity<>(sign, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 첨부파일 다운
    @GetMapping("/sign/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("id") int id) throws IOException {
        SignDTO signDTO = service.signDetail(id);

        Path filePath = Paths.get(signDTO.getFilePath()).toAbsolutePath().normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream"; // 기본 바이너리 타입
        }

        String fileName = signDTO.getFileName();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", fileName != null ? fileName : "downloadedFile"))
                .body(resource);
    }

    // 결재 수정 (target만 수정됨)
    @PutMapping("/sign/update/{id}")
    public ResponseEntity<?> signUpdate(
            @PathVariable Long signNum,
            @RequestBody SignDTO request) {
        service.updateSign(signNum, request.getTarget(), request.getEndDate());
        return ResponseEntity.ok().build();
    }



    @DeleteMapping("/sign/delete/{id}")
    public ResponseEntity<Void> signDelete(@PathVariable int id) {
        service.signDelete(id);
        return ResponseEntity.noContent().build();
    }
}
