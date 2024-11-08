import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";


const Input = ({className, placeholder, ...props}) => (
    <input
        type="text"
        className={`border p-2 rounded ${className}`}
        placeholder={placeholder}
        {...props}
    />
);

const Button = ({variant, children, className, ...props}) => (
    <button
        className={`px-4 py-2 rounded ${variant === 'outline' ? 'border' : 'bg-blue-500 text-white'} ${className}`}
        {...props}
    >
        {children}
    </button>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"/>
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
    </svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
    </svg>
);

export default function FAQPage() {
// 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
    const [question, setQuestion] = useState("");
    const navigate = useNavigate();
    const [searchResult, setSearchResult] = useState([])
    const [categoryResult, setCategoryResult] = useState([])

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;


    const toggleAnswer = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const questionOnChangeHandler = (e) => {
        setQuestion(e.target.value);
    };

    const questionSearch = () => {
        // 클릭 시 question 입력받은 거 조회하는 기능
        const filteredFAQ = categoryResult.filter(item =>
            item.title.includes(question) || item.content.includes(question)
        );
        setSearchResult(filteredFAQ);
        setSelectedCategoryIndex(null);
    };

    const goQDetail = () => {
        navigate("/AdminQDetail");
        window.location.reload();
    };

    const goFAQ = () => {
        navigate("/AdminFAQ");
        window.location.reload();
    };

    const qRegister = () => {
        navigate("/AdminQ");
        window.location.reload();
    };

    const handleCategoryClick = (index) => {
        setSelectedCategoryIndex(index === selectedCategoryIndex ? null : index);
        setExpandedIndex(null); // 모든 답변 닫기
        if (index !== null) {
            const filtered = categoryResult.filter((faq) => faq.category === uniqueResults[index].category);
            setSearchResult(filtered);
        } else {
            setSearchResult([]); // 카테고리가 선택되지 않았을 때 검색 결과 초기화
        }
    };


    const getRandomItems = (items, count) => {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const uniqueResults = categoryResult.filter((faq, index, self) =>
        index === self.findIndex((t) => t.category === faq.category)
    );

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            questionSearch();
        }
    };

    const filteredQuestions = selectedCategoryIndex !== null
        ? categoryResult.filter((faq) => faq.category === uniqueResults[selectedCategoryIndex].category)
        : searchResult;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/FAQList");
                const randomList = getRandomItems(response.data, 10);
                setSearchResult(randomList);
                setCategoryResult(response.data)
                console.log(response.data)
                // console.log(randomList);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData(); // 비동기 함수 호출
    }, []);

    const goQList = () => {
        navigate("/AdminQDetail");
    }
    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await axios.post('/api/employ/logout');
            logout(); // 로그아웃 호출
            navigate("/"); // 로그아웃 후 홈으로 이동
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };


    return (
        // <div className="container mx-auto p-4">
        <div className="overflow-hidden flex flex-col min-h-screen w-full  mx-auto p-4  rounded-lg ">
            <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
                <div className="flex mr-6">
                    <div className="font-bold mr-1">{formattedDate}</div>
                    <Clock
                        format={'HH:mm:ss'}
                        ticking={true}
                        timezone={'Asia/Seoul'}/>
                </div>
                <div className="mr-5">
                    <img width="40" height="40" src="https://img.icons8.com/windows/32/f87171/home.png"
                         alt="home"/>
                </div>
                <div className="mr-16">
                    <img width="45" height="45"
                         src="https://img.icons8.com/ios-glyphs/60/f87171/user-male-circle.png"
                         alt="user-male-circle" onClick={togglePanel}/>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "900px"}}>
                    <h2 onClick={goFAQ} className="text-2xl mb-2 cursor-pointer"
                        style={{marginLeft: "-40px", marginTop: "-200px"}}>
                        <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                              style={{marginRight: "15px"}}/>FAQ
                    </h2>
                    <ul className="mb-4 text-center">
                        <li className="text-2xl mb-2 ">
                            <h2 onClick={goQList} className="cursor-pointer">
                           <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                                 style={{marginLeft: "5px"}}/> {/* 점 추가 */}
                                1:1 상담</h2>
                            <ul className="ml-4">
                                <li onClick={qRegister} className="text-sm cursor-pointer" style={{fontWeight: "400"}}>-
                                    문의작성
                                </li>
                                <li onClick={goQDetail} className="text-sm cursor-pointer" style={{fontWeight: "400"}}>-
                                    문의내역
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <hr className="border-gray-300 my-2 w-full" style={{marginTop: "250px"}}/>
                    <h3 className="text-2xl mb-2 text-center mt-2">CS 센터</h3>
                    <p className="text-lg mb-2 text-center mt-2" style={{fontWeight: "400"}}>1234-5678</p>
                    <p className="text-lg text-center mt-2">월-금 09:00 ~ 12:00<br/>13:00 ~ 18:00</p>
                    <p className="text-lg mt-2 text-center">(공휴일 휴무)</p>
                </div>

                {/* Main content */}
                <div className="flex-1 p-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl font-bold mb-4 text-left">FAQ</div>
                        <div className="flex items-center mb-6" style={{marginRight: "10px"}}>
                            <Input
                                className="flex-grow mr-2"
                                placeholder="궁금한 내용을 입력해주세요"
                                onChange={questionOnChangeHandler}
                                onKeyDown={onKeyDown}
                            />
                            <Button onClick={questionSearch} variant="outline">
                                <SearchIcon/>
                            </Button>
                        </div>

                        <div className="flex justify-center space-x-2 mb-6 overflow-x-auto">
                            {uniqueResults.map((faq, index) => (
                                <Button
                                    onClick={() => handleCategoryClick(index)}
                                    key={index}
                                    variant="outline"
                                    className="bg-black text-white whitespace-nowrap"
                                >
                                    {faq.category}
                                </Button>
                            ))}
                        </div>

                        <div className="border rounded-lg p-4">
                            {filteredQuestions.length > 0 ? (
                                filteredQuestions.map((faq, index) => (
                                    <div key={index} className="border-b last:border-b-0">
                                        <div
                                            className="flex justify-between items-center py-3 cursor-pointer"
                                            onClick={() => toggleAnswer(index)}
                                        >
                                            <span className="font-medium">{faq.title}</span>
                                            {expandedIndex === index ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                                        </div>
                                        {expandedIndex === index && (
                                            <div className="pb-3 text-gray-600 text-start">{faq.content}</div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>검색 결과가 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide-out panel with toggle button */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Panel toggle button */}
                <button
                    onClick={togglePanel}
                    className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-blue-500 text-white w-6 h-12 flex items-center justify-center rounded-l-md hover:bg-blue-600"
                >
                    {isPanelOpen ? '>' : '<'}
                </button>

                <div className="p-4">
                    {isLoggedIn ? <button onClick={handleLogout}>로그아웃</button>
                        : (<><h2 className="text-xl font-bold mb-4">로그인</h2>
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
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                                    로그인
                                </button>
                            </>
                        )}
                    <div className="text-sm text-center mb-4">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                    <h2 className="text-xl font-bold mb-2">메신저</h2>
                    <p>메신저 기능은 준비 중입니다.</p>
                </div>
            </div>

        </div>
    );
}
