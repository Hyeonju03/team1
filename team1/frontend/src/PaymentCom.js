import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CloudPayment({ pricePerUser = 100 }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { empNum , comCode } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState("kakaopay");
    const baseUsers = 10;
    const extraUsers = Math.max(0, empNum - baseUsers);
    const totalCost = extraUsers * pricePerUser;

    useEffect(() => {
        // Iamport SDK 로드하기
        const script = document.createElement("script");
        script.src = "https://cdn.portone.io/v2/browser-sdk.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            script.remove();
        }
    }, []);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleClose = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    console.log(comCode)
    const fetchData=async ()=>{
        try {
            const resp = await axios.put("/updateStatus", null,{params: {comCode: comCode}});
            console.log(resp);
            navigate("/CompanyInfo");
        } catch (error){
            console.error(error)
        }
    }

    const requestPayment = async (totalAmount) => {
        const resp = await window.PortOne.requestPayment({
            // Store ID 설정
            storeId: "store-8d537446-2e5f-4b3f-b293-52538bc22fbc",
            // 채널 키 설정
            channelKey: "channel-key-ff249e0c-abee-42b9-8b4a-59bbf04c2586",
            paymentId: `payment-${uuidv4()}`,
            orderName: "클라우드 서비스 결제 ",
            totalAmount,
            currency: "CURRENCY_KRW",
            payMethod: "EASY_PAY",
        });

        console.log(resp);

        if (resp.code != null) {
            return alert(resp.message);
        }else{
            alert("결제가 완료되었습니다.")
            fetchData();
        }


    };


    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    return (
        <div className="w-full max-w-md mx-auto border rounded-lg shadow-lg p-6 relative" style={{marginTop:"50px"}}>
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                ✖
            </button>
            <h2 className="text-xl font-bold">클라우드 서비스 추가 결제</h2>
            <p className="text-gray-600">사용자 수 초과에 따른 추가 비용 결제</p>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <span>현재 사용자 수:</span>
                    <span className="font-semibold">{empNum}명</span>
                </div>
                <div className="flex justify-between">
                    <span>초과 사용자 수:</span>
                    <span className="font-semibold">{extraUsers}명</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>추가 비용:</span>
                    <span className="font-bold">{totalCost.toLocaleString()}원</span>
                </div>
            </div>

            {/* 결제 방법 선택 */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <input type="radio" id="kakaopay" name="paymentMethod" value="kakaopay"
                           checked={paymentMethod === "kakaopay"}
                           onChange={() => handlePaymentMethodChange("kakaopay")}/>
                    <label htmlFor="kakaopay" className="cursor-pointer">카카오페이</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="radio" id="card" name="paymentMethod" value="card" checked={paymentMethod === "card"}
                           onChange={() => handlePaymentMethodChange("card")}/>
                    <label htmlFor="card" className="cursor-pointer">신용카드</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="radio" id="transfer" name="paymentMethod" value="transfer"
                           checked={paymentMethod === "transfer"}
                           onChange={() => handlePaymentMethodChange("transfer")}/>
                    <label htmlFor="transfer" className="cursor-pointer">계좌이체</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="radio" id="naverpay" name="paymentMethod" value="naverpay"
                           checked={paymentMethod === "naverpay"}
                           onChange={() => handlePaymentMethodChange("naverpay")}/>
                    <label htmlFor="naverpay" className="cursor-pointer">네이버페이</label>
                </div>
            </div>

            <button onClick={() => requestPayment(totalCost)}
                    className="w-full bg-blue-500 text-white py-2 rounded mt-4">
                결제하기 ({totalCost.toLocaleString()}원)
            </button>
        </div>
    );
}
