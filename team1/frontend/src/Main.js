import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import Clock from "react-live-clock";
import {useAuth} from "./noticeAuth";
import {useNavigate} from "react-router-dom";

export default function MainLayout() {
    const navigate = useNavigate();
    const [inputId, setInputId] = useState(""); // 사용자 ID 상태 추가
    const [inputPassword, setInputPassword] = useState(""); // 비밀번호 입력
    const {login, empCode, logout, isLoggedIn} = useAuth(); // 인증 훅에서 가져오기
    const [userInfo, setUserInfo] = useState([])

    // 로그인 후 가져와야하는 데이터들
    const [mailList, setMailList] = useState([]) //메일
    const [signCount, setSignCount] = useState(0); //결제
    //일정
    const [scheduleCount, setScheduleCount] = useState(0);
    const [schedule, setSchedule] = useState([]);
    // 인사정보
    const [reqCount, setReqCount] = useState(0); // 부하직원 관련 내용
    // 날씨
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

    const [btnCtl, setBtnCtl] = useState(0)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)


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
        getWeather();
        empInfo();

        axios.get('/selectLog')
            .then(response => console.log(response.data))
            .catch(error => console.log(error))


    }, []);

    useEffect(() => {
        console.log("login", isLoggedIn);
        // newMail();
        newSign();
        newUserInfo();
        todaySchedule();
    }, [empCode, isLoggedIn]);

    // useEffect(() => {
    //     const logData = {
    //         comCode: "TEST_1", log: "메인 페이지 새로고침 테스트임", time: "TEST_TIME"
    //     };
    //
    //     axios.post('/logInsert', logData)
    //         .then(response => console.log(response.data))
    //         .catch(error => console.log(error));
    // }, []);

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
        }
    }

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
        const lat = "36.35";
        const lon = "127.38";
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

        // 오늘 날짜 계산
        const date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + (date.getDate())).slice(-2);
        const today = `${year}-${month}-${day}`;

        try {
            const responseData = await axios.get(url);
            const data = responseData.data;

            // 날짜별 최고/최저 온도를 계산할 객체
            const groupedWeather = {};

            // 날씨 데이터를 날짜별로 그룹핑하고, 최고/최저 온도를 계산
            for (let i = 0; i < data.list.length; i++) {
                const weather = data.list[i];
                const weatherTime = new Date(weather.dt_txt);
                const weatherDate = weatherTime.toISOString().split('T')[0]; // 날짜만 추출 (YYYY-MM-DD 형식)

                // 날짜별로 온도 값을 갱신
                if (!groupedWeather[weatherDate]) {
                    groupedWeather[weatherDate] = {
                        temp_max: weather.main.temp_max,
                        temp_min: weather.main.temp_min,
                    };
                } else {
                    groupedWeather[weatherDate].temp_max = Math.max(groupedWeather[weatherDate].temp_max, weather.main.temp_max);
                    groupedWeather[weatherDate].temp_min = Math.min(groupedWeather[weatherDate].temp_min, weather.main.temp_min);
                }
            }

            // 오늘의 날씨 정보 처리
            let updatedWeathers = [];
            let todayWeatherFound = false; // 오늘 날씨가 이미 찾았는지 여부
            let closestWeather = null; // 가장 가까운 날씨를 저장할 변수
            let closestWeatherIndex = -1;

            // 오늘의 가장 가까운 시간의 날씨 데이터를 찾음
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

            // 가장 가까운 오늘 날씨를 updatedWeathers에 추가
            if (closestWeather) {
                updatedWeathers.push({
                    feels_like: closestWeather.main.feels_like,
                    dt_txt: closestWeather.dt_txt,
                    temp: closestWeather.main.temp,
                    humidity: closestWeather.main.humidity,
                    desc: closestWeather.weather[0].description,
                    icon: closestWeather.weather[0].icon,
                    index: closestWeatherIndex,
                    // 오늘 날짜의 최고/최저 온도 적용
                    temp_max: groupedWeather[today]?.temp_max,
                    temp_min: groupedWeather[today]?.temp_min,
                });
            }

            let nextIndex = closestWeatherIndex + 8; // 다음 날짜는 현재 index에서 8시간 후

            // 나머지 날짜들에 대해서 8시간 간격으로 날씨 데이터 추가
            for (let i = 0; i < data.list.length; i++) {
                const weather = data.list[i];

                // weathers 배열의 길이가 4이면 더 이상 처리하지 않음
                if (updatedWeathers.length === 4) {
                    break; // 더 이상 날씨를 추가하지 않음
                }

                // 가장 처음 넣은 index에서 +8한 값을 기준으로 날씨를 추가
                if (i === nextIndex) {
                    const weatherDate = new Date(weather.dt_txt).toISOString().split('T')[0]; // 날짜만 추출

                    updatedWeathers.push({
                        feels_like: weather.main.feels_like,
                        dt_txt: weather.dt_txt,
                        temp: weather.main.temp,
                        humidity: weather.main.humidity,
                        desc: weather.weather[0].description,
                        icon: weather.weather[0].icon,
                        index: i,
                        // 해당 날짜의 최고/최저 온도 적용
                        temp_max: groupedWeather[weatherDate]?.temp_max,
                        temp_min: groupedWeather[weatherDate]?.temp_min,
                    });

                    nextIndex = i + 8; // 8시간 간격으로 다음 데이터 처리
                }
            }

            // 상태 업데이트
            setWeathers(updatedWeathers);

        } catch (error) {
            console.log(error);
        }
    };

    // 메일 수량
    // 지금 값은 나옴. 하지만 현재와 과거의 메일량 비교는 다시 생각해봐야함
    // const newMail = async () => {
    //     const mailEmpCode = empCode.split("-").join("")+'@damail.com';
    //     const response = await axios.get('/receivedMailList', {
    //         params: {
    //             mailRef: mailEmpCode , mailTarget:mailEmpCode // 필요한 파라미터
    //         }
    //     });
    //     setMailList(response.data);
    // }

    // 롹인 안된 결재 수량
    const newSign = async () => {
        if (!empCode) {
            return false;
        }
        let count = 0;
        axios.get(`/sign/${empCode}`)
            .then(response => {
                response.data.map((sign) => {
                    sign.target.split(",").map((mySign) => {
                        if (mySign.includes(empCode) && mySign.includes("미확인")) {
                            count = count + 1;
                        }
                    })
                })
                setSignCount(count);
            })
            .catch(error => console.log(error));
    }

    // 오늘자 일정 수량(기간에 끼워져 있는거 포함)
    const todaySchedule = async () => {
        if (!empCode) {
            return false;
        }
        // 오늘 날짜 계산
        const date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + (date.getDate())).slice(-2);
        const today = `${year}-${month}-${day}`;

        let schedules = [];
        let count = 0;
        const ownSchedule = await axios.get(`/selectSchedule?empCode=${empCode}`);
        const depSchedule = await axios.get("/selectDepSchedule", {params: {empCode: empCode}});
        const comSchedule = await axios.get("/selectFullSchedule", {params: {empCode: empCode}});

        ownSchedule.data.map((tSchedule) => {
            const start = tSchedule.startDate.split("T")[0];
            const end = tSchedule.endDate.split("T")[0];

            if (start == today) {
                schedules.push(tSchedule)
                count += 1;
            } else if (end == today) {
                schedules.push(tSchedule)
                count += 1;
            } else if (start == today && end > today) {
                schedules.push(tSchedule)
                count += 1;
            }
        })

        depSchedule.data.map((tSchedule) => {
            const start = tSchedule.startDate.split("T")[0];
            const end = tSchedule.endDate.split("T")[0];

            if (start == today) {
                schedules.push(tSchedule)
                count += 1;
            } else if (end > today || end == today) {
                schedules.push(tSchedule)
                count += 1;
            }
        })

        comSchedule.data.map((tSchedule) => {
            const start = tSchedule.startDate.split("T")[0];
            const end = tSchedule.endDate.split("T")[0];

            if (start == today) {
                schedules.push(tSchedule)
                count += 1;
            } else if (end > today || end == today) {
                schedules.push(tSchedule)
                count += 1;
            }
        })

        setScheduleCount(count);
        setSchedule(schedules);
    }

    // 인사정보 수정 요청 들어온거 있는지 확인하기
    const newUserInfo = async () => {
        try {
            let count = 0
            const response = await axios.get(`/${empCode}`);
            if (response.data.modifyReq) {
                const req = response.data.modifyReq.split(",")
                count = req.length;
            }
            setReqCount(count);
        } catch (e) {
            console.error(e);
        }
    }

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="min-h-screen flex flex-col h-[919px]" onContextMenu={windowRClick}>
            {/* Header with centegray logo */}
            {isLoggedIn ? (
                    <>
                        <header className="w-full flex justify-end items-center border-b shadow-md h-14 bg-white">
                            <div className="flex mr-6">
                                <div className="font-bold mr-1">{formattedDate}</div>
                                <Clock
                                    format={'HH:mm:ss'}
                                    ticking={true}
                                    timezone={'Asia/Seoul'}/>
                            </div>
                            <div className="mr-5">
                                <img width="40" height="40"
                                     src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/5A5A5A/external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah.png"
                                     alt="external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah"
                                     onClick={() => {
                                         navigate(`/user/notice/list`)
                                     }}/>
                            </div>
                            <div className="mr-5">
                                <img width="40" height="40" src="https://img.icons8.com/windows/32/5A5A5A/home.png"
                                     alt="home" onClick={() => {
                                    navigate("/")
                                }}/>
                            </div>
                            <div className="mr-16">
                                <img width="45" height="45"
                                     src="https://img.icons8.com/ios-glyphs/60/5A5A5A/user-male-circle.png"
                                     alt="user-male-circle" onClick={togglePanel}/>
                            </div>
                        </header>
                        <div className="w-full h-[5px] bg-gray-400"></div>

                        {/* Main content area */}
                        <div className="bg-gray-100 h-[94%] w-[100%] shadow-inner shadow-gray-400/50">
                            <div className="flex overflow-hidden h-full">
                                {/*<main className="flex-grow p-4">*/}
                                {/*    <div className="container mx-auto">*/}
                                {/*        <h2 className="text-xl font-semibold mb-4">회사설명 (홍보)</h2>*/}
                                {/*        <p>여기에 회사 설명 및 홍보 내용을 추가하세요.</p>*/}
                                {/*    </div>*/}
                                {/*</main>*/}

                                <>
                                    <div
                                        className="ml-[5%] mt-[3.5%] w-[60%] h-[750px] rounded-3xl border-2 border-dashed border-gray-400 p-10">
                                        <table className="w-[100%]">
                                            <tr className="">
                                                <td className="w-[30px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/ReceivedMailList')}>
                                                        <strong
                                                            className="flex flex-col items-center justify-center h-[48px]">
                                                            메일
                                                            {/*<div*/}
                                                            {/*    className="text-white bg-gray-800 w-[32px] h-[24px] rounded-3xl">*/}
                                                            {/*    {mailList.length}*/}
                                                            {/*</div>*/}
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios/50/mail.png" alt="mail"/>
                                                    </div>
                                                </td>
                                                <td className="w-[20px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/documents')}>
                                                        <strong className="flex flex-col items-center justify-center">
                                                            문서함
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios/50/folder-invoices--v2.png"
                                                             alt="folder-invoices--v2"/>
                                                    </div>
                                                </td>
                                                <td className="w-[20px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/sign')}>
                                                        <strong className="flex flex-col items-center justify-center">
                                                            결재함
                                                            <div
                                                                className={`text-white bg-gray-800 w-[24px] h-[24px] rounded-3xl ${signCount === 0 ? "hidden" : "block"}`}>
                                                                {signCount}
                                                            </div>
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios/50/electronic-invoice.png"
                                                             alt="electronic-invoice"/>
                                                    </div>
                                                </td>
                                                <td className="w-[20px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/schedule')}>
                                                        <strong className="flex flex-col items-center justify-center">
                                                            일정
                                                            <div
                                                                className={`text-white bg-gray-800 w-[24px] h-[24px] rounded-3xl ${scheduleCount === 0 ? "hidden" : "block"}`}>
                                                                {scheduleCount}
                                                            </div>
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios/50/calendar-plus.png"
                                                             alt="calendar-plus"/>
                                                    </div>
                                                </td>
                                                <td className="w-[30px]"></td>
                                            </tr>
                                            <tr className="h-[30px]">
                                            </tr>
                                            <tr>
                                                <td className="w-[30px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/userInfo')}>
                                                        <strong className="flex flex-col items-center justify-center">
                                                            인사 정보
                                                            <div
                                                                className={`text-white bg-gray-800 w-[24px] h-[24px] rounded-3xl ${reqCount === 0 ? "hidden" : "block"}`}>
                                                                {reqCount}
                                                            </div>
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios-glyphs/60/user--v1.png"
                                                             alt="user--v1"/>
                                                    </div>
                                                </td>
                                                <td className="w-[20px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/DepartmentManagement')}>
                                                        <strong className="flex flex-col items-center justify-center">
                                                            부서 관리
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios/50/stacked-organizational-chart.png"
                                                             alt="stacked-organizational-chart"/>
                                                    </div>
                                                </td>
                                                <td className="w-[20px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/PositionManagement')}>
                                                        <strong className="flex flex-col items-center justify-center">
                                                            직급 관리
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios/50/parallel-tasks.png"
                                                             alt="parallel-tasks"/>
                                                    </div>
                                                </td>
                                                <td className="w-[20px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/Authority')}>
                                                        <strong className="flex flex-col items-center justify-center">
                                                            권한 관리
                                                            {/* 본인 권한이 뭐가 바뀌었는지 보여주기 */}
                                                            {/*<div*/}
                                                            {/*    className="text-white bg-gray-800 w-[32px] h-[24px] rounded-3xl">1</div>*/}
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios/50/briefcase-settings.png"
                                                             alt="briefcase-settings"/>
                                                    </div>
                                                </td>
                                                <td className="w-[30px]"></td>
                                            </tr>
                                            <tr className="h-[30px]">
                                            </tr>
                                            <tr>
                                                <td className="w-[30px]"></td>
                                                <td className="w-[50px]">
                                                    <div
                                                        className="flex flex-col justify-around items-center w-[100%] h-[200px] p-3 rounded-2xl bg-white shadow-md hover:shadow-xl"
                                                        onClick={() => navigate('/CompanyInfo')}>
                                                        <strong className="flex flex-col items-center justify-center">
                                                            회사 정보
                                                        </strong>
                                                        <img width="60" height="60"
                                                             src="https://img.icons8.com/ios/50/organization.png"
                                                             alt="organization"/>
                                                    </div>
                                                </td>
                                                <td className="w-[20px]"></td>
                                            </tr>
                                        </table>
                                    </div>
                                </>

                                <div
                                    className="flex ml-[2%] mr-[5%] mt-[3.5%] flex-col justify-between h-[750px] w-[40%]">
                                    <div
                                        className="h-[300px] rounded-3xl shadow-lg p-5 bg-gradient-to-t to-blue-400 from-cyan-300">
                                        <div className="">
                                            <div className="w-full">
                                                <div className="flex w-full h-[260px] justify-around ">
                                                    {weathers.map((weather, index) => {
                                                            const imgSrc = `https://openweathermap.com/img/w/${weather.icon}.png`;
                                                            const date = weather.dt_txt.split(" ")[0];
                                                            const day = new Date(date)
                                                            return (
                                                                <div id={index}
                                                                     className="flex flex-col justify-items-center p-2 h-full w-[24%] bg-white/20 rounded-2xl">
                                                                    <div
                                                                        className="font-bold text-white mt-1 mb-1">{weekday[day.getDay()]}</div>
                                                                    <div className="text-3xl text-white mb-7">{weather.temp}°
                                                                    </div>
                                                                    <div className="flex justify-center">
                                                                        <img className="h-16 w-16" src={imgSrc}/>
                                                                    </div>
                                                                    <div className="text-white">{weather.desc}</div>
                                                                    <div className="text-white">{weather.temp_max}°
                                                                        / {weather.temp_min}°
                                                                    </div>
                                                                    <div className="text-white">체감온도 {weather.feels_like}°</div>
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white h-[400px] rounded-3xl shadow-lg p-5">
                                        <div className="text-xl font-bold">
                                            오늘 일정
                                        </div>
                                        <div className="flex flex-col overflow-auto">
                                            {schedule.length === 0 ? (
                                                <div>오늘의 일정이 없습니다!</div>
                                            ) : (
                                                schedule.map((s, i) => {
                                                    if (s.category === "개인") {
                                                        return (
                                                            <div key={i}
                                                                 className="mt-2 p-2 items-center w-[100%] h-[30%] bg-gray-100 rounded-2xl">
                                                                <div className="flex">
                                                                    <p className="w-10 h-10 border-2 border-white rounded-full shadow-md bg-blue-300">
                                                                        {s.category ? " " : ""}
                                                                    </p>
                                                                    <div>
                                                                        <p>{s.startDate} ~ {s.endDate}</p>
                                                                        <p>{s.content}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    if (s.category === "부서") {
                                                        return (
                                                            <div key={i}
                                                                 className="mt-2 p-2 items-center w-[100%] h-[30%] bg-gray-100 rounded-2xl">
                                                                <div>
                                                                    <p>{s.startDate} ~ {s.endDate}</p>
                                                                    <p>{s.content}</p>
                                                                    <p>{s.category}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    if (s.category === "전체") {
                                                        return (
                                                            <div key={i}
                                                                 className="mt-2 p-2 items-center w-[100%] h-[30%] bg-gray-100 rounded-2xl">
                                                                <div>
                                                                    <p>{s.startDate} ~ {s.endDate}</p>
                                                                    <p>{s.content}</p>
                                                                    <p>{s.category}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>) :
                <>
                    <header className="w-full flex justify-end items-center border-b shadow-md h-14 bg-white">
                        <div className="flex mr-6">
                            <div className="font-bold mr-1">{formattedDate}</div>
                            <Clock
                                format={'HH:mm:ss'}
                                ticking={true}
                                timezone={'Asia/Seoul'}/>
                        </div>
                        <div className="mr-5">
                            <img width="40" height="40"
                                 src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/5A5A5A/external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah.png"
                                 alt="external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah"
                                 onClick={() => {
                                     navigate(`/user/notice/list`)
                                 }}/>
                        </div>
                        <div className="mr-5">
                            <img width="40" height="40" src="https://img.icons8.com/windows/32/5A5A5A/home.png"
                                 alt="home" onClick={() => {
                                navigate("/")
                            }}/>
                        </div>
                        <div className="mr-16" onClick={togglePanel}>
                            <img width="45" height="45"
                                 src="https://img.icons8.com/ios-glyphs/60/5A5A5A/user-male-circle.png"
                                 alt="user-male-circle"/>
                            <div className="" >로그인 / 회원가입</div>
                        </div>
                    </header>

                    <div className="bg-gray-100 h-80 flex justify-center">
                        <div className="flex items-center w-96 bg-gray-200">
                            <div className="ml-24">
                                <div className="text-left font-bold text-3xl">
                                    큰 주제
                                    <br/>
                                    이름
                                </div>
                                <div className="text-left">
                                    내용
                                </div>
                            </div>
                        </div>
                        <div className="w-[600px] bg-violet-200 flex">
                            <div className="w-full flex flex-col">
                                <div className="bg-white h-1/5 w-full"></div>
                                <div className="bg-white h-1/5 w-full"></div>
                                <div className="bg-white h-1/5 w-full"></div>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="bg-white h-1/5 w-full"></div>
                                <div className="bg-white h-1/5 w-full"></div>
                                <div className="bg-white h-1/5 w-full"></div>
                            </div>
                        </div>
                    </div>
                </>
            }
            {/*/////////////////////////////////////////////////////////////////*/
            }
            {/* Slide-out panel with toggle button */}
            <div className={`${isPanelOpen ? "" : "hidden"}`}>
                <div
                    className="fixed mt-16 top-0 right-0 h-11/12 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out max-w-xs p-1 rounded-lg border-2 border-gray-300">
                    <div className="p-1 h-full">
                        {/*<div className="text-sm text-center">*/}
                        {/*    <a href="#" className="text-blue-600 hover:underline">*/}
                        {/*        공지사항*/}
                        {/*    </a>*/}
                        {/*    <span className="mx-1">|</span>*/}
                        {/*    <a href="#" className="text-blue-600 hover:underline">*/}
                        {/*        문의사항*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                        {isLoggedIn ?
                            <div className="h-full">
                                <div className="h-1/4">
                                    <div className="flex h-3/6">
                                        <div className="w-1/3 ">
                                            <img width="75px" height="75px" src="/logo192.png"/>
                                        </div>
                                        <div className="w-2/3 text-left">
                                            <p className="">이름: {userInfo.empName}</p>
                                            <p className="">직급: {userInfo.posCode}</p>
                                            <p className="">부서: {userInfo.depCode}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left mb-1">
                                        <p className="">사내 이메일: {userInfo.empMail}</p>
                                        <p className="">전화번호: {userInfo.phoneNum}</p>
                                    </div>


                                    <div className="flex">
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(0)}>
                                            조직도
                                        </button>
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(1)}>
                                            대화방
                                        </button>
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(2)}>
                                            주소록
                                        </button>
                                        <button className="border w-2/5 text-sm p-1"
                                                onClick={() => setBtnCtl(3)}>
                                            공지사항
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
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
                                <button
                                    className="mt-2 w-full h-10 text-white bg-gray-400 hover:bg-gray-500 rounded"
                                    onClick={handleLogout}>로그아웃
                                </button>
                            </div>
                            : (<><h2 className="mt-2">로그인</h2>
                                    <input
                                        type="text"
                                        placeholder="아이디"
                                        className="w-full p-2 mb-2 border rounded"
                                    />
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        className="w-full p-2 mb-4 border rounded"
                                    />
                                    <button
                                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-4">
                                        로그인
                                    </button>
                                </>
                            )}


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
                <div
                    className="fixed mt-14 top-0 right-16 transform -translate-x-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-300"></div>
            </div>
        </div>
    )
        ;
}
