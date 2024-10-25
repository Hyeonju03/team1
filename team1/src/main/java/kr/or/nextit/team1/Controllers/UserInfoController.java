package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.UserInfoDTO;
import kr.or.nextit.team1.Services.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserInfoController {

    @Autowired
    private UserInfoService userInfoService;

    // 조회
    @GetMapping("/{empCode}")
    public ResponseEntity<UserInfoDTO> userInfoSelect(@PathVariable String empCode) {
        UserInfoDTO userInfoDTO = userInfoService.userInfoSelect(empCode);
//        System.out.println("userInfoDTO 값 확인: " + userInfoDTO);

        if (userInfoDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
        }

        return ResponseEntity.ok(userInfoDTO);
    }


    // 상관에게 수정 요청
    @PostMapping("/modifyRequest")
    public ResponseEntity<String> userInfoModifyRequest(@RequestBody UserInfoDTO userInfoDTO) {
        try {
//            System.out.println("userInfoDTO.getModifyReq 값 확인: " + userInfoDTO.getModifyReq());
//            System.out.println("userInfoDTO.getCorCode 값 확인: " + userInfoDTO.getCorCode());

            userInfoService.updateRequest(userInfoDTO);
            return ResponseEntity.ok("수정 요청이 완료되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그를 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 요청 실패: " + e.getMessage());
        }
    }

    @GetMapping("/posCode/{empCode}")
    public ResponseEntity<String> getPosCode(@PathVariable String empCode) {
        String posCode = userInfoService.getPosCode(empCode);
        return ResponseEntity.ok(posCode);
    }


    @GetMapping("/userInfo/{corCode}")
    public ResponseEntity<List<UserInfoDTO>> corCodeCheck(@PathVariable String corCode) {
        List<UserInfoDTO> userInfo = userInfoService.corCodeCheck(corCode);
        return ResponseEntity.ok(userInfo);

    }

    // 수정(승인)
    @PutMapping("/userInfo/{empCode}")
    public ResponseEntity<String> userInfoUpdate(@PathVariable String empCode, @RequestBody UserInfoDTO userInfoDTO) {
        try {
            userInfoService.userInfoUpdate(empCode, userInfoDTO);
            return ResponseEntity.ok("정보가 수정 되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("정보 수정 실패: " + e.getMessage());

        }
    }

    // 반려
    @PutMapping("/userInfo/modifyDelete/{corCode}")
    public ResponseEntity<String> modifyReqClear(@PathVariable String corCode) {
        try {
            userInfoService.modifyReqClear(corCode);
            return ResponseEntity.ok("수정 요청이 반려되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("반려 실패: " + e.getMessage());
        }
    }

}
