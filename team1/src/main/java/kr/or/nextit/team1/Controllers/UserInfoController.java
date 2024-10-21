package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.UserInfoDTO;
import kr.or.nextit.team1.Services.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserInfoController {

    @Autowired
    private UserInfoService userInfoService;

    // 조회
    @GetMapping("/{empCode}")
    public ResponseEntity<UserInfoDTO> userInfoSelect(@PathVariable String empCode) {
        UserInfoDTO userInfoDTO = userInfoService.userInfoSelect(empCode);

        if (userInfoDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
        }

        return ResponseEntity.ok(userInfoDTO);
    }

    // 수정
    @PutMapping("/userInfoUpdate")
    public ResponseEntity<Void> userInfoUpdate(@PathVariable String empCode, @RequestBody UserInfoDTO userInfoDTO) {
        userInfoDTO.setEmpCode(empCode); // empCode를 DTO에 설정
        boolean updated = userInfoService.userInfoUpdate(userInfoDTO);

        if (updated) {
            return ResponseEntity.status(HttpStatus.OK).build(); // 200 OK
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
    }

}
