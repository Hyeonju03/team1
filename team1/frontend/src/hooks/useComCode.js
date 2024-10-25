import {useEffect, useState} from "react";
import axios from "axios";

export default function useComCode() {
    const [codeCategory, setCodeCategory] = useState(); // 카테고리 상태 추가

    useEffect(() => {
        async function fetchCodeCategory() {
            try {
                // code 테이블에서 카테고리 가져오기
                const resp = await axios.get(`/code/${process.env.REACT_APP_COM_CODE}`);
                const data = resp.data;
                setCodeCategory(data);
            } catch (e) {
                console.error(e);
            }
        }

        fetchCodeCategory();
    }, []);

    return [codeCategory];
}