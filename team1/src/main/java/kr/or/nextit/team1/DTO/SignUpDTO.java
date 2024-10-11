package kr.or.nextit.team1.DTO;

public class SignUpDTO {
    private String companyCode;
    private String name;
    private String id;
    private String password;
    private String phone;
    private String email;
    private String department;


    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
