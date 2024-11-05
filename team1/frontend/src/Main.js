import React, {useState, useEffect} from 'react';
import './App.css';
import axios from "axios";
import Clock from "react-live-clock";
import {useAuth} from "./noticeAuth";

export default function MainLayout() {
    const [inputId, setInputId] = useState(""); // 사용자 ID 상태 추가
    const [inputPassword, setInputPassword] = useState(""); // 비밀번호 입력
    const {login, empCode, logout, isLoggedIn} = useAuth(); // 인증 훅에서 가져오기

    const [btnCtl, setBtnCtl] = useState(0)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)
    const weekday = ['일', '월', '화', '수', '목', '금', '토'];
    const [weathers, setWeathers] = useState([{
        feels_like: '',
        dt_txt: '',
        temp: '',
        temp_max: '',
        temp_min: '',
        humidity: '',
        desc: '',
        icon: '',
        index: '',
    }])


    const windowRClick = async (e) => {
        e.preventDefault()
        await setNewWindowPosY(e.target.getBoundingClientRect().x + 24)
        console.log(e.target.getBoundingClientRect())
        console.log(e.target.value)
        console.log(e.target.className)
        e.target.className === "worker" ? setIsRClick(true) : setIsRClick(false)
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;


    useEffect(() => {
        axios.get('/selectLog')
            .then(response => console.log(response.data))
            .catch(error => console.log(error))

        getWeather();

    }, []);

    useEffect(() => {
        console.log("login", isLoggedIn)
    }, [isLoggedIn]);

    useEffect(() => {
        const logData = {
            comCode: "TEST_1", log: "메인 페이지 새로고침 테스트임", time: "TEST_TIME"
        };

        axios.post('/logInsert', logData)
            .then(response => console.log(response.data))
            .catch(error => console.log(error));
    }, []);

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                '/api/employ/login',
                {
                    empCode: inputId,
                    empPass: inputPassword
                }
            );

            if (response.data.success) {
                login(inputId, response.data.role, response.data.token); // 인증 처리
            } else {
                alert("유효하지 않은 로그인 정보입니다.");
            }
        } catch (error) {
            alert("잘못된 계정 정보입니다. 다시 시도해주세요.");
        }
    };

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await axios.post('/api/employ/logout');
            logout(); // 로그아웃 호출
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    //     날씨
    const getWeather = async () => {
        const apiKey = "7223f964c797bd220d3a6ea44ca406b0";
        const lat = "36.33";
        const lon = "127.42";
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

        // 날씨 포맷
        const date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + (date.getDate())).slice(-2);
        const today = `${year}-${month}-${day}`;

        console.log("today>", today)

        axios.get(url)
            .then((responseData) => {
                const data = responseData.data;
                console.log(responseData.data)
                // 오늘 날씨 정보 처리
                let updatedWeathers = [];
                let todayWeatherFound = false; // 오늘 날씨가 이미 찾았는지 여부
                let closestWeather = null; // 가장 가까운 날씨를 저장할 변수
                let closestWeatherIndex = -1;

                // 오늘의 날씨 데이터 찾기
                for (let i = 0; i < data.list.length; i++) {
                    const weather = data.list[i];
                    const weatherTime = new Date(weather.dt_txt);
                    const timeDiff = Math.abs(weatherTime - date); // 현재 시간과 날씨 시간의 차이 (밀리초)

                    // 현재 시간과 가장 가까운 날씨를 찾음
                    if (i === 0 || timeDiff < closestWeather.timeDiff) {
                        closestWeather = {
                            ...weather,
                            timeDiff,
                            index: i
                        };
                        closestWeatherIndex = i;
                    }
                }

                // 가장 가까운 날씨를 updatedWeathers에 추가
                if (closestWeather) {
                    updatedWeathers.push({
                        feels_like: closestWeather.main.feels_like,
                        dt_txt: closestWeather.dt_txt,
                        temp: closestWeather.main.temp,
                        temp_max: closestWeather.main.temp_max,
                        temp_min: closestWeather.main.temp_min,
                        humidity: closestWeather.main.humidity,
                        desc: closestWeather.weather[0].description,
                        icon: closestWeather.weather[0].icon,
                        index: closestWeatherIndex,
                    });
                }

                let nextIndex = updatedWeathers.length ? updatedWeathers[updatedWeathers.length - 1].index + 8 : 0;

                // 8시간 후 날씨 추가
                for (let i = 0; i < data.list.length; i++) {
                    const weather = data.list[i];

                    // weathers 배열의 길이가 3이면 더 이상 처리하지 않음
                    if (updatedWeathers.length === 4) {
                        break; // 더 이상 날씨를 추가하지 않음
                    }

                    if (i === nextIndex) {
                        updatedWeathers.push({
                            feels_like: weather.main.feels_like,
                            dt_txt: weather.dt_txt,
                            temp: weather.main.temp,
                            temp_max: weather.main.temp_max,
                            temp_min: weather.main.temp_min,
                            humidity: weather.main.humidity,
                            desc: weather.weather[0].description,
                            icon: weather.weather[0].icon,
                            index: i,
                        });
                        nextIndex = i + 8;
                    }
                }

                // 상태 업데이트
                setWeathers(updatedWeathers);
            })
            .catch((error) => console.log(error));
    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="min-h-screen flex flex-col h-[919px]" onContextMenu={windowRClick}>
            {/* Header with centered logo */}
            {isLoggedIn ? (
                    <>
                        <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
                            <div className="flex mr-6">
                                <div className="font-bold mr-1">{formattedDate}</div>
                                <Clock
                                    format={'HH:mm:ss'}
                                    ticking={true}
                                    timezone={'Asia/Seoul'}/>
                            </div>
                            <div className="mr-5">
                                <img width="40" height="40" src="https://img.icons8.com/windows/32/smart-home-2.png"
                                     alt="smart-home-2"/>
                            </div>
                            <div className="mr-16">
                                <img width="45" height="45"
                                     src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/64/external-user-interface-kiranshastry-solid-kiranshastry.png"
                                     alt="external-user-interface-kiranshastry-solid-kiranshastry"
                                     onClick={togglePanel}/>
                            </div>
                            {/*    <div className="container mx-auto flex justify-center items-center h-24">*/}
                            {/*        <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">*/}
                            {/*            /!* Placeholder for logo image *!/*/}
                            {/*            <span className="text-gray-600">로고</span>*/}
                            {/*            /!* Uncomment below and replace with your actual logo image *!/*/}
                            {/*            /!* <img*/}
                            {/*  src="/path-to-your-logo.png"*/}
                            {/*  alt="로고"*/}
                            {/*  className="max-w-full max-h-full object-contain"*/}
                            {/*/> *!/*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                        </header>

                        {/* Main content area */}
                        <div className="bg-gray-100 h-[94%] w-[100%]">
                            <div className="flex overflow-hidden h-full shadow-inner">
                                {/*<main className="flex-grow p-4">*/}
                                {/*    <div className="container mx-auto">*/}
                                {/*        <h2 className="text-xl font-semibold mb-4">회사설명 (홍보)</h2>*/}
                                {/*        <p>여기에 회사 설명 및 홍보 내용을 추가하세요.</p>*/}
                                {/*    </div>*/}
                                {/*</main>*/}
                                <div className="bg-white ml-[5%] mt-[3.5%] w-[60%] h-[750px] rounded-3xl shadow-lg p-5">
                                    <div className="flex overflow-auto justify-around mt-20 mb-10">
                                        <div className="w-[20%] h-[150px] rounded bg-blue-200">
                                            <div>이미지</div>
                                            <div className="w-[50px] h-[50px] rounded-full bg-red-800 p-3 text-white">
                                                1
                                                {/*각 카테고리에 대한 알림 : 없으면 hidden처리*/}
                                            </div>
                                        </div>
                                        <div className="w-[20%] bg-blue-400 rounded">
                                            버튼 2
                                        </div>
                                        <div className="w-[20%] bg-blue-600 rounded">
                                            버튼 3
                                        </div>
                                        <div className="w-[20%] bg-blue-800 rounded">
                                            버튼 4
                                        </div>
                                    </div>
                                </div>
                                <div className="flex ml-[2%] mr-[5%] mt-[3.5%] flex-col justify-between h-[750px] w-[40%]">
                                    <div className="bg-white h-[300px] rounded-3xl shadow-lg p-5">
                                        <div className="">
                                            <div className="w-full">
                                                {/*<div className="flex items-center">*/}
                                                {/*    <img width="35" height="35"*/}
                                                {/*         src="https://img.icons8.com/fluency-systems-regular/50/place-marker--v1.png"*/}
                                                {/*         alt="place-marker--v1"/>*/}
                                                {/*    <div className="font-bold ml-1">대전</div>*/}
                                                {/*</div>*/}
                                                <div className="flex w-full h-[260px] justify-around">
                                                    {weathers.map((weather, index) => {
                                                            const imgSrc = `https://openweathermap.com/img/w/${weather.icon}.png`;
                                                            const date = weather.dt_txt.split(" ")[0];
                                                            const day = new Date(date)
                                                            return (
                                                                <div id={index}
                                                                     className="flex flex-col justify-items-center p-2 h-full w-[24%] bg-gradient-to-t to-blue-400 from-cyan-300 rounded-2xl">
                                                                    <div
                                                                        className="font-bold text-white mt-1 mb-1">{weekday[day.getDay()]}</div>
                                                                    <div className="text-3xl text-white mb-7">{weather.temp * 2}°
                                                                    </div>
                                                                    <div className="flex justify-center">
                                                                        <img className="h-16 w-16" src={imgSrc}/>
                                                                    </div>
                                                                    <div className="text-white">{weather.desc}</div>
                                                                    <div className="text-white">{(weather.temp_max * 3).toFixed(2)}°
                                                                        / {weather.temp_min}°
                                                                    </div>
                                                                    <div className="text-white">체감온도 {weather.feels_like * 2}°</div>
                                                                    {/*<div className="flex">*/}
                                                                    {/*    <div className="h-24 w-24">*/}
                                                                    {/*        <img className="h-24 w-24" src={imgSrc}/>{' '}*/}
                                                                    {/*        <div>{weathers.main}</div>*/}
                                                                    {/*    </div>*/}
                                                                    {/*    <div className="text-7xl text-gray-600">*/}
                                                                    {/*        {weather.temp}°*/}
                                                                    {/*    </div>*/}
                                                                    {/*</div>*/}

                                                                    {/*<div className="m-10">*/}
                                                                    {/*    <div>*/}
                                                                    {/*        <div className='h-[17px]'*/}
                                                                    {/*             style={{marginTop: '7px', marginRight: '8px'}}/>*/}
                                                                    {/*        {weather.humidity}*/}
                                                                    {/*    </div>*/}
                                                                    {/*</div>*/}
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white h-[400px] rounded-3xl shadow-lg p-5">
                                        <div className="flex overflow-auto justify-around mt-20 mb-10">
                                            여기에는 일정 넣을까나
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>) :
                <div>로그인 안되어있음.
                    <div className="mr-16">
                        <img width="45" height="45"
                             src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/64/external-user-interface-kiranshastry-solid-kiranshastry.png"
                             alt="external-user-interface-kiranshastry-solid-kiranshastry"
                             onClick={togglePanel}/>
                    </div></div>
            }
            {/*/////////////////////////////////////////////////////////////////*/
            }
            {/* Sidebar */
            }
            <div
                className={`fixed mt-[55px] top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
            >

                <div className="p-4">
                    {isLoggedIn ?
                        <button
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
                            onClick={handleLogout}>로그아웃
                        </button> :
                        <>
                            <h2 className="text-xl font-bold mb-4">로그인</h2>
                            <input type="text" placeholder="아이디" value={inputId}
                                   className="w-full p-2 mb-2 border rounded"
                                   onChange={(e) => setInputId(e.target.value)}/>
                            <input type="password" placeholder="비밀번호" value={inputPassword}
                                   className="w-full p-2 mb-4 border rounded"
                                   onChange={(e) => setInputPassword(e.target.value)}/>
                            <button
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
                                onClick={handleLogin}>로그인
                            </button>
                        </>
                    }

                    <div className="text-sm text-center mb-2">
                        <a href="#" className="text-blue-600 hover:underline">
                            공지사항
                        </a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">
                            문의사항
                        </a>
                    </div>
                    <div className="h-[600px]">
                        <h3 className="font-semibold mb-2 h-[25px]">메신저</h3>
                        <div className="h-[138px]">
                            <div className="flex">
                                <div className="w-1/3 border">
                                    <img src="/logo192.png"/>
                                </div>
                                <div className="w-2/3 text-left border">
                                    <p>사내 이메일:</p>
                                    <p>전화번호:</p>
                                    <p>상태:</p>
                                </div>
                            </div>
                            <div className="flex">
                                <button className="border w-1/5 text-sm"
                                        onClick={() => setBtnCtl(0)}>
                                    조직도
                                </button>
                                <button className="border w-1/5 text-sm"
                                        onClick={() => setBtnCtl(1)}>
                                    대화방
                                </button>
                                <button className="border w-1/5 text-sm"
                                        onClick={() => setBtnCtl(2)}>
                                    주소록
                                </button>
                                <button className="border w-2/5 text-sm"
                                        onClick={() => setBtnCtl(3)}>
                                    공지사항
                                </button>
                            </div>
                        </div>
                        <div className="border text-left h-[435px] blue">
                            {btnCtl === 0 ? (
                                // ListLibrary.WorkerList(com)
                                <></>
                            ) : btnCtl === 1 ? (
                                <>
                                    <div className="h-[100%] overflow-y-auto">
                                        <div className="border flex justify-between">
                                            <button>대화방</button>
                                            <button>나가기</button>
                                        </div>
                                    </div>
                                </>
                            ) : btnCtl === 2 ? (
                                <>
                                    {/*<div dangerouslySetInnerHTML={{__html: addressBookHtml}}/>*/}
                                </>
                            ) : btnCtl === 3 ? (
                                <>
                                    {/*<div dangerouslySetInnerHTML={{__html: noticeHtml}}/>*/}
                                    <div>
                                        <button
                                            className="text-center border w-full h-[45px]"
                                            onClick={() => setBtnCtl(6)}>
                                            {" "}
                                            공지사항 추가하기
                                        </button>
                                    </div>
                                </>
                            ) : btnCtl === 4 ? (
                                <>
                                    <div className="h-[480px] overflow-y-auto">
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="text-right pb-2">
                                            사용자이름 <li className="pr-4">대화내요ㅛㅛㅛㅛㅛㅇ </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                    </div>
                                </>
                            ) : btnCtl === 5 ? (
                                <>
                                    {/*<div dangerouslySetInnerHTML={{__html: loadNoticeHtml}}/>*/}
                                    <div>
                                        <button
                                            className="text-center border w-full h-[45px]"
                                            onClick={() => setBtnCtl(3)}>
                                            목록으로
                                        </button>
                                    </div>
                                </>
                            ) : btnCtl === 6 ? (
                                <>
                                    {/*{ListLibrary.noticeWritePage(com, setBtnCtl)}*/}
                                    <button
                                        className="text-center border w-full h-[45px]"
                                        onClick={() => {
                                            setBtnCtl(3);
                                            // ListLibrary.noticeInsert(user);
                                        }}
                                    >
                                        공지사항 등록
                                    </button>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    {isRClick === true ? (
                        <></>
                        // <div className={`flex absolute`}
                        //      style={{top: `${newWindowPosY}px`, right: `${newWindowPosX}px`}}>
                        //     <div className="w-1/3 border">
                        //         <img src="/logo192.png"/>
                        //     </div>
                        //     <div className="w-2/3 text-left border">
                        //         <p>사내 이메일:{newWindowData[0]}</p>
                        //         <p>전화번호:{newWindowData[1]}</p>
                        //         <p>상태:</p>
                        //         <button
                        //             onClick={() => {
                        //                 setIsRClick(false);
                        //                 setNewWindowData([]);
                        //             }}
                        //         >
                        //             닫기
                        //         </button>
                        //     </div>
                        // </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    )
        ;
}
