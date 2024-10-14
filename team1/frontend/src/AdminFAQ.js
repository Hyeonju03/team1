import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Input = ({ className, placeholder, ...props }) => (
    <input
        type="text"
        className={`border p-2 rounded ${className}`}
        placeholder={placeholder}
        {...props}
    />
);

const Button = ({ variant, children, className, ...props }) => (
    <button
        className={`px-4 py-2 rounded ${variant === 'outline' ? 'border' : 'bg-blue-500 text-white'} ${className}`}
        {...props}
    >
        {children}
    </button>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

export default function FAQPage() {
    const faqCategories = [
        {
            category: '배송 관련',
            faqs: [
                { q: '배송은 얼마나 걸리나요?', a: '일반적으로 주문 후 2-3일 내에 배송이 완료됩니다.' },
                { q: '해외 배송도 가능한가요?', a: '네, 일부 국가에 한해 해외 배송이 가능합니다.' },
            ],
        },
        {
            category: '반품 및 교환',
            faqs: [
                { q: '반품 정책은 어떻게 되나요?', a: '구매 후 14일 이내에 제품에 이상이 없는 경우 반품이 가능합니다.' },
                { q: '교환은 어떻게 신청하나요?', a: '마이페이지에서 교환 신청을 하실 수 있습니다.' },
            ],
        },
    ];

    const faqs = [
        { q: '시스템에 어떻게 로그인하나요?', a: '로그인 페이지에서 사용자 ID와 비밀번호를 입력한 후 \'로그인\' 버튼을 클릭하세요.' },
        { q: '비밀번호를 잊어버렸습니다. 어떻게 하나요?', a: ' 로그인 페이지에서 \'비밀번호 찾기\' 링크를 클릭하여 이메일 인증을 통해 비밀번호를 재설정할 수 있습니다.' },
        { q: '사용자가 추가되거나 수정되려면 어떻게 해야 하나요?', a: '관리자 권한을 가진 사용자만 사용자 관리 메뉴에서 추가 및 수정할 수 있습니다.' },
        { q: '어떤 브라우저에서 이 시스템을 사용할 수 있나요?', a: 'Chrome, Firefox, Edge 등 주요 웹 브라우저에서 사용 가능합니다. 최신 버전을 권장합니다.' },
        { q: '시스템에서 제공하는 주요 기능은 무엇인가요?', a: '사용자 관리, 문서 관리, 업무 프로세스 관리, 통계 보고서 생성 등 다양한 기능을 제공합니다.' },
        { q: '시스템 사용 중 문제가 발생했습니다. 어떻게 지원받나요?', a: '기술 지원팀에 문의하거나, 시스템 내의 \'도움말\' 섹션에서 자주 묻는 질문을 확인하세요.' },
        { q: '데이터 백업은 어떻게 하나요?', a: '관리자 메뉴에서 \'데이터 백업\' 옵션을 통해 정기적으로 데이터를 백업할 수 있습니다.' },
        { q: '모바일에서도 사용할 수 있나요?', a: 'A: 현재는 웹 기반으로 제공되며, 모바일 최적화는 진행 중입니다.' },
        { q: '개인 정보 보호 정책은 어떻게 되나요?', a: '개인정보 보호 정책은 시스템 내의 \'이용 약관\'에서 확인할 수 있습니다.' },
        { q: '시스템 사용에 대한 교육은 어떻게 받나요?', a: '정기적인 교육 세션이 있으며, 필요한 경우 개별 교육을 요청할 수 있습니다.' },
    ];

    const [expandedIndex, setExpandedIndex] = useState(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
    const [question, setQuestion] = useState("");
    const navigate = useNavigate();
    const[searchResult,setSearchResult] = useState([])
    const [isPanelOpen, setIsPanelOpen] = useState(false);

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
        const filteredFAQ = faqs.filter(item=>{
          return   item.q.includes(question)
        })
        setSearchResult(filteredFAQ);
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
        setSelectedCategoryIndex(selectedCategoryIndex === index ? null : index);
        setExpandedIndex(null); // 모든 답변 닫기
    };

    useEffect(()=>{
        axios.get('/test')
            .then(response=>{
                console.log(response.data)
            },[])
    })

    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center" style={{ height: "900px" }}>
                    <h2 onClick={goFAQ} className="text-2xl mb-2 cursor-pointer" style={{ marginLeft: "-40px" ,marginTop:"-200px"}}>
                        <span className="inline-block w-2 h-2 bg-black rounded-full mr-2" style={{ marginRight: "15px" }} />FAQ
                    </h2>
                    <ul className="mb-4 text-center">
                        <li className="text-2xl mb-2 ">
                           <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                                 style={{marginLeft: "5px"}}/> {/* 점 추가 */}
                            1:1 상담
                            <ul className="ml-4">
                                <li onClick={qRegister} className="text-lg cursor-pointer" style={{ fontWeight: "400" }}>- 문의작성</li>
                                <li onClick={goQDetail} className="text-lg cursor-pointer" style={{ fontWeight: "400" }}>- 문의내역</li>
                            </ul>
                        </li>
                    </ul>
                    <hr className="border-gray-300 my-2 w-full" style={{marginTop:"250px"}}/>
                    <h3 className="text-2xl mb-2 text-center mt-2">CS 센터</h3>
                    <p className="text-lg mb-2 text-center mt-2" style={{ fontWeight: "400" }}>1234-5678</p>
                    <p className="text-lg text-center mt-2">월-금 09:00 ~ 12:00<br />13:00 ~ 18:00</p>
                    <p className="text-lg mt-2 text-center">(공휴일 휴무)</p>
                </div>

                {/* Main content */}
                <div className="flex-1 p-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl font-bold mb-4 text-left">FAQ</div>
                        <div className="flex items-center mb-6" style={{ marginRight: "10px" }}>
                            <Input
                                className="flex-grow mr-2"
                                placeholder="궁금한 내용을 입력해주세요"
                                onChange={questionOnChangeHandler}
                            />
                            <Button onClick={questionSearch} variant="outline">
                                <SearchIcon />
                            </Button>
                        </div>

                        <div className="flex justify-center space-x-2 mb-6 overflow-x-auto">
                            {faqCategories.map((category, index) => (
                                <Button onClick={() => handleCategoryClick(index)} key={index} variant="outline" className="bg-black text-white whitespace-nowrap">
                                    {category.category}
                                </Button>
                            ))}
                        </div>

                        <div className="border rounded-lg p-4">
                            {selectedCategoryIndex === null ? (
                                <>
                                    <h2 className="text-xl font-semibold mb-2">자주 묻는 질문</h2>
                                    {searchResult.length > 0 ? searchResult.map((faq, index) => (
                                        <div key={index} className="border-b last:border-b-0">
                                            <div
                                                className="flex justify-between items-center py-3 cursor-pointer"
                                                onClick={() => toggleAnswer(index)}
                                            >
                                                <span className="font-medium">{faq.q}</span>
                                                {expandedIndex === index ? (
                                                    <ChevronUpIcon />
                                                ) : (
                                                    <ChevronDownIcon />
                                                )}
                                            </div>
                                            {expandedIndex === index && (
                                                <div className="pb-3 text-gray-600">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        faqs.slice(0, 10).map((faq, index) => (
                                            <div key={index} className="border-b last:border-b-0">
                                                <div
                                                    className="flex justify-between items-center py-3 cursor-pointer"
                                                    onClick={() => toggleAnswer(index)}
                                                >
                                                    <span className="font-medium">{faq.q}</span>
                                                    {expandedIndex === index ? (
                                                        <ChevronUpIcon />
                                                    ) : (
                                                        <ChevronDownIcon />
                                                    )}
                                                </div>
                                                {expandedIndex === index && (
                                                    <div className="pb-3 text-gray-600">
                                                        {faq.a}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </>
                            ) : (
                                faqCategories[selectedCategoryIndex].faqs.map((faq, index) => (
                                    <div key={index} className="border-b last:border-b-0">
                                        <div
                                            className="flex justify-between items-center py-3 cursor-pointer"
                                            onClick={() => toggleAnswer(index)}
                                        >
                                            <span className="font-medium">{faq.q}</span>
                                            {expandedIndex === index ? (
                                                <ChevronUpIcon />
                                            ) : (
                                                <ChevronDownIcon />
                                            )}
                                        </div>
                                        {expandedIndex === index && (
                                            <div className="pb-3 text-gray-600">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))
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
                    <h2 className="text-xl font-bold mb-4">로그인</h2>
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
                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                        로그인
                    </button>
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
