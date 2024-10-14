package kr.or.nextit.team1;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

@RestController
public class RestTestController {

    @GetMapping("/apitest")
    public String[][] callapihttp() {

        StringBuffer result = new StringBuffer();
        try {
            String urlstr = "https://api.odcloud.kr/api/15028076/v1/uddi:c6703050-fc81-4328-a3c7-a9de5e2344b7?page=1&perPage=10&serviceKey=y29JGF6xdsStSGbJOKc8NkPI%2FSWLuF8KO%2B50dOMeXtLSrMpKaLilLhNk8ujpX7A7IHzP8DP7DJLt5PpGsJgsNg%3D%3D";
            URL url = new URL(urlstr);
            HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();
            urlConnection.setRequestMethod("GET");

            BufferedReader br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream(), "UTF-8"));

            String returnLine;

            while ((returnLine = br.readLine()) != null) {
                result.append(returnLine + "\n");
            }
            urlConnection.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
            return new String[][] {{"Error", "API call failed"}};
        }
        // JSON 파싱
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(result.toString());
            JsonNode dataArray = root.get("data"); // "data" 배열 가져오기

            // 사업자등록번호와 회사명을 저장할 2차원 배열 생성
            String[][] businessData = new String[dataArray.size()][4];

            for (int i = 0; i < dataArray.size(); i++) {
                JsonNode dataObject = dataArray.get(i);

                String ceoName = dataObject.get("대표자이름").asText("Unknown"); // "대표자이름" 필드 추출
                String companyName = dataObject.get("회사명").asText("Unknown"); // "회사명" 필드 추출
                String businessNumber = dataObject.get("사업자등록번호").asText("Unknown"); // "사업자등록번호" 필드 추출
                String contectPhone  = dataObject.get("전화번호").asText("Unknown"); // "전화번호" 필드 추출

                businessData[i][0] = ceoName;
                businessData[i][1] = companyName;
                businessData[i][2] = businessNumber;
                businessData[i][3] = contectPhone;
            }

            return businessData;
        } catch (Exception e) {
            e.printStackTrace();
            return new String[][] {{"Error", "JSON parsing failed"}};
        }
    }
}
