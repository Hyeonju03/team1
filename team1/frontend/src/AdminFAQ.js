import { useState } from 'react';
import { useNavigate } from "react-router-dom";

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
        { q: '배송은 얼마나 걸리나요?', a: '일반적으로 주문 후 2-3일 내에 배송이 완료됩니다.' },
        { q: '반품 정책은 어떻게 되나요?', a: '구매 후 14일 이내에 제품에 이상이 없는 경우 반품이 가능합니다.' },
        { q: '제품 보증 기간은 얼마인가요?', a: '대부분의 제품은 1년 보증이 제공됩니다. 자세한 내용은 제품 설명을 참조해 주세요.' },
        { q: '해외 배송도 가능한가요?', a: '네, 일부 국가에 한해 해외 배송이 가능합니다. 배송 가능 국가는 주문 시 확인하실 수 있습니다.' },
        { q: '결제 방법은 어떤 것들이 있나요?', a: '신용카드, 체크카드, 계좌이체, 무통장입금 등 다양한 결제 방법을 제공하고 있습니다.' },
        { q: '멤버십 혜택은 무엇인가요?', a: '멤버십 회원은 포인트 적립, 특별 할인, 신제품 우선 구매 등의 혜택을 받으실 수 있습니다.' },
        { q: '교환은 어떻게 신청하나요?', a: '마이페이지에서 교환 신청을 하실 수 있으며, 교환 사유에 따라 처리됩니다.' },
        { q: '품절된 상품은 언제 입고되나요?', a: '품절 상품의 재입고 일정은 상품마다 다르며, 알림 신청을 통해 재입고 소식을 받아보실 수 있습니다.' },
        { q: '쿠폰은 어떻게 사용하나요?', a: '주문 결제 페이지에서 보유하신 쿠폰을 선택하여 적용하실 수 있습니다.' },
        { q: '상품 리뷰는 어떻게 작성하나요?', a: '구매하신 상품의 상세 페이지나 마이페이지의 주문 내역에서 리뷰를 작성하실 수 있습니다.' },
    ];

    const [expandedIndex, setExpandedIndex] = useState(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
    const [question, setQuestion] = useState("");
    const navigate = useNavigate();
    const[searchResult,setSearchResult] = useState([])

    const toggleAnswer = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
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

    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center" style={{ height: "900px" }}>
                    <h2 onClick={goFAQ} className="text-2xl mb-2 cursor-pointer" style={{ marginLeft: "-40px" }}>
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
                    <hr className="border-gray-300 my-2 w-full" />
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
        </div>
    );
}
