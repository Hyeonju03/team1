package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.MailDTO;
import kr.or.nextit.team1.Services.EmailService;
import kr.or.nextit.team1.Services.MailSendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class MailController {

   private final MailSendService mailSendService;

   @Autowired
   public MailController(MailSendService mailSendService) {
       this.mailSendService = mailSendService;
   }

    @PostMapping(value="/mailSend",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> mailSend(@ModelAttribute MailDTO mailDTO) throws IOException {

        String path =  mailSendService.saveFile(mailDTO.getAttachment());

        mailDTO.setFilePath(path);
        mailSendService.sendMail(mailDTO);
        return ResponseEntity.ok("Mail sent");
    }
}
