package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.MailDTO;
import kr.or.nextit.team1.Services.MailSendService;
import kr.or.nextit.team1.mappers.MailMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
public class MailController {

    private final MailSendService mailSendService;
    private final MailMapper mailMapper;

    private final Logger logger = LoggerFactory.getLogger(getClass());

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


    //전체메일
    @GetMapping("/selectSendMail")
    public ResponseEntity<List<MailDTO>> selectSendMail(@RequestParam String empCode, String mailTarget, String mailRef) {
        try {
            List<MailDTO> mails = mailMapper.selectSendMail(empCode, mailTarget, mailRef);

            for (MailDTO mail : mails) {
                if (mail.getEmpCode().replace(String.valueOf("-"), "").equals(mail.getMailTarget().substring(0, mail.getEmpCode().length() - 1)) && mail.getMailTarget().charAt(mail.getEmpCode().length() - 1) == '@') {
                    mail.setEmpCode("내게쓴메일함");
                } else if (mail.getEmpCode().equals(empCode)) {
                    mail.setEmpCode("보낸메일함");
                } else if (!mail.getEmpCode().equals(empCode)) {
                    mail.setEmpCode("받은메일함");
                }
            }

            return ResponseEntity.ok(mails);
        } catch (Exception e) {
            logger.debug(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    //    보낸메일
    @GetMapping("/sentMail")
    public ResponseEntity<List<MailDTO>> sentMail(@RequestParam String empCode) {
        try {
            List<MailDTO> mails = mailMapper.sentMail(empCode);
            return ResponseEntity.ok(mails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

//     내게쓴

    @GetMapping("/selectToMeSendMail")
    public ResponseEntity<List<MailDTO>> selectToMeSendMail(@RequestParam String empCode, String mailTarget) {
        try {
            List<MailDTO> mails = mailMapper.selectToMeSendMail(empCode, mailTarget);
            return ResponseEntity.ok(mails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }


    //첨부파일메일
    @GetMapping("/attachmentMailList")
    public ResponseEntity<List<MailDTO>> attachmentMailList(@RequestParam String mailRef, String mailTarget) {
        try {
            List<MailDTO> mails = mailMapper.attachmentMailList(mailRef, mailTarget);
            return ResponseEntity.ok(mails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    //받은메일
    @GetMapping("/receivedMailList")
    public ResponseEntity<List<MailDTO>> receivedMailList(@RequestParam String mailRef, String mailTarget) {
        try {
            List<MailDTO> mails = mailMapper.receivedMailList(mailRef, mailTarget);
            return ResponseEntity.ok(mails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/deleteMail")
    public ResponseEntity<Void> deleteMail(@RequestBody List<Long> mailNums) {
        MailSendService.deleteMail(mailNums);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/download/{mailNum}")
    public ResponseEntity<Resource> downloadFiles(@PathVariable int mailNum) {
        MailDTO mailDTO = mailSendService.selectFile(mailNum);
        String filePath = mailDTO.getFilePath();
        String fileName = mailDTO.getFileName();
        String originalName = mailDTO.getFileOriginalName();

        //Path path = Paths.get(filePath, fileName);

        String encodedFilename = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\+", " ");

        Resource resource = new PathResource(filePath);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + encodedFilename + "\"")
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(mailDTO.getFileSize()))
                .body(resource);
    }

    @PutMapping("/updateMail")
    public ResponseEntity<Void> updateMail(@RequestBody List<Long> mailNums) {
        mailSendService.updateMail(mailNums);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateTrashMail")
    public ResponseEntity<Void> updateTrashMail(@RequestBody List<Long> mailNums) {
        mailSendService.updateTrashMail(mailNums);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/selectDeleteList")
    public ResponseEntity<List<MailDTO>> selectDeleteList(@RequestParam String empCode) {
        try {
            List<MailDTO> mails = mailMapper.selectDeleteMail(empCode);
            return ResponseEntity.ok(mails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/AlldeleteMail")
    public ResponseEntity<String> AlldeleteMail() {
        try {
            mailSendService.AlldeleteMail();
            return ResponseEntity.ok("휴지통이 비워졌습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("오류 발생: " + e.getMessage());
        }
    }

    //메일 타겟 가져오기
    @GetMapping("/selectMailTarget")
    public ResponseEntity<List<MailDTO>> selectMailTarget(@RequestParam String comCode) {
        try {
            List<MailDTO> mailTargets = mailMapper.selectMailTarget(comCode);
            return ResponseEntity.ok(mailTargets);
        } catch (Exception e) {
            logger.debug(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/selectSenderEmpCode")
    public ResponseEntity<String> selectSenderEmpCode(String mailNum) {
        return ResponseEntity.ok(mailMapper.selectSenderEmpCode(mailNum));

    }

}