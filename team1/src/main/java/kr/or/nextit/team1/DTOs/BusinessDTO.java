package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessDTO {
    private String comCode;
    private String comName;
    private String ceoName;
    private String ceoPhone;
    private String contectPhone;
    private int empNum;
    private String comEmail;

}