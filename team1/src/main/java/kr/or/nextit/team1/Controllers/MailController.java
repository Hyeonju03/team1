package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.MailDTO;
import kr.or.nextit.team1.Services.EmailService;
import kr.or.nextit.team1.Services.MailSendService;
import kr.or.nextit.team1.mappers.MailMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class MailController {

    private final MailSendService mailSendService;
    private final MailMapper mailMapper;

    @Autowired
    public MailController(MailSendService mailSendService, MailMapper mailMapper) {
        this.mailSendService = mailSendService;
        this.mailMapper = mailMapper;
    }

    @PostMapping(value = "/mailSend",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> mailSend(@ModelAttribute MailDTO mailDTO) throws IOException {

        if (mailDTO.getAttachment() != null) {
            String path = mailSendService.saveFile(mailDTO.getAttachment());
            mailDTO.setFilePath(path);

        }

        mailSendService.sendMail(mailDTO);
        return ResponseEntity.ok("Mail sent");
    }

    @GetMapping("/selectSendMail")
    public ResponseEntity<List<MailDTO>> selectSendMail(@RequestParam String empCode) {
        System.out.println("Executing SQL: SELECT ... WHERE EMP_CODE LIKE CONCAT('" + empCode + "', '%')");
        try {
            List<MailDTO> mails = mailMapper.selectSendMail(empCode);
            return ResponseEntity.ok(mails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
